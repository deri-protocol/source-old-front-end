import { ContractBase } from './contract_base'
import { lTokenAbi } from './abis';
import { deriToNatural } from '../utils'

const processAsset = (res) => {
  return {
    liquidity: deriToNatural(res[0]),
    pnl: deriToNatural(res[1]),
    lastCumulativePnl: deriToNatural(res[2]),
  }
}
export class LToken extends ContractBase {
  constructor(chainId, contractAddress, useInfura=false) {
    super(chainId, contractAddress, useInfura)
    this.contractAbi = lTokenAbi
  }
  async _init() {
    if (!this.web3) {
      await super._init()
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
    }
  }

  // === query ===
  async balanceOf(accountAddress) {
    return await this._call('balanceOf', [accountAddress]);
  }
  async pool() {
    return await this._call('pool');
  }
  async exists(accountAddress) {
    return await this._call('exists', [accountAddress]);
  }
  async getAsset(accountAddress, bTokenId) {
    const res = await this._call('getAsset', [accountAddress, bTokenId]);
    if (Array.isArray(res)) {
      return processAsset(res)
    } else {
      throw new Error(`LToken#getAsset: invalid result with (${accountAddress} ${bTokenId})`)
    }
  }
  async getAssets(accountAddress) {
    const res = await this._call('getAssets', [accountAddress]);
    if (Array.isArray(res)) {
      return res.map(i => processAsset(i))
    } else {
      throw new Error(`LToken#getAsset: invalid result with (${accountAddress})`)
    }
  }

  // === transaction ===
}