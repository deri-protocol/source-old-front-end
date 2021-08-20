import { getConfig } from './config';

export const getOracleConfigList = (version='v2', env) => {
  const config = getConfig(version, env)
  return config.oracle
};

const bTokenPairs = {
  AMUSDC: 'amUSDC',
};

const offchainSymbolPairs = {
  AXSUSDT: 'AXSUSDT',
  MANAUSDT: 'MANAUSDT',
  MBOXUSDT: 'MBOXUSDT',
  IBSCDEFI: 'iBSCDEFI',
  IGAME: 'iGAME',
  ALICEUSDT: 'ALICEUSDT',
  SANDUSDT: 'SANDUSDT',
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

export const mapToBToken = (bToken) => {
  if (Object.keys(bTokenPairs).includes(bToken)) {
    return bTokenPairs[bToken]
  } else {
    return bToken
  }
}

export const mapToBTokenInternal = (bToken) => {
  const index = Object.values(bTokenPairs).indexOf(bToken)
  if (index !== -1) {
    return Object.keys(bTokenPairs)[index]
  } else {
    return bToken
  }
}

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

export const normalizeSymbolUnit = (symbol) => {
  const prefix = ['USD', 'USDT'];
  const re = new RegExp(`(${prefix.join('|')})$`);
  if (typeof symbol === 'string') {
    return mapToSymbol(symbol).replace(re, '');
  }
  console.log(`symbol(${symbol}) is not a string type`);
  return symbol;
};