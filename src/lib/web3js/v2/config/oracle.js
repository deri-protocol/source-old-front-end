import { getConfig } from './config';

export const getOracleConfigList = (version) => {
  const config = getConfig(version)
  return config.oracle
};

export const isUsedRestOracle = (symbol) => {
  return ['AXSUSDT', 'MANAUSDT', 'MBOXUSDT', 'IBSCDEFI'].includes(symbol);
};
export const mapToSymbol = (symbol) => {
  switch(symbol) {
    case 'IBSCDEFI':
      return 'iBSCDeFi'
    default:
      return symbol
  }
}
export const mapToSymbolInternal = (symbol) => {
  switch(symbol) {
    case 'iBSCDeFi':
      return 'IBSCDEFI'
    default:
      return symbol
  }
}

export const getOracleConfig = (chainId, symbol, version='v2') => {
  symbol = mapToSymbolInternal(symbol)
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
