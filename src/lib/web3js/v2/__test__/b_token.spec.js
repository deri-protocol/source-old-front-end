import { bg } from '../utils'
import {
  BToken,
} from '../contract/b_token'
import {
  TIMEOUT,
  POOL_ADDRESS,
  BTOKEN_ADDRESS,
  ACCOUNT2_ADDRESS,
  ACCOUNT_ADDRESS,
} from './setup';


describe('BToken', () => {
  let bToken
  beforeAll(() => {
    bToken = new BToken('97', BTOKEN_ADDRESS, true)
  })
  test('symbol()', async() => {
    const output = 'BUSD'
    expect(await bToken.symbol()).toEqual(output)
  }, TIMEOUT)
  test('balanceOf()', async() => {
    const output = bg('47380')
    expect(await bToken.balanceOf(ACCOUNT_ADDRESS)).toEqual(output)
  }, TIMEOUT)
  test('totalSupply()', async() => {
    const output = bg('1090000')
    expect(await bToken.totalSupply()).toEqual(output)
  }, TIMEOUT)
  test('isUnlocked()', async() => {
    expect(await bToken.isUnlocked(ACCOUNT_ADDRESS, POOL_ADDRESS)).toEqual(true)
    expect(await bToken.isUnlocked(ACCOUNT2_ADDRESS, POOL_ADDRESS)).toEqual(false)
  }, TIMEOUT)
})