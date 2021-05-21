import { bg } from '../utils'
import {
  PToken,
} from '../contract/p_token'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('PToken', () => {
  let poolAddress, pToken, account, account2
  beforeAll(() => {
    poolAddress = '0x7dB32101081B17E105283820b2Ed3659DFE21470'
    pToken = new PToken('97', '0xeBA1c76F7A773B8210130f068798839F84392241', true)
    account = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'
    account2 = '0xf07cC941818ccD0620D30c06bD403C138691bfDB'
  })
  test('pool()', async() => {
    const output = '0x7dB32101081B17E105283820b2Ed3659DFE21470'
    expect(await pToken.pool()).toEqual(output)
  }, TIMEOUT)
  test('exists()', async() => {
    expect(await pToken.exists(account)).toEqual(true)
    expect(await pToken.exists(account2)).toEqual(false)
  }, TIMEOUT)
  test('balanceOf()', async() => {
    const output = '1'
    expect(await pToken.balanceOf(account)).toEqual(output)
  }, TIMEOUT)
  test('getMargin()', async() => {
    const output =  bg('109.99163263565')
    expect(await pToken.getMargin(account, 0)).toEqual(output)
  }, TIMEOUT)
  test('getMargins()', async() => {
    const output = 10
    const res = await pToken.getMargins(account)
    expect(res.length).toEqual(output)
  }, TIMEOUT)
  test('getPosition()', async() => {
    const output =  {
      volume: bg('23'),
      cost: bg('83.6736435'),
      lastCumulativeFundingRate: bg('0.379548594773587618'),
    }
    expect(await pToken.getPosition(account, 0)).toEqual(output)
  }, TIMEOUT)
  test('getPositions()', async() => {
    const output = 10
    const res = await pToken.getPositions(account)
    expect(res.length).toEqual(output)
  }, TIMEOUT)
})