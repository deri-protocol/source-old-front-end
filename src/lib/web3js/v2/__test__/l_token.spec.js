import { bg } from '../utils'
// import {
//   LToken,
// } from '../contract/l_token'
import fetch from 'node-fetch'
import { lTokenFactory } from '../factory'
global.fetch = fetch

const TIMEOUT=20000

describe('LToken', () => {
  let poolAddress, lToken, account, account2
  beforeAll(() => {
    poolAddress = '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5'
    //lToken = new LToken('97', '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57', true)
    lToken = lTokenFactory('97', poolAddress, true)
    account = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'
    account2 = '0xf07cC941818ccD0620D30c06bD403C138691bfDB'
  })
  test('balanceOf()', async() => {
    const output = '1'
    expect(await lToken.balanceOf(account)).toEqual(output)
  }, TIMEOUT)
  test('pool()', async() => {
    const output = '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5'
    expect(await lToken.pool()).toEqual(output)
  }, TIMEOUT)
  test('exists()', async() => {
    expect(await lToken.exists(account)).toEqual(true)
    expect(await lToken.exists(account2)).toEqual(false)
  }, TIMEOUT)
  test('getAsset()', async() => {
    const output =  {
      liquidity: bg('1009.99558635764855457'),
      pnl: bg('0'),
      lastCumulativePnl: bg('0.378567611176213972'),
    }
    expect(await lToken.getAsset(account, 0)).toEqual(output)
  }, TIMEOUT)
  test('getAssets()', async() => {
    const output = 10
    const res = await lToken.getAssets(account)
    expect(res.length).toEqual(output)
  }, TIMEOUT)
})