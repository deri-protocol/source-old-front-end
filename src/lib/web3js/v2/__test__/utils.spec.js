import {
  bg,
  toWei,
  fromWei,
  numberToHex,
  fetchWithTimeout,
  max,
  min,
  toHex,
  toNatural,
  toChecksumAddress,
  hexToString,
  hexToNumber,
  hexToNumberString,
  getOracleUrl,
  getOracleInfo,
  getOraclePrice,
  normalizeChainId,
  normalizeAddress,
  checkHttpServerIsAlive,
  getAliveHttpServer,
  getChainProviderUrl,
  getAnnualBlockNumber,
  validateArgs,
} from '../utils'
import fetch from 'node-fetch'
import { getAnnualBlockNumberConfig } from '../config'
global.fetch = fetch

const TIMEOUT=20000

describe('utils', () => {
  test('toWei()', () => {
    const input = "1"
    const output = "1000000000000000000"
    expect(toWei(input)).toEqual(output)
  })
  test('fromWei()', () => {
    const input = "1120000000000000000"
    const output = "1.12"
    expect(fromWei(input)).toEqual(output)
  })
  test('numberToHex()', () => {
    const input = "17"
    const output = "0x11"
    expect(numberToHex(input)).toEqual(output)
  })
  // test('fetchWithDelay()', async() => {
  //   const input = 'http://www.baidu.com'
  //   const output = true
  //   const res = await fetchWithTimeout(input)
  //   expect(res.ok).toEqual(output)
  //   // const input2 = 'https://bsc-dataseed.binance.org'
  //   // const output2 = true
  //   // expect((await fetchWithTimeout(input2, {timeout:10})).timeout).toEqual(output2)
  //   // const input3 = 'https://test.justfortestonly.org'
  //   // const output3 = true
  //   // expect((await fetchWithTimeout(input3, {timeout:1})).timeout).toEqual(output3)
  // })
  test('max()', () => {
    const [input, output] = [[bg(11), bg(3)], bg(11)];
    expect(max(...input)).toEqual(output);
  });
  test('min()', () => {
    const [input, output] = [[bg(1000), bg('999')], bg(999)];
    expect(min(...input)).toEqual(output);
  });
  test('toNatural()', () => {
    const [input, output] = ['2000.1925', '2000.19'];
    expect(toNatural(input, 2)).toEqual(output);
  });
  test('toHex()', () => {
    const [input, output] = ['197', '0xc5'];
    expect(toHex(input)).toEqual(output);
  });
  test('toChecksumAddress()', () => {
    const [input, output] = [
      '0xffe85d82409c5b9d734066c134b0c2ccdd68c4df',
      '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF',
    ];
    expect(toChecksumAddress(input)).toEqual(output);
  });
  test('hexToString()', () => {
    const [input, output] = ['0x0061413032', 'aA02'];
    expect(hexToString(input)).toEqual(output);
  });
  test('hexToNumber()', () => {
    const [input, output] = ['0x001032', 4146];
    expect(hexToNumber(input)).toEqual(output);
  });
  test('hexToNumberString()', () => {
    const [input, output] = ['0x001032', '4146'];
    expect(hexToNumberString(input)).toEqual(output);
  });

  test('getOracleUrl()', () => {
    const [input, output] = [['0x7dB32101081B17E105283820b2Ed3659DFE21470', '0'], 'https://oracle2.deri.finance/price?symbol=BTCUSD'];
    expect(getOracleUrl(...input)).toEqual(output);
    const [input3, output3] = [['0x7dB32101081B17E105283820b2Ed3659DFE21470', '1'], 'https://oracle4.deri.finance/price?symbol=ETHUSD'];
    expect(getOracleUrl(...input3)).toEqual(output3);
  });
  test('getOracleInfo()', async() => {
    const [input, output] = [['0x7dB32101081B17E105283820b2Ed3659DFE21470', '0'], {symbol: 'BTCUSD', priceLength: 23}];
    const res = await getOracleInfo(...input)
    expect(res.symbol).toEqual(output.symbol);
    expect(res.price.length).toEqual(output.priceLength);
  }, TIMEOUT)
  test('getOraclePrice()', async() => {
    const [input, output] = [['0x7dB32101081B17E105283820b2Ed3659DFE21470', '0'], {priceLength: 5}];
    const res = await getOraclePrice(...input)
    expect(res.split('.')[0].length).toEqual(output.priceLength);
  }, TIMEOUT)
  test('checkHttpServerIsAlive()', async() => {
    const [input, output] = ['http://www.baidu.com', true];
    expect(await checkHttpServerIsAlive(input)).toEqual(output)
    const [input2, output2] = ['http://www.baidutestjustforfun.com', false];
    expect(await checkHttpServerIsAlive(input2)).toEqual(output2)
  }, TIMEOUT)
  test('getAliveHttpServer()', async() => {
    const [input, output] = [['http://www.baidutestjustforfun.com', 'http://www.baidu.com'], 'http://www.baidu.com'];
    expect(await getAliveHttpServer(input)).toEqual(output)
  })
  test('getChainProviderUrl()', async() => {
    const input = '97'
    const res = await getChainProviderUrl(input)
    expect(res).toMatch(/data-seed-prebsc-\d-s\d\.binance\.org/);
  })
  test('normalizeChainId()', () => {
    expect(normalizeChainId(1)).toEqual('1');
    expect(normalizeChainId('56')).toEqual('56')
    expect(normalizeChainId(128)).toEqual('128')

    function withInvalidChainId() {
      return normalizeChainId('43')
    }
    expect(withInvalidChainId).toThrow(/invalid chainId/);

    function withEmptyChainId() {
      return normalizeChainId('')
    }
    expect(withEmptyChainId).toThrow(/invalid chainId/);

    function withNullChainId() {
      return normalizeChainId()
    }
    expect(withNullChainId).toThrow(/invalid chainId/);
  })
  test('normalizeAddress()', () => {
    expect(normalizeAddress('0x2baa211d7e62593ba379df362f23e7b813d760ad')).toEqual('0x2bAa211D7E62593bA379dF362F23e7B813d760Ad');

    function withInvalidAddress() {
      return normalizeAddress('56')
    }
    expect(withInvalidAddress).toThrowError(/invalid address/);
  })
  test('getAnnualBlockNumber()', () => {
    expect(getAnnualBlockNumber('1')).toEqual(2367422);
    expect(getAnnualBlockNumber('56')).toEqual(10497304);
    expect(getAnnualBlockNumber('97')).toEqual(10497304);
  })
  test('validateArgs()', () => {
    expect(validateArgs('1')).toEqual(true);
    expect(validateArgs(1.99)).toEqual(true);
    expect(validateArgs(undefined)).toEqual(false);
  })
})