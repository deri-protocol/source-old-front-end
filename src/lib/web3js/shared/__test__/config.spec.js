import {
  getChainProviderUrls,
  getPoolConfigList,
  getFilteredPoolConfigList,
  getPoolConfig,
  getPoolConfig2,
  getOracleConfigList,
  getOracleConfig,
  getDailyBlockNumberConfig,
  getChainIds,
  getPoolVersion,
  mapToSymbol,
  getBrokerConfig,
  mapToSymbolInternal,
  isUsedRestOracle,
  getPreminingConfigList,
  DeriEnv,
} from '../config';
import { normalizeSymbolUnit } from '../config/oracle';
import { bg } from '../utils';
import {
  POOL_V2_ADDRESS,
  ROUTER_V2_ADDRESS,
  BTOKEN_ADDRESS,
  BTCUSD_ORACLE_V2_ADDRESS,
  BTCUSD_ORACLE_V2L_ADDRESS,
  PTOKEN_V2_ADDRESS,
  LTOKEN_V2_ADDRESS,
  BROKER_MANAGER_V2_ADDRESS,
  POOL_V2L_ADDRESS,
} from './setup';

describe('config', () => {
  test('getChainIds()', () => {
    const output = 8;
    expect(getChainIds().length).toEqual(output);
  });
  test('getDailyBlockNumberConfig()', () => {
    const output = {
      1: '6486',
      56: '28759',
      128: '28798',
      3: '6486',
      97: '28759',
      256: '28798',
      137: '40405',
      80001: '40405',
    };
    expect(getDailyBlockNumberConfig()).toEqual(output);
  });
  test('getChainProviderUrls()', () => {
    const output = [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
    ];
    expect(getChainProviderUrls('56')).toEqual(output);
  });
  test('getPoolConfigList(v2, dev)', () => {
    const output = 8;
    expect(getPoolConfigList('v2').length).toEqual(output);
  });
  test('getPoolConfigList(v2, prod)', () => {
    const output = 15;
    expect(getPoolConfigList('v2', 'prod').length).toEqual(output);
  });
  test('getPoolConfigList(v2, dev) uniq by bTokenId', () => {
    const arr1 = getPoolConfigList('v2');
    const arr2 = [...new Set(arr1.map((i) => i.bTokenSymbol))];
    expect(arr2.length).toEqual(4);
  });
  test('getPoolConfigList(v2, prod) uniq by bTokenId', () => {
    const arr1 = getPoolConfigList('v2', 'prod');
    const arr2 = [...new Set(arr1.map((i) => i.bTokenSymbol))];
    expect(arr2.length).toEqual(6);
  });
  test('getFilteredPoolconfig()', () => {
    expect(getFilteredPoolConfigList(POOL_V2_ADDRESS).length).toEqual(6);
  });
  test('getFilteredPoolconfig(0, 1)', () => {
    expect(getFilteredPoolConfigList(POOL_V2_ADDRESS, '0', '1').length).toEqual(
      1
    );
  });
  test('getFilteredPoolconfig(null, 0)', () => {
    expect(
      getFilteredPoolConfigList(POOL_V2_ADDRESS, null, '1').length
    ).toEqual(3);
  });
  test('getFilteredPoolconfig(1)', () => {
    expect(getFilteredPoolConfigList(POOL_V2_ADDRESS, '0').length).toEqual(2);
  });
  test('getPoolconfig(0, 1)', () => {
    expect(
      getPoolConfig(
        POOL_V2_ADDRESS,
        '0',
        '1'
      ).bToken
    ).toEqual(BTOKEN_ADDRESS);
  })
  test('getPoolconfig(0)', () => {
    expect(
      getPoolConfig(
        POOL_V2_ADDRESS,
        '0',
      ).router
    ).toEqual(ROUTER_V2_ADDRESS);
  })
  test('getPoolconfig(null, 1)', () => {
    expect(
      getPoolConfig(
        POOL_V2_ADDRESS,
        null,
        '0',
      ).router
    ).toEqual(ROUTER_V2_ADDRESS);
  })
  test('getOracleConfigList(v2, dev)', () => {
    const output = 4
    expect(getOracleConfigList('v2', 'dev').length).toEqual(output)
  })
  test('getOracleConfigList(v2, prod)', () => {
    const output = 5
    expect(getOracleConfigList('v2', 'prod').length).toEqual(output)
  })
  test('getOracleConfig()', () => {
    const output = {
      chainId: '97',
      symbol: 'BTCUSD',
      decimal: '18',
      address: BTCUSD_ORACLE_V2_ADDRESS,
    };
    expect(getOracleConfig('97', 'BTCUSD')).toEqual(output)
  })
  test('getBrokerConfig', () => {
    const output = {
      chainId: '97',
      address: BROKER_MANAGER_V2_ADDRESS,
    };
    expect(getBrokerConfig('97')).toEqual(output)
  })
  test('getPoolConfig2', () => {
    const output = {
      pool: POOL_V2_ADDRESS,
      pToken: PTOKEN_V2_ADDRESS,
      lToken: LTOKEN_V2_ADDRESS,
      router: ROUTER_V2_ADDRESS,
      initialBlock: '9516935',
      chainId: '97',
      bTokenId: '',
      bTokenSymbol: '',
      bToken: '',
      symbolId: '',
      symbol: '',
      unit: '',
      version: 'v2',
      bTokenCount: 3,
      symbolCount: 2,
    };
    const res = getPoolConfig2(POOL_V2_ADDRESS)
    expect(res).toEqual(output)
    expect(res.bTokenCount).toEqual(3)
    expect(res.symbolCount).toEqual(2)
    expect(getPoolConfig2(POOL_V2_ADDRESS, '0').bTokenSymbol).toEqual('BUSD')
    expect(getPoolConfig2(POOL_V2_ADDRESS, null, '1').symbol).toEqual('ETHUSD')
  })
  test('getOracleConfigList with v2_lite', () => {
    const output = 9
    expect(getOracleConfigList('v2_lite').length).toEqual(output)
  })
  test('getOracleConfigList(v2_lite, prod)', () => {
    const output = 5
    const res = getOracleConfigList('v2_lite', 'prod').length
    expect(bg(res).toNumber()).toBeGreaterThan(output)
  })
  test('getOracleConfig for v2_lite', () => {
    const output = {
      chainId: '97',
      symbol: 'BTCUSD',
      decimal: '18',
      address: BTCUSD_ORACLE_V2L_ADDRESS,
    };
    expect(getOracleConfig('97', 'BTCUSD', 'v2_lite')).toEqual(output)
  })
  test('getPoolconfig() for v2_lite', () => {
    expect(
      getPoolConfig(
        POOL_V2L_ADDRESS,
        '0',
        '1',
        'v2_lite'
      ).pToken
    ).toEqual('0x1aD33A66Bc950E05E10f56a472D818AFEe72012C');
    expect(
      getPoolConfig(
        POOL_V2L_ADDRESS,
        '0',
        null,
        'v2_lite'
      ).bTokenSymbol
    ).toEqual('BUSD');
    expect(
      getPoolConfig(
        POOL_V2L_ADDRESS,
        null,
        null,
        'v2_lite'
      ).lToken
    ).toEqual('0x5443bB7B9920b41Da027f8Aab41c90702ACD7d8a');
    expect(
      getPoolConfig(
        POOL_V2L_ADDRESS,
        null,
        null,
        'v2_lite'
      ).offchainSymbolIds
    ).toEqual(['2', '3', '4', '5', '6', '7', '8']);
  });
  test('getPoolVersion', () => {
    expect(getPoolVersion('0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5')).toEqual('v2')
    expect(getPoolVersion('0x3422DcB21c32d91aDC8b7E89017e9BFC13ee2d42')).toEqual('v2_lite')
    DeriEnv.set('prod')
    expect(getPoolVersion('0x063E74AbB551907833Be79E2C8F279e3afc74711')).toEqual('v2_lite_open')
    DeriEnv.set('dev')
  })
  test('isUsedRestOracle', () => {
    expect(isUsedRestOracle('AXSUSDT')).toEqual(true)
    expect(isUsedRestOracle('MANAUSDT')).toEqual(true)
    expect(isUsedRestOracle('IBSCDEFI')).toEqual(true)
    expect(isUsedRestOracle('BTCUSD')).toEqual(false)
    expect(isUsedRestOracle('iBSCDEFI')).toEqual(false)
  })
  test('mapToSymbol', () => {
    expect(mapToSymbol('IBSCDEFI')).toEqual('iBSCDEFI')
    expect(mapToSymbol('BTCUSD')).toEqual('BTCUSD')
  })
  test('mapToSymbolInternal', () => {
    expect(mapToSymbolInternal('iBSCDEFI')).toEqual('IBSCDEFI')
    expect(mapToSymbol('BTCUSD')).toEqual('BTCUSD')
  })
  test('getPreminingContractConfig', () => {
    expect(getPreminingConfigList('prod').length).toEqual(8)
  })
  test('normalizeSymbolUnit', () => {
    expect(normalizeSymbolUnit('BTCUSD')).toEqual('BTC')
    expect(normalizeSymbolUnit('ETHUSD')).toEqual('ETH')
    expect(normalizeSymbolUnit('MATICUSD')).toEqual('MATIC')
    expect(normalizeSymbolUnit('BNBUSD')).toEqual('BNB')
    expect(normalizeSymbolUnit('SANDUSDT')).toEqual('SAND')
    expect(normalizeSymbolUnit('IGAME')).toEqual('iGAME')
    expect(normalizeSymbolUnit('AXSUSDT')).toEqual('AXS')
    expect(normalizeSymbolUnit('MANAUSDT')).toEqual('MANA')
    expect(normalizeSymbolUnit('MBOXUSDT')).toEqual('MBOX')
    expect(normalizeSymbolUnit('IBSCDEFI')).toEqual('iBSCDEFI')
    expect(normalizeSymbolUnit('ALICEUSDT')).toEqual('ALICE')
    expect(normalizeSymbolUnit('AXSUSDTT')).toEqual('AXSUSDTT')
  })
  test('getPoolConfigList(v2_lite_open, prod)', () => {
    const output = 2
    DeriEnv.set('prod')
    const res = getPoolConfigList('v2_lite_open', 'prod').length
    DeriEnv.set('dev')
    expect(bg(res).toNumber()).toBeGreaterThanOrEqual(output)
  })
  test('getPoolconfig() for v2_lite_open', () => {
    DeriEnv.set('prod')
    expect(
      getPoolConfig(
        '0x063E74AbB551907833Be79E2C8F279e3afc74711',
        '0',
        '0',
        'v2_lite_open'
      ).pToken
    ).toEqual('0xBfc56891E0c9bFC65c5da29e998F16EAb32ea449');
    DeriEnv.set('dev')
   })
});
