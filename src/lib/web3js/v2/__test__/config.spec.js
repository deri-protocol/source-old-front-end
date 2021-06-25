import {
  getChainProviderUrls,
  getPoolConfigList,
  getFilteredPoolConfigList,
  getPoolConfig,
  getPoolConfig2,
  getOracleConfigList,
  getOracleConfig,
  getAnnualBlockNumberConfig,
  getChainIds,
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
} from './setup';

describe('config', () => {
  test('getChainIds()', () => {
    const output = 8;
    expect(getChainIds().length).toEqual(output);
  });
  test('getAnnualBlockNumberConfig()', () => {
    const output = {
      1: '2367422',
      56: '10497304',
      128: '10511369',
      3: '2367422',
      97: '10497304',
      256: '10511369',
      137: '15063056',
      80001: '15063056',
    };
    expect(getAnnualBlockNumberConfig()).toEqual(output);
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
    const output = 6;
    expect(getPoolConfigList('dev').length).toEqual(output);
  });
  test('getPoolConfigList() uniq by bTokenId', () => {
    const output = 2;
    const arr1 = getPoolConfigList('dev')
    const arr2 = arr1.map(i => i.bTokenId)
    expect(arr1.filter((i, index) => arr2.indexOf(i.bTokenId) === index).length).toEqual(output)
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
    ).toEqual(4);
    expect(
      getFilteredPoolConfigList(
        POOL_ADDRESS,
        null,
        '1',
      ).length
    ).toEqual(2);
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
      bTokenCount: 2,
      symbolCount: 2,
    };
    const res = getPoolConfig2(POOL_ADDRESS)
    expect(res).toEqual(output)
    expect(res.bTokenCount).toEqual(2)
    expect(res.symbolCount).toEqual(2)
    expect(getPoolConfig2(POOL_ADDRESS, '0').bTokenSymbol).toEqual('BUSD')
    expect(getPoolConfig2(POOL_ADDRESS, null, '1').symbol).toEqual('ETHUSD')
  })
});
