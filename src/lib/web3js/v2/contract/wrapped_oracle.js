import { ContractBase } from "./contract_base";
import { wrappedOracleAbi } from './abis';
import { bg, deriToNatural } from "../utils";

export class WrappedOracle extends ContractBase {
  constructor(chainId, address, symbol, decimal, useInfura) {
    super(chainId, address, wrappedOracleAbi, useInfura)
    this.symbol = symbol
    this.decimal = decimal
  }

  // decimals refers https://docs.chain.link/docs/matic-addresses
  async getPrice() {
    const res = await this._call('getPrice');
    if (res) {
      return deriToNatural(res).toString()
    }
  }
}