import {
  getChainProviderUrls,
  getPoolConfigList,
  getFilteredPoolConfigList,
  getPoolConfig,
} from '../config';
import fetch from 'node-fetch';
global.fetch = fetch;
const POOL_ADDRESS='0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5'

describe('config', () => {
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
    const output = 3;
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
    ).toEqual('0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF');
    expect(
      getPoolConfig(
        POOL_ADDRESS,
        '0',
      ).router
    ).toEqual('0x1061b8457A036b4A23C8C2346cC62C701e35E2c4');
    expect(
      getPoolConfig(
        POOL_ADDRESS,
      ).router
    ).toEqual('0x1061b8457A036b4A23C8C2346cC62C701e35E2c4');
    expect(
      getPoolConfig(
        POOL_ADDRESS,
        null,
        '1',
      ).router
    ).toEqual('0x1061b8457A036b4A23C8C2346cC62C701e35E2c4');
  });
});
