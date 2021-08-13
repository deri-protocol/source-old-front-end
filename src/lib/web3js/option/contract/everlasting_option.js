import { ContractBase, deleteIndexedKey, fromWeiForObject, fromWei, naturalToDeri, getPoolConfig, getPoolLiteViewerConfig } from '../../shared'
import { getVolatilitySymbols } from '../../shared/config/token';
import { getPriceInfo } from '../../shared/utils/oracle';
import { everlastingOptionViewerFactory, pTokenOptionFactory } from '../factory/tokens';
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
  async _updateConfig() {
    if (!this.pToken) {
      this.pToken = pTokenOptionFactory(this.chainId, this.pTokenAddress);
    }
    if (!this.viewer) {
      this.viewer = everlastingOptionViewerFactory( this.chainId, this.viewerAddress)
    }
    const [activeSymbolIds, state] = await Promise.all([
      this.pToken.getActiveSymbolIds(),
      this.viewer.getPoolStates(this.contractAddress, [], []),
    ]);
    const { symbolState } = state;
    this.activeSymbolIds = activeSymbolIds;
    this.activeSymbols = symbolState.filter((s) =>
      activeSymbolIds.includes(s.symbolId)
    );
    this.volatilitySymbols = getVolatilitySymbols(
      this.activeSymbols.map((s) => s.symbol)
    );
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

  // tx
  async _getVolSymbolPrices() {
    await this._updateConfig()
    let prices = [];
    if (this.volatilitySymbols.length > 0) {
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
      [naturalToDeri(bAmount), prices],
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
}