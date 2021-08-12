import { ContractBase, deleteIndexedKey, fromWeiForObject, fromWei, naturalToDeri, getPoolConfig, getPoolLiteViewerConfig } from '../../shared'
import { getPriceInfo } from '../../shared/utils/oracle';
import { everlastingOptionAbi } from './abis.js'

export class EverlastingOption extends ContractBase {
  // init
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, everlastingOptionAbi);

    this.config = getPoolConfig(
      contractAddress,
      undefined,
      undefined,
      'option'
    );
    // this.offchainSymbolIds = this.config.offchainSymbolIds;
    // this.offchainSymbols = this.config.offchainSymbols;
    this.volatilitySymbols = this.config.volatilitySymbols;
    this.bTokenAddress = this.config.bToken;
    this.lTokenAddress = this.config.lToken;
    this.pTokenAddress = this.config.pToken;
    this.viewerAddress = getPoolLiteViewerConfig(this.chainId, 'option');
  }

  // query
  async OptionPricer() {
    const res = await this._call('OptionPricer', []);
    return res;
  }
  async PmmPricer() {
    const res = await this._call('PmmPricer', []);
    return res;
  }
  async _T() {
    const res = await this._call('_T', []);
    return fromWei(res);
  }
  // async _dynamicInitialMarginRatio(spotPrice, strikePrice, isCall) {
  //   const res = await this._call('_dynamicInitialMarginRatio', [spotPrice, strikePrice, isCall])
  //   return res
  // }
  async _getTvMidPrice(symbolId) {
    const res = await this._call('_getTvMidPrice', [symbolId])
    return {
      _tmp: fromWei(res[0]),
      midPrice: fromWei(res[1]),
      delta: fromWei(res[2]),
    }
  }
  async _premiumFundingCoefficient() {
    const res = await this._call('_premiumFundingCoefficient', [])
    return res
  }
  // async _queryTradePMM(symbolId, volume, timePrice) {
  //   const res = await this._call('_queryTradePMM', [symbolId, volume, timePrice])
  //   return res
  // }
  // async controller() {
  //   const res = await this._call('controller', [])
  //   return res
  // }
  async getAddresses() {
    const res = await this._call('getAddresses', []);
    return deleteIndexedKey(res);
  }
  async getLastTimestamp() {
    return await this._call('getLastTimestamp', []);
  }
  async getLiquidity() {
    const res = await this._call('getLiquidity', []);
    return fromWei(res);
  }
  async getParameters() {
    const res = await this._call('getParameters', []);
    return fromWeiForObject(deleteIndexedKey(res), [
      'initialMarginRatio',
      'liquidationCutRatio',
      'maintenanceMarginRatio',
      'maxLiquidationReward',
      'minLiquidationReward',
      'minPoolMarginRatio',
      'protocolFeeCollectRatio',
    ]);
  }
  async getProtocolFeeAccrued() {
    const res = await this._call('getProtocolFeeAccrued', []);
    return fromWei(res);
  }
  async getSymbol(symbolId) {
    const res = await this._call('getSymbol', [symbolId]);
    return {
      symbolId: res[0],
      symbol: res[1],
      oracleAddress: res[2],
      volatilityAddress: res[3],
      multiplier: fromWei(res[4]),
      feeRatio: fromWei(res[5]),
      strikePrice: fromWei(res[6]),
      isCall: res[7],
      diseqFundingCoefficient: fromWei(res[8]),
      cumulativeDeltaFundingRate: fromWei(res[9]),
      intrinsicValue: fromWei(res[10]),
      cumulativePremiumFundingRate: fromWei(res[11]),
      timeValue: res[12],
      tradersNetVolume: fromWei(res[13]),
      tradersNetCost: fromWei(res[14]),
      quote_balance_offset: fromWei(res[15]),
      K: fromWei(res[16]),
    };
  }
  // async migrationDestination() {
  //   const res = await this._call('migrationDestination', [])
  //   return res
  // }
  // async migrationTimestamp() {
  //   const res = await this._call('migrationTimestamp', [])
  //   return res
  // }

  // tx
  async _getVolSymbolPrices() {
    let prices = [];
    if (this.volatilitySymbols.length > 0) {
      //const priceInfos = await getPriceInfos(this.offchainSymbols);
      const priceInfos = await Promise.all(
        this.volatilitySymbols.reduce(
          (acc, i) => acc.concat([getPriceInfo(i, 'option')]),
          []
        )
      );
      prices = Object.values(priceInfos).reduce((acc, p, index) => {
        acc.push([
          index.toString(),
          p.timestamp,
          p.volatility,
          parseInt(p.v).toString(),
          p.r,
          p.s,
        ]);
        return acc;
      }, []);
    }
    //console.log('prices', prices);
    return prices;
  }

  async addLiquidity(accountAddress, bAmount) {
    const prices = await this._getVolSymbolPrices();
    return await this._transact(
      'addLiquidity',
      [naturalToDeri(bAmount), prices],
      accountAddress
    );
  }
  async removeLiquidity(accountAddress, lShares) {
    const prices = await this._getVolSymbolPrices();
    return await this._transact(
      'removeLiquidity',
      [naturalToDeri(lShares), prices],
      accountAddress
    );
  }
  async addMargin(accountAddress, bAmount) {
    return await this._transact(
      'addMargin',
      [naturalToDeri(bAmount)],
      accountAddress
    );
  }
  async removeMargin(accountAddress, bAmount) {
    const prices = await this._getVolSymbolPrices();
    return await this._transact(
      'removeMargin',
      [ naturalToDeri(bAmount), prices],
      accountAddress
    );
  }
  async trade(accountAddress, symbolId, tradeVolume) {
    const prices = await this._getVolSymbolPrices();
    return await this._transact(
      'trade',
      [symbolId, naturalToDeri(tradeVolume), prices],
      accountAddress
    );
  }
  // async addSymbol(accountAddress, symbolId, symbol, strikePrice, isCall, oracleAddress, volatilityAddress, multiplier, feeRatio, diseqFundingCoefficient, k) {
  //   return await this._transact('addSymbol', [symbolId, symbol, strikePrice, isCall, oracleAddress, volatilityAddress, multiplier, feeRatio, diseqFundingCoefficient, k], accountAddress)
  // }
  // async approveMigration(accountAddress) {
  //   return await this._transact('approveMigration', [], accountAddress)
  // }
  // async claimNewController(accountAddress) {
  //   return await this._transact('claimNewController', [], accountAddress)
  // }
  // async collectProtocolFee(accountAddress) {
  //   return await this._transact('collectProtocolFee', [], accountAddress)
  // }
  // async executeMigration(accountAddress, source) {
  //   return await this._transact('executeMigration', [source], accountAddress)
  // }
  // async liquidate(accountAddress, account, volatility) {
  //   return await this._transact('liquidate', [account, volatility], accountAddress)
  // }
  // async prepareMigration(accountAddress, target, graceDays) {
  //   return await this._transact('prepareMigration', [target, graceDays], accountAddress)
  // }
  // async removeSymbol(accountAddress, symbolId) {
  //   return await this._transact('removeSymbol', [symbolId], accountAddress)
  // }
  // async setNewController(accountAddress, newController) {
  //   return await this._transact('setNewController', [newController], accountAddress)
  // }
  // async setPoolParameters(accountAddress, premiumFundingCoefficient, T, everlastingPricingOptionAddress) {
  //   return await this._transact('setPoolParameters', [premiumFundingCoefficient, T, everlastingPricingOptionAddress], accountAddress)
  // }
  // async setSymbolParameters(accountAddress, symbolId, oracleAddress, volatilityAddress, feeRatio, diseqFundingCoefficient, k) {
  //   return await this._transact('setSymbolParameters', [symbolId, oracleAddress, volatilityAddress, feeRatio, diseqFundingCoefficient, k], accountAddress)
  // }
  // async toggleCloseOnly(accountAddress, symbolId) {
  //   return await this._transact('toggleCloseOnly', [symbolId], accountAddress)
  // }
}