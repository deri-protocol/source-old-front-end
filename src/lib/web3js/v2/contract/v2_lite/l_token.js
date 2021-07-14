import { ContractBase } from '../contract_base'
import { lTokenLiteAbi } from '../abis';
import { deriToNatural } from '../../utils';

export class LToken extends ContractBase {
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, lTokenLiteAbi)
  }

  // === query ===
  async balanceOf(accountAddress) {
    const res = await this._call('balanceOf', [accountAddress]);
    return deriToNatural(res)
  }
  async totalSupply() {
    const res = await this._call('totalSupply');
    return deriToNatural(res);
  }
  async pool() {
    return await this._call('pool');
  }
}
