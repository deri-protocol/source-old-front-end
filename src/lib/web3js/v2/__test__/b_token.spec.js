import { bg } from '../utils'
import {
  BToken,
} from '../contract/b_token'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('BToken', () => {
  let poolAddress, bToken, account, account2
  beforeAll(() => {
    poolAddress = '0x19EC6281749C06Ed9647134c57257AcA1508bFA8'
    bToken = new BToken('97', '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF', true)
    account = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'
    account2 = '0xf07cC941818ccD0620D30c06bD403C138691bfDB'
  })
  test('symbol()', async() => {
    const output = 'BUSD'
    expect(await bToken.symbol()).toEqual(output)
  }, TIMEOUT)
  test('balanceOf()', async() => {
    const output = bg('47380')
    expect(await bToken.balanceOf(account)).toEqual(output)
  }, TIMEOUT)
  test('totalSupply()', async() => {
    const output = bg('1090000')
    expect(await bToken.totalSupply()).toEqual(output)
  }, TIMEOUT)
  test('isUnlocked()', async() => {
    expect(await bToken.isUnlocked(account, poolAddress)).toEqual(true)
    expect(await bToken.isUnlocked(account2, poolAddress)).toEqual(false)
  }, TIMEOUT)
})