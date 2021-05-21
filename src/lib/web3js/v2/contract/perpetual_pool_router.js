import { ContractBase } from './contract_base'
import { perpetualPoolRouterAbi} from './abis';
import { naturalToDeri, bg } from '../utils'

export class PerpetualPoolRouter extends ContractBase {
  constructor(chainId, contractAddress, useInfura=false) {
    super(chainId, contractAddress, useInfura)
    this.contractAbi = perpetualPoolRouterAbi
    this.poolAddress = ''
  }
  async _init() {
    if (!this.web3) {
      await super._init()
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
    }
  }

  // === query ===
  async pool() {
    this.poolAddress = await this._call('pool');
    return this.poolAddress
  }

  // === transaction ===
  async addLiquidity(accountAddress, bTokenId, amount) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'addLiquidity',
      [bTokenId, naturalToDeri(amount)],
      accountAddress
    );
  }

  async removeLiquidity(accountAddress, bTokenId, amount) {
    return await this._transact(
      'removeLiquidity',
      [bTokenId, naturalToDeri(amount)],
      accountAddress
    );
  }

  async addMargin(accountAddress, bTokenId, amount) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'addMargin',
      [bTokenId, naturalToDeri(amount)],
      accountAddress
    );
  }

  async removeMargin(accountAddress, bTokenId, amount) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'removeMargin',
      [bTokenId, naturalToDeri(amount)],
      accountAddress
    );
  }

  async trade(accountAddress, symbolId, amount) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'trade',
      [symbolId, naturalToDeri(amount)],
      accountAddress
    );
  }

  // async liquidate(acountAddress) {
  //   if (!this.poolAddress) {
  //     await this.pool()
  //   }
  //   return await this._transact(
  //     'liquidate',
  //     [accountAddress],
  //     accountAddress
  //   );
  // }

}