import {
  toWei,
  fromWei,
  numberToHex,
  fetchWithTimeout,
} from '../index'
import fetch from 'node-fetch'
global.fetch = fetch

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
  test('fetchWithDelay()', async() => {
    const input = 'http://www.baidu.com'
    const output = true
    const res = await fetchWithTimeout(input)
    expect(res.ok).toEqual(output)
    // const input2 = 'https://bsc-dataseed.binance.org'
    // const output2 = true
    // expect((await fetchWithTimeout(input2, {timeout:10})).timeout).toEqual(output2)
    // const input3 = 'https://test.justfortestonly.org'
    // const output3 = true
    // expect((await fetchWithTimeout(input3, {timeout:1})).timeout).toEqual(output3)
  })
}, 3000)