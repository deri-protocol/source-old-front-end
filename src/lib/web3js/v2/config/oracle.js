import { getConfig } from './config';

export const getOracleConfigList = (version) => {
  const config = getConfig(version)
  return config.oracle
};

const offchainSymbolPairs = {
  AXSUSDT: 'AXSUSDT',
  MANAUSDT: 'MANAUSDT',
  MBOXUSDT: 'MBOXUSDT',
  IBSCDEFI: 'iBSCDEFI',
  IGAME: 'iGAME',
};

export const isUsedRestOracle = (symbol) => {
  return Object.keys(offchainSymbolPairs).includes(symbol);
};

export const mapToSymbol = (symbol) => {
  if (Object.keys(offchainSymbolPairs).includes(symbol)) {
    return offchainSymbolPairs[symbol]
  } else {
    return symbol
  }
}

export const mapToSymbolInternal = (symbol) => {
  const index = Object.values(offchainSymbolPairs).indexOf(symbol)
  if (index !== -1) {
    return Object.keys(offchainSymbolPairs)[index]
  } else {
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
