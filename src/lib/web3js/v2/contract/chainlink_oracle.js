import { ContractBase } from "./contract_base";
import { chainlinkOracleAbi } from './abis';
import { bg } from "../utils";

export class ChainlinkOracle extends ContractBase {
  constructor(chainId, address, symbol, decimal, useInfura) {
    super(chainId, address, useInfura)
    this.contractAbi = chainlinkOracleAbi
    this.symbol = symbol
    this.decimal = decimal
  }
  async _init() {
    if (!this.web3) {
      await super._init()
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
    }
  }

  // decimals refers https://docs.chain.link/docs/matic-addresses
  async getPrice() {
    const res = await this._call('latestRoundData');
    if (res && res.answer) {
      return bg(res.answer, `-${this.decimal}`).toString()
    }
  }
}