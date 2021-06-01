import { ContractBase } from "./contract_base";
import { wooOracleAbi } from './abis';

export class WooOracle extends ContractBase {
  constructor(chainId, address, symbol, useInfura) {
    super(chainId, address, useInfura)
    this.contractAbi = wooOracleAbi
    this.symbol = symbol
  }
  async _init() {
    if (!this.web3) {
      await super._init()
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
    }
  }

  async getPrice() {
    return await this._call('_I_');
  }
}