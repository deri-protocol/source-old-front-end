import { DeriEnv } from "../../config"

export const getOracleConfigList = () => {
  if (DeriEnv.get() === 'prod') {
    return [
      {
        chainId: '56',
        symbol: 'BTCUSD',
        address: '0xe3C58d202D4047Ba227e437b79871d51982deEb7',
      },
      {
        chainId: '56',
        symbol: 'ETHUSD',
        address: '0x9BA8966B706c905E594AcbB946Ad5e29509f45EB',
      },
    ];
  } else {
    return [
      {
        chainId: '97',
        symbol: 'BTCUSD',
        address: '0x72Dba14f90bFF7D74B7556A37205c1291Db7f1E9',
        decimal: '18',
      },
      {
        chainId: '97',
        symbol: 'ETHUSD',
        address: '0x36aF683ba23ef721780FCc0e64F25EB72B294020',
        decimal: '18',
      },
      {
        chainId: '80001',
        symbol: 'ETHUSD',
        address: '0x0715A7794a1dc8e42615F059dD6e406A6594651A',
        decimal: '8',
      },
      {
        chainId: '80001',
        symbol: 'MATICUSD',
        address: '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada',
        decimal: '8',
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