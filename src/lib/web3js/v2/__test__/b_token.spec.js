import {
  TIMEOUT,
  CHAIN_ID,
  BTOKEN_ADDRESS_LITE,
  ACCOUNT_ADDRESS,
  ACCOUNT2_ADDRESS,
  POOL_ADDRESS_LITE,
  POOL_ADDRESS,
} from './setup';
import { bTokenFactory } from '../factory';

describe('BToken', () => {
  let bToken;
  beforeAll(() => {
    bToken = bTokenFactory(CHAIN_ID, BTOKEN_ADDRESS_LITE);
  }, TIMEOUT);
  it('symbol()', async () => {
    expect(await bToken.symbol()).toEqual('BUSD');
  }, TIMEOUT);
  it('decimals()', async () => {
    expect(await bToken.decimals()).toEqual('18');
  }, TIMEOUT);
  it('balanceOf()', async () => {
    expect((await bToken.balanceOf(ACCOUNT_ADDRESS)).toString()).toEqual(
      '39349.155962163085673733'
    );
  }, TIMEOUT);
  it('totalSupply()', async () => {
    expect((await bToken.totalSupply()).toString()).toEqual('20360000');
  }, TIMEOUT);
  it('isUnlocked()', async () => {
    expect(await bToken.isUnlocked(ACCOUNT_ADDRESS, POOL_ADDRESS)).toEqual( true);
    expect(await bToken.isUnlocked(ACCOUNT2_ADDRESS, POOL_ADDRESS)).toEqual( false);
    expect( await bToken.isUnlocked(ACCOUNT_ADDRESS, POOL_ADDRESS_LITE)).toEqual(true);
  }, TIMEOUT);
});
