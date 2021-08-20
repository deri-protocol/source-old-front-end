import {
  getPoolConfig,
  ContractBase,
  deriToNatural,
  naturalToDeri,
  getPoolLiteViewerConfig,
} from '../../shared';
import { getPriceInfos } from '../../shared/utils/oracle';
import { perpetualPoolLiteAbi } from './abis';
//import { MAX_INT256} from '../../shared/config'
import { PTokenLite } from './p_token';
import { PerpetualPoolLiteViewer } from './perpetual_pool_lite_viewer';

export class PerpetualPoolLite extends ContractBase {
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, perpetualPoolLiteAbi);

    this.config = getPoolConfig(
      contractAddress,
      undefined,
      undefined,
      'v2_lite'
    );
    this.offchainSymbolIds = this.config.offchainSymbolIds;
    this.offchainSymbols = this.config.offchainSymbols;
    this.bTokenAddress = this.config.bToken
    this.lTokenAddress = this.config.lToken
    this.pTokenAddress = this.config.pToken
    this.viewerAddress = getPoolLiteViewerConfig(this.chainId)
  }

  async _update() {
    await Promise.all([this.getAddresses()]);
  }

  async _updateOffchainSymbols() {
    if (!this.pToken) {
      this.pToken = new PTokenLite(this.chainId, this.pTokenAddress)
    }
    if (!this.viewer) {
      this.viewer = new PerpetualPoolLiteViewer( this.chainId, this.viewerAddress)
    }
    const activeSymbolIds = await this.pToken.getActiveSymbolIds()
    if (
      !this.activeSymbolIds ||
      this.activeSymbolIds.length !== activeSymbolIds.length ||
      this.activeSymbolIds.toString() !== activeSymbolIds.toString()
    ) {
      //await this.getAddresses();
      const activeSymbols = await this.viewer.getOffChainOracleSymbols(
        this.contractAddress
      );
      //console.log('activeSymbolIds', activeSymbolIds, activeSymbols)
      this.offchainSymbolIds = activeSymbolIds.reduce((acc, i, index) => {
        return activeSymbols[index] == '' ? acc : acc.concat([i]);
      }, []);
      this.offchainSymbols = activeSymbols.filter((s) => s && s !== '');
      this.activeSymbolIds = activeSymbolIds;
      // console.log(
      //   'offchainSymbolIds',
      //   this.offchainSymbolIds,
      //   this.offchainSymbols
      // );
    }
  }

  async getAddresses() {
    const res = await this._call('getAddresses');
    this.bTokenAddress = res.bTokenAddress;
    this.lTokenAddress = res.lTokenAddress;
    this.pTokenAddress = res.pTokenAddress;
    this.liquidatorQualifierAddress = res.liquidatorQualifierAddress;
    this.protocolFeeCollector = res.protocolFeeCollector;
  }
  async getParameters() {
    const res = await this._call('getParameters');
    return {
      // decimals0: res.decimals0,
      // minBToken0Ratio: deriToNatural(res.minBToken0Ratio),
      minPoolMarginRatio: deriToNatural(res.minPoolMarginRatio),
      minInitialMarginRatio: deriToNatural(res.minInitialMarginRatio),
      minMaintenanceMarginRatio: deriToNatural(res.minMaintenanceMarginRatio),
      minLiquidationReward: deriToNatural(res.minLiquidationReward),
      maxLiquidationReward: deriToNatural(res.maxLiquidationReward),
      liquidationCutRatio: deriToNatural(res.liquidationCutRatio),
      protocolFeeCollectRatio: deriToNatural(res.protocolFeeCollectRatio),
    };
  }
  async getLastUpdateBlock() {
    const res = await this._call('getLastUpdateBlock');
    return parseInt(res)
  }
  async getProtocolFeeAccrued() {
    const res = await this._call('getProtocolFeeAccrued');
    return deriToNatural(res);
  }
  async getLiquidity() {
    const res = await this._call('getLiquidity');
    return deriToNatural(res);
  }
  // async getBTokenOracle(bTokenId) {
  //   //bTokenId = parseInt(bTokenId)
  //   return await this._call('getBTokenOracle', [bTokenId])
  // }
  async getSymbol(symbolId) {
    //symbolId = parseInt(symbolId)
    try {
      const res = await this._call('getSymbol', [symbolId]);
      return {
        symbol: res.symbol,
        oracleAddress: res.oracleAddress,
        multiplier: deriToNatural(res.multiplier),
        feeRatio: deriToNatural(res.feeRatio),
        fundingRateCoefficient: deriToNatural(res.fundingRateCoefficient),
        price: deriToNatural(res.price),
        cumulativeFundingRate: deriToNatural(res.cumulativeFundingRate),
        tradersNetVolume: deriToNatural(res.tradersNetVolume),
        tradersNetCost: deriToNatural(res.tradersNetCost),
      };
    } catch (err) {
      throw new Error(`PerpetualPool#getSymbol error: ${err}`);
    }
  }

  // async getSymbolOracle(symbolId) {
  //   //symbolId = parseInt(symbolId)
  //   return await this._call('getSymbolOracle', [symbolId])
  // }

  async _getSymbolPrices() {
    let prices = []
    await this._updateOffchainSymbols()
    if (this.offchainSymbolIds.length > 0) {
      const priceInfos = await getPriceInfos(this.offchainSymbols);
      prices = Object.values(priceInfos).reduce((acc, p, index) => {
        acc.push([
          this.offchainSymbolIds[
            this.offchainSymbols.indexOf(Object.keys(priceInfos)[index])
          ],
          p.timestamp,
          p.price,
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

  // === transaction ===
  async addLiquidity(accountAddress, amount) {
    const prices = await this._getSymbolPrices();
    return await this._transact(
      'addLiquidity',
      [naturalToDeri(amount), prices],
      accountAddress
    );
  }
  async removeLiquidity(accountAddress, amount) {
    const prices = await this._getSymbolPrices();
    return await this._transact(
      'removeLiquidity',
      [naturalToDeri(amount), prices],
      accountAddress
    );
  }

  async addMargin(accountAddress, amount) {
    const prices = await this._getSymbolPrices();
    return await this._transact(
      'addMargin',
      [naturalToDeri(amount), prices],
      accountAddress
    );
  }

  async removeMargin(accountAddress, amount) {
    const prices = await this._getSymbolPrices();
    return await this._transact(
      'removeMargin',
      [naturalToDeri(amount), prices],
      accountAddress
    );
  }

  async trade(accountAddress, symbolId, newVolume) {
    const prices = await this._getSymbolPrices();
    return await this._transact(
      'trade',
      [symbolId, naturalToDeri(newVolume), prices],
      accountAddress
    );
  }
}