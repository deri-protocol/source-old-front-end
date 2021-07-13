import { bg } from '../../utils'
import { lTokenFactory } from '../../factory'
import {
  TIMEOUT,
  POOL_ADDRESS,
  ACCOUNT2_ADDRESS,
  ACCOUNT_ADDRESS,
  LTOKEN_ADDRESS,
} from '../setup';

describe('LToken', () => {
  let lToken
  beforeAll(() => {
    lToken = lTokenFactory('97', LTOKEN_ADDRESS)
  })
  test('balanceOf()', async() => {
    const output = '1'
    expect(await lToken.balanceOf(ACCOUNT_ADDRESS)).toEqual(output)
  }, TIMEOUT)
  test('pool()', async() => {
    expect(await lToken.pool()).toEqual(POOL_ADDRESS)
  }, TIMEOUT)
  test('exists()', async() => {
    expect(await lToken.exists(ACCOUNT_ADDRESS)).toEqual(true)
    expect(await lToken.exists(ACCOUNT2_ADDRESS)).toEqual(false)
  }, TIMEOUT)
  test('getAsset()', async() => {
    const output =  {
      liquidity: bg('1009.99558635764855457'),
      pnl: bg('0'),
      lastCumulativePnl: bg('0.378567611176213972'),
    }
    expect(await lToken.getAsset(ACCOUNT_ADDRESS, 0)).toEqual(output)
  }, TIMEOUT)
  test('getAssets()', async() => {
    const output = 3
    const res = await lToken.getAssets(ACCOUNT_ADDRESS)
    expect(res.length).toEqual(output)
  }, TIMEOUT)
})