import { DeriEnv } from "../../config"

export const getOracleConfigList = () => {
  if (DeriEnv.get() === 'prod') {
    return [];
  } else {
    return [
      {
        chainId: '97',
        symbol: 'BTCUSD',
        address: '0x72Dba14f90bFF7D74B7556A37205c1291Db7f1E9',
      },
      {
        chainId: '97',
        symbol: 'ETHUSD',
        address: '0x36aF683ba23ef721780FCc0e64F25EB72B294020',
      },
    ];
  }
};

export const getOracleConfig = (chainId, symbol) => {
  const filteredByChainId = getOracleConfigList().filter((c) => symbol ? c.chainId === chainId && c.symbol === symbol : c.chainId === chainId)
  if (filteredByChainId.length > 0) {
    if (symbol) {
      return filteredByChainId[0]
    } else {
      return filteredByChainId
    }
  }
  throw new Error('getOracleConfig(): invalid chainId or symbol.', chainId, symbol)
}