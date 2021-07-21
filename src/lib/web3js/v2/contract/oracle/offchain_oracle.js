import { ContractBase } from "../contract_base";
import { offchainOracleAbi } from '../abis';
import { deriToNatural } from "../../utils";

export class OffchainOracle extends ContractBase {
  constructor(chainId, address, symbol, decimal='18') {
    super(chainId, address, offchainOracleAbi)
    this.symbol = symbol
    this.decimal = decimal
  }

  async getPrice() {
    const res = await this._call('getPrice');
    if (res) {
      return deriToNatural(res).toString()
    }
  }
}