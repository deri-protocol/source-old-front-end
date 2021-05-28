import { DeriEnv } from "../../config";

export const getPoolConfigList = (env = 'dev') => {
  if (env === 'prod') {
    return [];
  } else {
    return [
      {
        pool: '0x19EC6281749C06Ed9647134c57257AcA1508bFA8',
        pToken: '0x5a08BB6a3C0a20471def9e79B27117ebBEdAf0a7',
        lToken: '0x7743d650D312843C5d34cD860001E64b0C114b19',
        router: '0x1061b8457A036b4A23C8C2346cC62C701e35E2c4',
        bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        bTokenId: '0',
        initialBlock: '',
        bTokenSymbol: 'BUSD',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '97',
        version: 'v2',
      },
      {
        pool: '0x19EC6281749C06Ed9647134c57257AcA1508bFA8',
        pToken: '0x5a08BB6a3C0a20471def9e79B27117ebBEdAf0a7',
        lToken: '0x7743d650D312843C5d34cD860001E64b0C114b19',
        router: '0x1061b8457A036b4A23C8C2346cC62C701e35E2c4',
        bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        bTokenId: '0',
        initialBlock: '',
        bTokenSymbol: 'BUSD',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
      {
        pool: '0x19EC6281749C06Ed9647134c57257AcA1508bFA8',
        pToken: '0x5a08BB6a3C0a20471def9e79B27117ebBEdAf0a7',
        lToken: '0x7743d650D312843C5d34cD860001E64b0C114b19',
        router: '0x1061b8457A036b4A23C8C2346cC62C701e35E2c4',
        bToken: '0x5f59b256e411CB222D1790a08De492f4b6dA6E62',
        bTokenId: '1',
        initialBlock: '',
        bTokenSymbol: 'BETH',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '97',
        version: 'v2',
      },
      {
        pool: '0x19EC6281749C06Ed9647134c57257AcA1508bFA8',
        pToken: '0x5a08BB6a3C0a20471def9e79B27117ebBEdAf0a7',
        lToken: '0x7743d650D312843C5d34cD860001E64b0C114b19',
        router: '0x1061b8457A036b4A23C8C2346cC62C701e35E2c4',
        bToken: '0x5f59b256e411CB222D1790a08De492f4b6dA6E62',
        bTokenId: '1',
        initialBlock: '',
        bTokenSymbol: 'BETH',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
      {
        pool: '0x19EC6281749C06Ed9647134c57257AcA1508bFA8',
        pToken: '0x5a08BB6a3C0a20471def9e79B27117ebBEdAf0a7',
        lToken: '0x7743d650D312843C5d34cD860001E64b0C114b19',
        router: '0x1061b8457A036b4A23C8C2346cC62C701e35E2c4',
        bToken: '0xd2F37BADdB702FF778aA038C63b7068054d93508',
        bTokenId: '2',
        initialBlock: '',
        bTokenSymbol: 'AUTO',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '97',
        version: 'v2',
      },
      {
        pool: '0x19EC6281749C06Ed9647134c57257AcA1508bFA8',
        pToken: '0x5a08BB6a3C0a20471def9e79B27117ebBEdAf0a7',
        lToken: '0x7743d650D312843C5d34cD860001E64b0C114b19',
        router: '0x1061b8457A036b4A23C8C2346cC62C701e35E2c4',
        bToken: '0xd2F37BADdB702FF778aA038C63b7068054d93508',
        bTokenId: '2',
        initialBlock: '',
        bTokenSymbol: 'AUTO',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
    ];
  }
};

export const getFilteredPoolConfigList = (poolAddress, bTokenId, symbolId) => {
  bTokenId = typeof bTokenId === 'number' ? bTokenId.toString() : bTokenId
  symbolId = typeof symbolId === 'number' ? symbolId.toString() : symbolId
  const poolConfigList = getPoolConfigList(DeriEnv.get())
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