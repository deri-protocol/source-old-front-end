import { pTokenLiteFactory } from '../../factory';
import {
  CHAIN_ID,
  PTOKEN_ADDRESS_LITE,
  POOL_ADDRESS_LITE,
  ACCOUNT_ADDRESS,
  ACCOUNT2_ADDRESS,
  TIMEOUT,
} from '../setup';
import { bg } from '../../utils';

describe('pToken lite', () => {
  let pToken
  beforeAll(() => {
    pToken = pTokenLiteFactory(CHAIN_ID, PTOKEN_ADDRESS_LITE)
  })
  it('pool()', async() => {
    expect(await pToken.pool()).toEqual(POOL_ADDRESS_LITE)
  }, TIMEOUT)
  it('balanceOf()', async() => {
    expect(await pToken.balanceOf(ACCOUNT_ADDRESS)).toEqual('1')
    expect(await pToken.balanceOf(ACCOUNT2_ADDRESS)).toEqual('0')
  }, TIMEOUT)
  it('exists()', async() => {
    expect(await pToken.exists(ACCOUNT_ADDRESS)).toEqual(true)
    expect(await pToken.exists(ACCOUNT2_ADDRESS)).toEqual(false)
  }, TIMEOUT)
  it('getMargin()', async() => {
    expect((await pToken.getMargin(ACCOUNT_ADDRESS)).toString()).toEqual('169.886183462576852506')
  }, TIMEOUT)
  it('getPosition()', async() => {
    const output = {
      volume: bg('23'),
      cost: bg('78.889563'),
      lastCumulativeFundingRate: bg('1.073406984697133649'),
    }
    expect(await pToken.getPosition(ACCOUNT_ADDRESS, '0')).toEqual(output)
    const output2 = {
      volume: bg('-15'),
      cost: bg('-34.864275'),
      lastCumulativeFundingRate: bg('-0.508862814567755394'),
    }
    expect(await pToken.getPosition(ACCOUNT_ADDRESS, '1')).toEqual(output2)
  }, TIMEOUT)
  it('getActiveSymbolIds', async() => {
    expect(await pToken.getActiveSymbolIds()).toEqual(['0', '1'])
  }, TIMEOUT)
  it('isActiveSymbolId', async() => {
    expect(await pToken.isActiveSymbolId('0')).toEqual(true)
    expect(await pToken.isActiveSymbolId('2')).toEqual(false)
  }, TIMEOUT)
})
