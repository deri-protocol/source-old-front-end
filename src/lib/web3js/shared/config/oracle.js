import { getConfig } from './config';
import { mapToSymbolInternal } from './token';

export const getOracleConfigList = (version='v2', env) => {
  const config = getConfig(version, env)
  return config.oracle
};

export const getOracleConfig = (chainId, symbol, version='v2') => {
  symbol = mapToSymbolInternal(symbol)
  const oracles = getOracleConfigList(version)
  const filteredByChainId = oracles.filter((c) =>
    symbol
      ? c.chainId === chainId && c.symbol === symbol
      : c.chainId === chainId
  );
  if (filteredByChainId.length > 0) {
    if (symbol) {
      return filteredByChainId[0];
    } else {
      return filteredByChainId;
    }
  }
  //console.log(`getOracleConfig(): invalid chainId(${chainId}) or symbol(${symbol}).`);
};
