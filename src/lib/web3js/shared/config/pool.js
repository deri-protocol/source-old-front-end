import { getConfig } from './config';
import { DeriEnv } from './env';

const expendPoolConfigV2 = (config) => {
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
          });
        }
      }
      return result;
    })
    .flat();
};

const expendPoolConfigV2Lite = (config) => {
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
          router: pool.router,
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
        });
      }
      return result;
    })
    .flat();
};

export const getPoolConfigList = (version='v2', env = 'dev') => {
  const config = getConfig(version, env)
  if (version === 'v2') {
    return expendPoolConfigV2(config)
  } else if (version === 'v2_lite') {
    return expendPoolConfigV2Lite(config)
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

export const getPoolConfig = (poolAddress, bTokenId, symbolId, version='v2') => {
  // check the bToken in v2_lite
  if (version === 'v2_lite') {
    bTokenId = undefined
  }
  const res =  getFilteredPoolConfigList(poolAddress, bTokenId, symbolId, version)
  return res[0]
}

export const getPoolVersion = (poolAddress) => {
  const pools = ['v2', 'v2_lite'].reduce((acc, version) => {
    return acc.concat(getConfig(version, DeriEnv.get())['pools'])
  }, [])
  //console.log('pools', pools)
  const index = pools.findIndex((v) => v.pool === poolAddress)
  //console.log('pools index', index)
  if (index >= 0) {
    return pools[index].version
  }
}

export const _getPoolConfig = (poolAddress) => {
  const version = getPoolVersion(poolAddress)
  const config = getConfig(version, DeriEnv.get())
  const pools = config.pools;
  let pool = pools.find((p) => p.pool === poolAddress);
  //console.log(pool)
  if (pool) {
    return pool
  }
  throw new Error(`Cannot find the pool by poolAddress(${poolAddress})`);
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

export const getPoolLiteViewerConfig = (chainId, version="v2_lite") => {
  const config = getConfig(version, DeriEnv.get())
  const viewers = config.poolLiteViewer.filter((v) => v.chainId === chainId.toString())
  if (viewers.length > 0) {
    return viewers[0].address
  } else {
    throw new Error(`getpoolLiteViewerConfig(): invalid chainId(${chainId}) or version(${version}).`);
  }
};