import { getConfig } from './config';

export const getOracleConfigList = (version) => {
  const config = getConfig(version)
  return config.oracle
};

export const getOracleConfig = (chainId, symbol, version='v2') => {
  const filteredByChainId = getOracleConfigList(version).filter((c) =>
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
  throw new Error(`getOracleConfig(): invalid chainId(${chainId}) or symbol(${symbol}).`);
};
