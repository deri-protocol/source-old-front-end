import { DeriEnv } from "../../config";

export const getPoolConfigList = (env = 'dev') => {
  if (env === 'prod') {
    return [
      {
        pool: '0x19c2655A0e1639B189FB0CF06e02DC0254419D92',
        pToken: '0x2AA5865BF556ab3f6Cd9405e565099f70234dF05',
        lToken: '0x6f8F1C2781b555B63F1A1BE85BF99aEe27d87cB2',
        router: '0xC9C234243f48Fa05A993c29B4F5f93048f5b07E4',
        bToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        bTokenId: '0',
        initialBlock: '7884650',
        bTokenSymbol: 'BUSD',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '56',
        version: 'v2',
      },
      {
        pool: '0x19c2655A0e1639B189FB0CF06e02DC0254419D92',
        pToken: '0x2AA5865BF556ab3f6Cd9405e565099f70234dF05',
        lToken: '0x6f8F1C2781b555B63F1A1BE85BF99aEe27d87cB2',
        router: '0xC9C234243f48Fa05A993c29B4F5f93048f5b07E4',
        bToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
        bTokenId: '0',
        initialBlock: '7884650',
        bTokenSymbol: 'BUSD',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '56',
        version: 'v2',
      }
    ];
  } else {
    return [
      {
        pool:   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5',
        pToken: '0x270128C2d7E8713c8c25F7800738C29214eAFeBA',
        lToken: '0x904262d92B21e5214278632d01405738d841d82a',
        router: '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6',
        bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        bTokenId: '0',
        initialBlock: '9516935',
        bTokenSymbol: 'BUSD',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '97',
        version: 'v2',
      },
      {
        pool:   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5',
        pToken: '0x270128C2d7E8713c8c25F7800738C29214eAFeBA',
        lToken: '0x904262d92B21e5214278632d01405738d841d82a',
        router: '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6',
        bToken: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        bTokenId: '0',
        initialBlock: '9516935',
        bTokenSymbol: 'BUSD',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
      {
        pool:   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5',
        pToken: '0x270128C2d7E8713c8c25F7800738C29214eAFeBA',
        lToken: '0x904262d92B21e5214278632d01405738d841d82a',
        router: '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6',
        bToken: '0xd2F37BADdB702FF778aA038C63b7068054d93508',
        bTokenId: '1',
        initialBlock: '9516935',
        bTokenSymbol: 'AUTO',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '97',
        version: 'v2',
      },
      {
        pool:   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5',
        pToken: '0x270128C2d7E8713c8c25F7800738C29214eAFeBA',
        lToken: '0x904262d92B21e5214278632d01405738d841d82a',
        router: '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6',
        bToken: '0xd2F37BADdB702FF778aA038C63b7068054d93508',
        bTokenId: '1',
        initialBlock: '9516935',
        bTokenSymbol: 'AUTO',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
      {
        pool:   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5',
        pToken: '0x270128C2d7E8713c8c25F7800738C29214eAFeBA',
        lToken: '0x904262d92B21e5214278632d01405738d841d82a',
        router: '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6',
        bToken: '0x5b403E0f6686725171c2Baa7A0b7cD4253B0bc57',
        bTokenId: '2',
        initialBlock: '9516935',
        bTokenSymbol: 'CAKE',
        symbol: 'BTCUSD',
        symbolId: '0',
        unit: 'BTC',
        chainId: '97',
        version: 'v2',
      },
      {
        pool:   '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5',
        pToken: '0x270128C2d7E8713c8c25F7800738C29214eAFeBA',
        lToken: '0x904262d92B21e5214278632d01405738d841d82a',
        router: '0x07fb21FE50A31dFaf312dFa9f5BA5CF14DC7E1e6',
        bToken: '0x5b403E0f6686725171c2Baa7A0b7cD4253B0bc57',
        bTokenId: '2',
        initialBlock: '9516935',
        bTokenSymbol: 'CAKE',
        symbol: 'ETHUSD',
        symbolId: '1',
        unit: 'ETH',
        chainId: '97',
        version: 'v2',
      },
      {
        pool:   '0x35a85396e7A8a9E85170fbb589ce085abcAd8266',
        pToken: '0x3495f770eC0dc8701d2b89454047A8521306E070',
        lToken: '0xeFCbBF65100FC2C2b96E92c9AbFfeC384177943e',
        router: '0x4861a9958B65eA8146B89Af929a80c352c905270',
        bToken: '0x1BD7B233B054AD4D1FBb767eEa628f28fdE314c6',
        bTokenId: '0',
        initialBlock: '14917984',
        bTokenSymbol: 'USDT',
        symbol: 'ETHUSD',
        symbolId: '0',
        unit: 'ETH',
        chainId: '80001',
        version: 'v2',
      },
      {
        pool:   '0x35a85396e7A8a9E85170fbb589ce085abcAd8266',
        pToken: '0x3495f770eC0dc8701d2b89454047A8521306E070',
        lToken: '0xeFCbBF65100FC2C2b96E92c9AbFfeC384177943e',
        router: '0x4861a9958B65eA8146B89Af929a80c352c905270',
        bToken: '0x1BD7B233B054AD4D1FBb767eEa628f28fdE314c6',
        bTokenId: '0',
        initialBlock: '14917984',
        bTokenSymbol: 'USDT',
        symbol: 'MATICUSD',
        symbolId: '1',
        unit: 'MATIC',
        chainId: '80001',
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