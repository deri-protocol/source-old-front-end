import {
  getChainProviderUrls,
  getPoolConfigList,
  getFilteredPoolConfigList,
  getPoolConfig,
} from '../config';
import fetch from 'node-fetch';
global.fetch = fetch;

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
    const output = 4;
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
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        '0',
        '1'
      ).length
    ).toEqual(1);
    expect(
      getFilteredPoolConfigList(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        '0',
      ).length
    ).toEqual(2);
    expect(
      getFilteredPoolConfigList(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
      ).length
    ).toEqual(4);
    expect(
      getFilteredPoolConfigList(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        null,
        '1',
      ).length
    ).toEqual(2);
  });
  test('getPoolconfig()', () => {
    expect(
      getPoolConfig(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        '0',
        '1'
      ).bToken
    ).toEqual('0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF');
    expect(
      getPoolConfig(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        '0',
      ).router
    ).toEqual('0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1');
    expect(
      getPoolConfig(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
      ).router
    ).toEqual('0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1');
    expect(
      getPoolConfig(
        '0x7dB32101081B17E105283820b2Ed3659DFE21470',
        null,
        '1',
      ).router
    ).toEqual('0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1');
  });
});
