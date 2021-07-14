import { bg } from '../../utils'
import { pTokenFactory } from '../../factory'
import { TIMEOUT, ACCOUNT2_ADDRESS, ACCOUNT_ADDRESS, POOL_ADDRESS, PTOKEN_ADDRESS } from '../setup'

describe('PToken', () => {
  let pToken
  beforeAll(() => {
    pToken =  pTokenFactory('97', PTOKEN_ADDRESS)
  })
  test('pool()', async() => {
    const output = POOL_ADDRESS
    expect(await pToken.pool()).toEqual(output)
  }, TIMEOUT)
  test('exists()', async() => {
    expect(await pToken.exists(ACCOUNT_ADDRESS)).toEqual(true)
    expect(await pToken.exists(ACCOUNT2_ADDRESS)).toEqual(false)
  }, TIMEOUT)
  test('balanceOf()', async() => {
    const output = '1'
    expect(await pToken.balanceOf(ACCOUNT_ADDRESS)).toEqual(output)
  }, TIMEOUT)
  test('getMargin()', async() => {
    const output =  bg('109.99163263565')
    expect(await pToken.getMargin(ACCOUNT_ADDRESS, 0)).toEqual(output)
  }, TIMEOUT)
  test('getMargins()', async() => {
    const output = 3
    const res = await pToken.getMargins(ACCOUNT_ADDRESS)
    expect(res.length).toEqual(output)
  }, TIMEOUT)
  test('getPosition()', async() => {
    const output =  {
      volume: bg('23'),
      cost: bg('83.6736435'),
      lastCumulativeFundingRate: bg('0.379548594773587618'),
    }
    expect(await pToken.getPosition(ACCOUNT_ADDRESS, 0)).toEqual(output)
  }, TIMEOUT)
  test('getPositions()', async() => {
    const output = 2
    const res = await pToken.getPositions(ACCOUNT_ADDRESS)
    expect(res.length).toEqual(output)
  }, TIMEOUT)
})