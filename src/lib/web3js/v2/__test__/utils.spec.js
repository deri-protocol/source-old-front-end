import {
  bg,
  toWei,
  fromWei,
  numberToHex,
  max,
  min,
  toHex,
  toNatural,
  toChecksumAddress,
  hexToString,
  hexToNumber,
  hexToNumberString,
  // getOracleUrl,
  // getOracleInfo,
  getOraclePrice,
  normalizeChainId,
  normalizeAddress,
  checkHttpServerIsAlive,
  getAliveHttpServer,
  getChainProviderUrl,
  getDailyBlockNumber,
  validateArgs,
  catchApiError,
  getEpochTimeRange,
  getBlockInfo,
  getLatestBlockNumber,
  getLastUpdatedBlockNumber,
} from '../utils'
import { TIMEOUT, ACCOUNT_ADDRESS, POOL_ADDRESS, POOL_ADDRESS_LITE} from './setup';

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
      ACCOUNT_ADDRESS,
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

  test('getOraclePrice()', async() => {
    const [input, output] = [[97, 'BTCUSD'], {priceLength: 5}];
    const res = await getOraclePrice(...input)
    //console.log(res)
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
  test('getDailyBlockNumber()', () => {
    expect(getDailyBlockNumber('1')).toEqual(Math.floor(2367422/365));
    expect(getDailyBlockNumber('56')).toEqual(Math.floor(10497304/365));
    expect(getDailyBlockNumber('97')).toEqual(Math.floor(10497304/365));
  })
  test('validateArgs()', () => {
    expect(validateArgs('1')).toEqual(true);
    expect(validateArgs(1.99)).toEqual(true);
    expect(validateArgs(undefined)).toEqual(false);
  })
  test('catchApiError()', async() => {
    // async function mock
    const testFunc1 = async(num) => {
      return await (new Promise((resolve) => {
        setTimeout(() => {
          resolve(num)
        }, 100)
      }))
    }
    expect(await catchApiError(testFunc1, [123], 'testFunc1()', 0)).toEqual(123);
    // async function mock
    const testFunc2 = async() => {
      return await (new Promise((resolve, reject) => {
        setTimeout(() => {
          const res = Math.random()
          if (res > 1) {
            resolve(res)
          } else {
            reject(new Error('Hi, this is a test error'))
          }
        }, 100)
      }))
    }
    expect(await catchApiError(testFunc2, [], 'testFunc2()', 666)).toEqual(666);
  }, TIMEOUT)
  test('getEpochTimeRange', () => {
    const input = new Date('2021-06-28T01:00:00Z')
    const output = [(new Date('2021-06-28T00:00:00Z')).getTime()/1000, (new Date('2021-06-28T08:00:00Z')).getTime()/1000]
    expect(getEpochTimeRange(input)).toEqual(output)
  })
  test('getEpochTimeRange 2', () => {
    const input = new Date('2021-06-28T11:00:00Z')
    const output = [(new Date('2021-06-28T08:00:00Z')).getTime()/1000, (new Date('2021-06-28T16:00:00Z')).getTime()/1000]
    expect(getEpochTimeRange(input)).toEqual(output)
  })
  test('getEpochTimeRange 3', () => {
    const input = new Date('2021-06-28T16:00:01Z')
    const output = [(new Date('2021-06-28T16:00:00Z')).getTime()/1000, (new Date('2021-06-29T00:00:00Z')).getTime()/1000]
    expect(getEpochTimeRange(input)).toEqual(output)
  })
  test('getBlockInfo', async() => {
    const input = ['97', '10000000']
    const output= ['0x9433da9e2a6778b78fb2961995f2558da9c3e9b8871ab93e94293718c7d037be', 1624497340]
    const blockInfo = await getBlockInfo(...input)
    expect(blockInfo.hash).toEqual(output[0])
    expect(blockInfo.timestamp).toEqual(output[1])
  }, TIMEOUT)
  test('getLatestBlockNumber', async() => {
    const input = '97'
    const output= 10351162
    const blockNumber = await getLatestBlockNumber(input)
    expect(blockNumber).toBeGreaterThan(output)
  }, TIMEOUT)

  test('getLastUpdatedBlockNumber', async() => {
    const output = 10178982
    expect(await getLastUpdatedBlockNumber('97', POOL_ADDRESS)).toBeGreaterThanOrEqual(output)
  }, TIMEOUT)

  test('getLastUpdatedBlockNumber V2 lite', async() => {
    const output = 10178982
    expect(await getLastUpdatedBlockNumber('97', POOL_ADDRESS_LITE, 5)).toBeGreaterThanOrEqual(output)
  }, TIMEOUT)
})
