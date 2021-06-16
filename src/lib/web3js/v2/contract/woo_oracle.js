import { ContractBase } from "./contract_base";
import { wooOracleAbi } from './abis';
import { bg } from '../utils';

export class WooOracle extends ContractBase {
  constructor(chainId, address, symbol, decimal, useInfura) {
    super(chainId, address, useInfura)
    this.contractAbi = wooOracleAbi
    this.symbol = symbol
    this.decimal = decimal
  }
  async _init() {
    if (!this.web3) {
      await super._init()
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
    }
  }

  async getPrice() {
    const res = await this._call('_I_')
    return bg(res, `-${this.decimal}`).toString();
  }
}