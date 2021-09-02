import { catchApiError } from "../../shared/utils/api"
import { DeriEnv } from "../../shared/config/env"
import { getOracleConfigList } from "../../shared/config/oracle"
import { getJsonConfig } from "../../shared/config/config"
import { expandPoolConfigV2LiteOpen, getPoolV2LiteManagerConfig, openPoolChainIds } from "../config"
import { perpetualPoolLiteFactory, perpetualPoolLiteManagerFactory } from "../factory"
import { isBrowser, normalizeChainId, toChecksumAddress, validateObjectKeyExist } from "../../shared/utils"
import { poolProcessor, poolValidator } from "../../shared/config/config_processor"

export const getPoolOpenConfigList = async (...args) => {
  return catchApiError(
    async () => {
      let configs = [];
      const chainIds = openPoolChainIds()
      configs = chainIds.reduce(async (acc, chainId) => {
        //console.log('chainId', chainId)
        const { address: poolManagerAddress } = getPoolV2LiteManagerConfig(
          chainId
        );
        const poolManager = perpetualPoolLiteManagerFactory(
          chainId,
          poolManagerAddress
        );
        // get pool numbers
        const poolNums = parseInt(await poolManager.getNumPools());
        const numsArray = [...Array(poolNums).keys()];
        // get pool addresses
        const addresses = await Promise.all(
          numsArray.reduce(
            (acc, id) => acc.concat([poolManager.pools(id.toString())]),
            []
          )
        );
        // get pools config
        const res = await Promise.all(
          addresses.reduce(
            (acc, address) =>
              acc.concat([
                perpetualPoolLiteFactory(chainId, address).getConfig(),
              ]),
            []
          )
        );
        return acc.concat(res);
      }, []);
      return configs;
    },
    args,
    'getPoolOpenConfigList',
    []
  );
};

export const getPoolOpenOracleList = (chainId) => {
  chainId = normalizeChainId(chainId)
  return catchApiError(
    async () => {
      return getOracleConfigList('v2_lite_open', DeriEnv.get()).filter((o) => o.chainId === chainId);
    },
    [],
    'getPoolOpenOracleInfos',
    []
  );
};

export const getPoolController = async(chainId, poolAddress) => {
  chainId = normalizeChainId(chainId)
  const perpetualPoolLite = perpetualPoolLiteFactory(chainId, poolAddress)
  return await perpetualPoolLite.controller()
}
export const isPoolController = async(chainId, poolAddress, controller) => {
  chainId = normalizeChainId(chainId)
  const perpetualPoolLite = perpetualPoolLiteFactory(chainId, poolAddress)
  const poolController = await perpetualPoolLite.controller()
  return toChecksumAddress(controller) === toChecksumAddress(poolController)
}

export const getExpandedPoolOpenConfigList = async () => {
  const env = DeriEnv.get()
  const version = 'v2_lite_open'
  let config = getJsonConfig(version, env);

  config.pools =  await getPoolOpenConfigList()
  const pools = config.pools
  if (pools && Array.isArray(pools)) {
    for (let i = 0; i < pools.length; i++) {
      poolProcessor[version](pools[i])
      poolValidator[version](pools[i])
    }
  }
  validateObjectKeyExist(['oracle'], config, 'oracle');
  return expandPoolConfigV2LiteOpen(config);
}


// v2lite open config list cache
export const openConfigListCache = (() => {
  let cache = {
    data: [],
    timestamp: 0,
  };
  return {
    async update() {
      let res
      const oldData = cache.data
      try {
        if (cache.timestamp <= 0) {
        //if (Date.now()/1000 - cache.timestamp > 60) {
          cache.data = await getPoolOpenConfigList()
          cache.timestamp = Date.now()/1000
          res = 'v2 lite open config list is updated'
        }
      } catch(err) {
        console.log(err)
        cache.data = oldData
        res = `v2 lite open config list updating with error: ${err}`
      }
      // res && console.log(res)
      return cache.data
    },
    updatedAt() {
      return cache.timestamp
    },
    get() {
      return cache.data
    }
  }
})()

// init
const initCache = () => {
  if (isBrowser()) {
    if(window.ethereum) {
      window.ethereum.request({ method: 'net_version' }).then((chainId) => {
        if (['1', '56', '137', '128'].includes(chainId)) {
          DeriEnv.set('prod')
          openConfigListCache.update().then((res) => console.log(res))
        } else {
          openConfigListCache.update().then((res) => console.log(res))
        }
      })
    }
  }
};
initCache()