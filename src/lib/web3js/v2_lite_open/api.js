import { catchApiError, DeriEnv, getOracleConfigList } from "../shared"
import { getPoolV2LiteManagerConfig } from "./config"
import { perpetualPoolLiteFactory, perpetualPoolLiteManagerFactory } from "./factory"

export const getPoolV2LiteOpenConfigList = async (chainId) => {
  return catchApiError(
    async () => {
      const env = DeriEnv.get();
      const poolManagerAddress = getPoolV2LiteManagerConfig(env);
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
      const configs = await Promise.all(
        addresses.reduce(
          (acc, address) =>
            acc.concat([
              perpetualPoolLiteFactory(chainId, address).getConfig(),
            ]),
          []
        )
      );
      return configs;
    },
    [chainId],
    'getPoolV2LiteOpenConfigList',
    []
  );
};

export const getPoolV2LiteOpenOracleInfos = () => {
  return catchApiError(
    async () => {
      return getOracleConfigList('v2_lite_open', DeriEnv.get());
    },
    [],
    'getPoolV2LiteOpenOracleInfos',
    []
  );
};


// poolLiteManager =>  createPool()

// poolLite => addSymbol()