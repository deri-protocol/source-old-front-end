import { ContractBase } from "../contract_base";
import { wooOracleAbi } from '../abis';
import { bg } from '../../utils';

export class WooOracle extends ContractBase {
  constructor(chainId, address, symbol, decimal='18') {
    super(chainId, address, wooOracleAbi)
    this.symbol = symbol
    this.decimal = decimal
  }

  async getPrice() {
    const res = await this._call('_I_')
    return bg(res, `-${this.decimal}`).toString();
  }
}