import { getConfig } from './config';

export const getOracleConfigList = () => {
  const config = getConfig()
  return config.oracle
};

export const getOracleConfig = (chainId, symbol) => {
  const filteredByChainId = getOracleConfigList().filter((c) =>
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
