import { getConfig } from './config';

const expendPoolConfig = (config) => {
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

export const getPoolConfigList = () => {
  const config = getConfig()
  return expendPoolConfig(config)
};

export const getFilteredPoolConfigList = (poolAddress, bTokenId, symbolId) => {
  bTokenId = typeof bTokenId === 'number' ? bTokenId.toString() : bTokenId
  symbolId = typeof symbolId === 'number' ? symbolId.toString() : symbolId
  const poolConfigList = getPoolConfigList()
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
  throw new Error(`Cannot find the pool config by poolAddress(${poolAddress}) bTokenId(${bTokenId}) and symbolId(${symbolId})`)
}

export const getPoolConfig = (poolAddress, bTokenId, symbolId) => {
  const res =  getFilteredPoolConfigList(poolAddress, bTokenId, symbolId)
  return res[0]
}

export const _getPoolConfig = (poolAddress) => {
  const config = getConfig()
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
    broker: pool.broker,
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

export const getBTokenList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.bTokens.map((b) => {
    return {
      bTokenId: b.bTokenId,
      bTokenSymbol: b.bTokenSymbol,
      bTokenAddress: b.bToken,
    };
  });
};

export const getBTokenIdList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.bTokens.map((b) => b.bTokenId);
};

export const getSymbolList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.symbols.map((s) => {
    return {
      symbol: s.symbol,
      symbolId: s.symbolId,
      unit: s.unit,
    };
  });
};

export const getSymbolIdList = (poolAddress) => {
  const pool = _getPoolConfig(poolAddress);
  return pool.symbols.map((b) => b.symbolId);
};