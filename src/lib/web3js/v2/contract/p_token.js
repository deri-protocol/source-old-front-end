import { ContractBase } from './contract_base'
import { pTokenAbi } from './abis';
import { deriToNatural } from '../utils'

const processPosition = (res) => {
  return {
    volume: deriToNatural(res.volume),
    cost: deriToNatural(res.cost),
    lastCumulativeFundingRate: deriToNatural(res.lastCumulativeFundingRate),
  }
}
export class PToken extends ContractBase {
  constructor(chainId, contractAddress, useInfura=false) {
    super(chainId, contractAddress, pTokenAbi, useInfura)
  }

  // === query ===
  async pool() {
    return await this._call('pool');
  }
  async balanceOf(accountAddress) {
    return await this._call('balanceOf', [accountAddress]);
  }
  async exists(accountAddress) {
    return await this._call('exists', [accountAddress]);
  }
  async getMargin(accountAddress, symbolId) {
    const res = await this._call('getMargin', [accountAddress, symbolId]);
    return deriToNatural(res)
  }
  async getMargins(accountAddress) {
    const res = await this._call('getMargins', [accountAddress]);
    if (Array.isArray(res)) {
      return res.map((i) => deriToNatural(i))
    }
  }
  async getPosition(accountAddress, symbolId) {
    const res = await this._call('getPosition', [accountAddress, symbolId]);
    if (Array.isArray(res)) {
      return processPosition(res)
    } else {
      throw new Error(`PToken#getMargin: invalid result with (${accountAddress})`)
    }
  }
  async getPositions(accountAddress) {
    const res = await this._call('getPositions', [accountAddress]);
    if (Array.isArray(res)) {
      return res.map((i) => processPosition(i))
    }
  }

  // === transaction ===
}