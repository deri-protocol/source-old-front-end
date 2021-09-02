import { getJsonConfig } from './config';
import { DeriEnv } from './env';
import { getPoolV1ConfigList } from './pool_v1';
import { LITE_AND_OPTION_VERSIONS, VERSIONS } from './version';
import { validateObjectKeyExist } from '../utils';
import { poolProcessor, poolValidator } from './config_processor';
import { openConfigListCache } from '../../v2_lite_open/api/query_api';

const expandPoolConfigV2 = (config) => {
  const pools = config.pools;
  //console.log(pools)
  return pools
    .map((pool) => {
      let result = [];
      for (let i = 0; i < pool.bTokens.length; i++) {
        const bToken = pool.bTokens[i];
        for (let i = 0; i < pool.symbols.length; i++) {
          const symbol = pool.symbols[i];
          result.push({
            pool: pool.pool,
            pToken: pool.pToken,
            lToken: pool.lToken,
            router: pool.router,
            initialBlock: pool.initialBlock,
            chainId: pool.chainId,
            bToken: bToken.bToken,
            bTokenId: bToken.bTokenId,
            bTokenSymbol: bToken.bTokenSymbol,
            symbol: symbol.symbol,
            symbolId: symbol.symbolId,
            unit: symbol.unit,
            version: 'v2',
            isOption: false,
          });
        }
      }
      return result;
    })
    .flat();
};

const expandPoolConfigV2Lite = (config) => {
  const pools = config.pools;
  //console.log(pools)
  return pools
    .map((pool) => {
      let result = [];
      for (let i = 0; i < pool.symbols.length; i++) {
        const symbol = pool.symbols[i];
        result.push({
          pool: pool.pool,
          pToken: pool.pToken,
          lToken: pool.lToken,
          initialBlock: pool.initialBlock,
          chainId: pool.chainId,
          bToken: pool.bToken,
          bTokenSymbol: pool.bTokenSymbol,
          symbol: symbol.symbol,
          symbolId: symbol.symbolId,
          offchainSymbolIds: pool.offchainSymbolIds,
          offchainSymbols: pool.offchainSymbols,
          unit: symbol.unit,
          version: 'v2_lite',
          isOption: false,
        });
      }
      return result;
    })
    .flat();
};

const expandPoolConfigOption = (config) => {
  const pools = config.pools;
  //console.log(pools)
  return pools
    .map((pool) => {
      let result = [];
      for (let i = 0; i < pool.symbols.length; i++) {
        const symbol = pool.symbols[i];
        result.push({
          pool: pool.pool,
          pToken: pool.pToken,
          lToken: pool.lToken,
          initialBlock: pool.initialBlock,
          chainId: pool.chainId,
          bToken: pool.bToken,
          bTokenSymbol: pool.bTokenSymbol,
          symbol: symbol.symbol,
          symbolId: symbol.symbolId,
          offchainSymbolIds: pool.offchainSymbolIds,
          offchainSymbols: pool.offchainSymbols,
          volatilitySymbols: pool.volatilitySymbols,
          unit: symbol.unit,
          version: 'option',
          isOption: true,
        });
      }
      return result;
    })
    .flat();
};

const expandPoolConfigV2LiteOpen = (config) => {
  const pools = config.pools;
  //console.log(pools)
  return pools
    .map((pool) => {
      let result = [];
      if (pool.symbols.length > 0) {
        for (let i = 0; i < pool.symbols.length; i++) {
          const symbol = pool.symbols[i];
          result.push({
            pool: pool.pool,
            pToken: pool.pToken,
            lToken: pool.lToken,
            initialBlock: pool.initialBlock,
            chainId: pool.chainId,
            bToken: pool.bToken,
            bTokenSymbol: pool.bTokenSymbol,
            symbol: symbol.symbol,
            symbolId: symbol.symbolId,
            offchainSymbolIds: pool.offchainSymbolIds,
            offchainSymbols: pool.offchainSymbols,
            unit: symbol.unit,
            version: 'v2_lite_open',
            isOpen: true,
          });
        }
      } else {
        result.push({
          pool: pool.pool,
          pToken: pool.pToken,
          lToken: pool.lToken,
          initialBlock: pool.initialBlock,
          chainId: pool.chainId,
          bToken: pool.bToken,
          bTokenSymbol: pool.bTokenSymbol,
          symbol: '',
          symbolId: '',
          offchainSymbolIds: pool.offchainSymbolIds,
          offchainSymbols: pool.offchainSymbols,
          unit: '',
          version: 'v2_lite_open',
          isOpen: true,
        });
      }
      return result;
    })
    .flat();
};

export const getConfig = (version='v2', env='dev') => {
  let config = getJsonConfig(version, env);

  if (version === 'v2_lite_open') {
    //if (Date.now()/1000 - openConfigListCache.updatedAt() < 15) {
      //console.log('hit openConfigListCache')
    config.pools = openConfigListCache.get()
    //}
  }

  //console.log('>',config)
  const pools = config.pools;
  if (pools && Array.isArray(pools)) {
    for (let i = 0; i < pools.length; i++) {
      poolProcessor[version](pools[i])
      poolValidator[version](pools[i])
    }
  }
  validateObjectKeyExist(['oracle'], config, 'oracle');
  //validateObjectKeyExist(['brokerManager'], configs[env], 'brokerManager')
  return config;
};

export const getPoolConfigList = (version='v2', env = 'dev') => {
  const config = getConfig(version, env)
  if (version === 'v2') {
    return expandPoolConfigV2(config)
  } else if (version === 'v2_lite') {
    return expandPoolConfigV2Lite(config)
  } else if (version === 'v2_lite_open') {
    return expandPoolConfigV2LiteOpen(config)
  } else if (version === 'option') {
    return expandPoolConfigOption(config)
  }
};

export const getFilteredPoolConfigList = (poolAddress, bTokenId, symbolId, version='v2') => {
  bTokenId = typeof bTokenId === 'number' ? bTokenId.toString() : bTokenId
  symbolId = typeof symbolId === 'number' ? symbolId.toString() : symbolId
  const poolConfigList = getPoolConfigList(version, DeriEnv.get())
  const check = bTokenId != null
    ? symbolId != null
      ? (i) =>
          i.pool === poolAddress &&
          i.bTokenId === bTokenId &&
          i.symbolId === symbolId
      : (i) => i.pool === poolAddress && i.bTokenId === bTokenId
    : (symbolId != null ? (i) => i.pool === poolAddress && i.symbolId === symbolId : (i) => i.pool === poolAddress);
  if (poolConfigList.length > 0) {
    const res = poolConfigList.filter(check)
    if (res && res.length > 0) {
      return res
    }
  }
  throw new Error(`getFilteredPoolConfigList(): cannot find the pool config by ${poolAddress} bTokenId(${bTokenId}) and symbolId(${symbolId})`)
}

export const getPoolConfig = (poolAddress, bTokenId, symbolId) => {
  const version = getPoolVersion(poolAddress)
  // check the bToken in v2_lite
  if (LITE_AND_OPTION_VERSIONS.includes(version)) {
    bTokenId = undefined
  }
  const res =  getFilteredPoolConfigList(poolAddress, bTokenId, symbolId, version)
  return res[0]
}
export const getFilteredPoolConfig  = getPoolConfig


export const getPoolVersion = (poolAddress) => {
  let pools = VERSIONS.reduce((acc, version) => {
    return acc.concat(getConfig(version, DeriEnv.get())['pools'])
  }, [])
  // add v1 config
  pools = pools.concat(getPoolV1ConfigList(DeriEnv.get()))
  const index = pools.findIndex((v) => v.pool === poolAddress)
  //console.log('pools index', index)
  if (index >= 0) {
    return pools[index].version
  }
}

export const _getPoolConfig = (poolAddress) => {
  const version = getPoolVersion(poolAddress);
  const config = getConfig(version, DeriEnv.get());
  const pools = config.pools;
  let pool = pools.find((p) => p.pool === poolAddress);
  //console.log(pool)
  if (pool) {
    return pool;
  } else {
    throw new Error(`getPoolConfig, cannot find pool config by pool address ${poolAddress}`)
  }
};

export const getPoolConfig2 = (poolAddress, bTokenId, symbolId) => {
  const pool = _getPoolConfig(poolAddress);
  const defaultBToken = {
    bTokenId: '',
    bTokenSymbol: '',
    bToken: '',
  };
  const defaultSymbol = {
    symbolId: '',
    symbol: '',
    unit: '',
  };
  let bToken, symbol;
  if (bTokenId !== undefined || bTokenId !== null) {
    bToken = pool.bTokens.find((b) => b.bTokenId === bTokenId) || defaultBToken;
  }
  if (symbolId !== undefined || symbolId !== null) {
    symbol = pool.symbols.find((b) => b.symbolId === symbolId) || defaultSymbol;
  }
  return {
    pool: pool.pool,
    pToken: pool.pToken,
    lToken: pool.lToken,
    router: pool.router,
    bTokenCount: pool.bTokenCount,
    symbolCount: pool.symbolCount,
    initialBlock: pool.initialBlock,
    chainId: pool.chainId,
    bToken: bToken.bToken,
    bTokenId: bToken.bTokenId,
    bTokenSymbol: bToken.bTokenSymbol,
    symbol: symbol.symbol,
    symbolId: symbol.symbolId,
    unit: symbol.unit,
    version: 'v2',
  };
};

export const getPoolBTokenList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.bTokens.map((b) => {
    return {
      bTokenId: b.bTokenId,
      bTokenSymbol: b.bTokenSymbol,
      bTokenAddress: b.bToken,
    };
  });
};

export const getPoolBTokenIdList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.bTokens.map((b) => b.bTokenId);
};

export const getPoolSymbolList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.symbols.map((s) => {
    return {
      symbol: s.symbol,
      symbolId: s.symbolId,
      unit: s.unit,
    };
  });
};

export const getPoolSymbolIdList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.symbols.map((b) => b.symbolId);
};

export const getPoolViewerConfig = (chainId, version="v2_lite") => {
  const env = DeriEnv.get()
  const config = getJsonConfig(version, env)
  const viewers = config.poolViewer.filter((v) => v.chainId === chainId.toString())
  if (viewers.length > 0) {
    return viewers[0].address
  } else {
    throw new Error(`getPoolViewerConfig(): invalid chainId(${chainId}) or version(${version}).`);
  }
};