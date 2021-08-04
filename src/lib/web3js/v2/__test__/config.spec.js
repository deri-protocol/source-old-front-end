import { DeriEnv } from '../../config';
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
  mapToSymbolInternal,
  isUsedRestOracle,
} from '../config';
import { getBrokerConfig } from '../config/broker';
import {
  POOL_ADDRESS,
  ROUTER_ADDRESS,
  BTOKEN_ADDRESS,
  BTCUSD_ORACLE_ADDRESS,
  PTOKEN_ADDRESS,
  LTOKEN_ADDRESS,
  BROKER_MANAGER_ADDRESS,
  POOL_ADDRESS_LITE,
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
  test('getPoolConfigList()', () => {
    const output = 8;
    expect(getPoolConfigList().length).toEqual(output);
  });
  test('getPoolConfigList() uniq by bTokenId', () => {
    const arr1 = getPoolConfigList()
    const arr2 = arr1.map(i => i.bTokenId)
    expect(arr1.filter((i, index) => arr2.indexOf(i.bTokenId) === index).length).toEqual(3)
    DeriEnv.set('prod')
    const arr3 = getPoolConfigList()
    DeriEnv.set('dev')
    const arr4 = arr3.map(i => i.symbolId)
    expect(arr3.filter((i, index) => arr4.indexOf(i.symbolId) === index).length).toEqual(3)
    //expect(arr4.length).toEqual(output)
  });
  test('getFilteredPoolconfig()', () => {
    expect(
      getFilteredPoolConfigList(
        POOL_ADDRESS,
        '0',
        '1'
      ).length
    ).toEqual(1);
    expect(
      getFilteredPoolConfigList(
        POOL_ADDRESS,
        '0',
      ).length
    ).toEqual(2);
    expect(
      getFilteredPoolConfigList(
        POOL_ADDRESS,
      ).length
    ).toEqual(6);
    expect(
      getFilteredPoolConfigList(
        POOL_ADDRESS,
        null,
        '1',
      ).length
    ).toEqual(3);
  });
  test('getPoolconfig()', () => {
    expect(
      getPoolConfig(
        POOL_ADDRESS,
        '0',
        '1'
      ).bToken
    ).toEqual(BTOKEN_ADDRESS);
    expect(
      getPoolConfig(
        POOL_ADDRESS,
        '0',
      ).router
    ).toEqual(ROUTER_ADDRESS);
    expect(
      getPoolConfig(
        POOL_ADDRESS,
      ).router
    ).toEqual(ROUTER_ADDRESS);
    expect(
      getPoolConfig(
        POOL_ADDRESS,
        null,
        '1',
      ).router
    ).toEqual(ROUTER_ADDRESS);
  });
  test('getOracleConfigList', () => {
    const output = 4
    expect(getOracleConfigList().length).toEqual(output)
  })
  test('getOracleConfig', () => {
    const output = {
      chainId: '97',
      symbol: 'BTCUSD',
      decimal: '18',
      address: BTCUSD_ORACLE_ADDRESS,
    };
    expect(getOracleConfig('97', 'BTCUSD')).toEqual(output)
  })
  test('getBrokerConfig', () => {
    const output = {
      chainId: '97',
      address: BROKER_MANAGER_ADDRESS,
    };
    expect(getBrokerConfig('97')).toEqual(output)
  })
  test('getPoolConfig2', () => {
    const output = {
      pool: POOL_ADDRESS,
      pToken: PTOKEN_ADDRESS,
      lToken: LTOKEN_ADDRESS,
      router: ROUTER_ADDRESS,
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
    const res = getPoolConfig2(POOL_ADDRESS)
    expect(res).toEqual(output)
    expect(res.bTokenCount).toEqual(3)
    expect(res.symbolCount).toEqual(2)
    expect(getPoolConfig2(POOL_ADDRESS, '0').bTokenSymbol).toEqual('BUSD')
    expect(getPoolConfig2(POOL_ADDRESS, null, '1').symbol).toEqual('ETHUSD')
  })
  test('getOracleConfigList with v2_lite', () => {
    const output = 4
    expect(getOracleConfigList('v2_lite').length).toEqual(output)
  })
  test('getOracleConfig for v2_lite', () => {
    const output = {
      chainId: '97',
      symbol: 'BTCUSD',
      decimal: '18',
      address: '0x78Db6d02EE87260a5D825B31616B5C29f927E430',
    };
    expect(getOracleConfig('97', 'BTCUSD', 'v2_lite')).toEqual(output)
  })
  test('getPoolconfig() for v2_lite', () => {
    expect(
      getPoolConfig(
        POOL_ADDRESS_LITE,
        '0',
        '1',
        'v2_lite'
      ).pToken
    ).toEqual('0x1aD33A66Bc950E05E10f56a472D818AFEe72012C');
    expect(
      getPoolConfig(
        POOL_ADDRESS_LITE,
        '0',
        null,
        'v2_lite'
      ).bTokenSymbol
    ).toEqual('BUSD');
    expect(
      getPoolConfig(
        POOL_ADDRESS_LITE,
        null,
        null,
        'v2_lite'
      ).lToken
    ).toEqual('0x5443bB7B9920b41Da027f8Aab41c90702ACD7d8a');
    expect(
      getPoolConfig(
        POOL_ADDRESS_LITE,
        null,
        null,
        'v2_lite'
      ).offchainSymbolIds
    ).toEqual(['2', '3']);
  });
  test('getPoolVersion', () => {
    expect(getPoolVersion('0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5')).toEqual('v2')
    expect(getPoolVersion('0x3422DcB21c32d91aDC8b7E89017e9BFC13ee2d42')).toEqual('v2_lite')
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
});
