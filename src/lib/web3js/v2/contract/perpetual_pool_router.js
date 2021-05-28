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

  // with prices
  async addLiquidityWithPrices(accountAddress, bTokenId, amount, priceInfos) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'addLiquidityWithPrices',
      [bTokenId, naturalToDeri(amount), priceInfos],
      accountAddress
    );
  }
  async removeLiquidityWithPrices(accountAddress, bTokenId, amount, priceInfos) {
    return await this._transact(
      'removeLiquidityWithPrices',
      [bTokenId, naturalToDeri(amount), priceInfos],
      accountAddress
    );
  }

  async addMarginWithPrices(accountAddress, bTokenId, amount, priceInfos) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'addMarginWithPrices',
      [bTokenId, naturalToDeri(amount), priceInfos],
      accountAddress
    );
  }

  async removeMarginWithPrices(accountAddress, bTokenId, amount, priceInfos) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'removeMarginWithPrices',
      [bTokenId, naturalToDeri(amount), priceInfos],
      accountAddress
    );
  }

  async tradeWithPrices(accountAddress, symbolId, amount, priceInfos) {
    if (!this.poolAddress) {
      await this.pool()
    }
    return await this._transact(
      'tradeWithPrices',
      [symbolId, naturalToDeri(amount), priceInfos],
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