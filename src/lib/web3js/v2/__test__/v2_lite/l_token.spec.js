import { lTokenLiteFactory } from '../../factory';
import {
  CHAIN_ID,
  LTOKEN_ADDRESS_LITE,
  POOL_ADDRESS_LITE,
  ACCOUNT_ADDRESS,
  TIMEOUT,
} from '../setup';

describe('lToken lite', () => {
  let lToken;
  beforeAll(() => {
    lToken = lTokenLiteFactory(CHAIN_ID, LTOKEN_ADDRESS_LITE);
  });
  it('pool()', async () => {
    expect(await lToken.pool()).toEqual(POOL_ADDRESS_LITE);
  }, TIMEOUT);
  it('totalSupply()', async () => {
    expect((await lToken.totalSupply()).toString()).toEqual(
      '65383.906200632777635848'
    );
  }, TIMEOUT);
  it('balanceOf()', async () => {
    expect((await lToken.balanceOf(ACCOUNT_ADDRESS)).toString()).toEqual(
      '94.101741732381432575'
    );
  }, TIMEOUT);
});
