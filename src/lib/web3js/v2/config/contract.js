import { bTokenFactory } from "../../factory/contracts";

export const getPoolConfigList = (env = 'dev') => {
  if (env === 'prod') {
    return [];
  } else {
    return [
      {
        pool: '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        pToken: '0xeBA1c76F7A773B8210130f068798839F84392241',
        lToken: '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57',
        router: '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1',
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
        pool: '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        pToken: '0xeBA1c76F7A773B8210130f068798839F84392241',
        lToken: '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57',
        router: '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1',
        bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        bTokenId: '0',
        initialBlock: '',
        bTokenSymbol: 'BETH',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
      {
        pool: '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        pToken: '0xeBA1c76F7A773B8210130f068798839F84392241',
        lToken: '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57',
        router: '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1',
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
        pool: '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        pToken: '0xeBA1c76F7A773B8210130f068798839F84392241',
        lToken: '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57',
        router: '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1',
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
        pool: '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        pToken: '0xeBA1c76F7A773B8210130f068798839F84392241',
        lToken: '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57',
        router: '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1',
        bToken: '0x0E7593F7058958dD3c6D487f0Bcb4F5455B64B67',
        bTokenId: '3',
        initialBlock: '',
        bTokenSymbol: 'BETH',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
    ];
  }
};

export const getFilteredPoolConfigList = (env='dev', poolAddress, bTokenId, symbolId) => {
  bTokenId = typeof bTokenId === 'number' ? bTokenId.toString() : bTokenId
  symbolId = typeof symbolId === 'number' ? symbolId.toString() : symbolId
  const poolConfigList = getPoolConfigList(env)
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

export const getPoolConfig = (env='dev', poolAddress, bTokenId, symbolId) => {
  const res =  getFilteredPoolConfigList(env, poolAddress, bTokenId, symbolId)
  return res[0]
}