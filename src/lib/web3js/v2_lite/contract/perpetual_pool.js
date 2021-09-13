import {
  //getPoolConfig,
  ContractBase,
  deriToNatural,
  naturalToDeri,
  getPoolViewerConfig,
  //isEqualSet,
  bTokenFactory,
} from '../../shared';
import { getPriceInfos } from '../../shared/utils/oracle';
import { perpetualPoolLiteAbi } from './abis';
//import { MAX_INT256} from '../../shared/config'
//import { PTokenLite } from './p_token';
import { PerpetualPoolLiteViewer } from './perpetual_pool_lite_viewer';
import { lTokenLiteFactory, pTokenLiteFactory } from '../factory';

export class PerpetualPoolLite extends ContractBase {
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, perpetualPoolLiteAbi);

    // this.config = getPoolConfig(
    //   contractAddress,
    //   undefined,
    //   undefined,
    //   'v2_lite'
    // );
    // this.offchainSymbolIds = this.config.offchainSymbolIds;
    // this.offchainSymbols = this.config.offchainSymbols;
    // this.bTokenAddress = this.config.bToken;
    // this.lTokenAddress = this.config.lToken;
    // this.pTokenAddress = this.config.pToken;
    // this.viewerAddress = getPoolViewerConfig(this.chainId, 'v2_lite');
  }

  async init() {
    await this._init();
    if (!this.addresses || !this.pToken || !this.viewer ) {
      [this.addresses, this.parameters] = await Promise.all([
        this.getAddresses(),
        this.getParameters(),
      ]);
      const viewerAddress = getPoolViewerConfig(this.chainId, 'v2_lite');
      // console.log(this.addresses, this.parameters)
      const { bTokenAddress, lTokenAddress, pTokenAddress } = this.addresses;
      this.bToken = bTokenFactory(this.chainId, bTokenAddress);
      this.pToken = pTokenLiteFactory(this.chainId, pTokenAddress);
      this.lToken = lTokenLiteFactory(this.chainId, lTokenAddress);
      this.viewer = new PerpetualPoolLiteViewer(this.chainId, viewerAddress);
    }
  }

  async updateActiveSymbols() {
    await this.init()
    if (this.pToken && this.viewer) {
      [
        this.bTokenSymbol,
        this.activeSymbolIds,
        this.offChainOracleSymbols,
      ] = await Promise.all([
        this.bToken.symbol(),
        this.pToken.getActiveSymbolIds(),
        this.viewer.getOffChainOracleSymbols(this.contractAddress),
      ]);
      this.offChainOracleSymbolIds = this.activeSymbolIds.reduce(
        (acc, i, index) => {
          return this.offChainOracleSymbols[index] === '' ? acc : [...acc, i];
        },
        []
      );
      this.offChainOracleSymbols = this.offChainOracleSymbols.filter(
        (s) => s && s !== ''
      );
    }
  }

  async getSymbols() {
    return await Promise.all(
      this.activeSymbolIds.reduce(
        (acc, symbolId) => [...acc, this.getSymbol(symbolId)],
        []
      )
    );
  }
  async getPositions(accountAddress) {
    return await Promise.all(
      this.activeSymbolIds.reduce(
        (acc, symbolId) => [
          ...acc,
          this.pToken.getPosition(accountAddress, symbolId),
        ],
        []
      )
    );
  }

  // async _update() {
  //   await Promise.all([this.getAddresses()]);
  // }

  // async _updateOffchainSymbols() {
  //   if (!this.pToken) {
  //     this.pToken = new PTokenLite(this.chainId, this.pTokenAddress);
  //   }
  //   if (!this.viewer) {
  //     this.viewer = new PerpetualPoolLiteViewer(
  //       this.chainId,
  //       this.viewerAddress
  //     );
  //   }
  //   //await this.getAddresses()
  //   const activeSymbolIds = await this.pToken.getActiveSymbolIds();
  //   if (
  //     !this.activeSymbolIds ||
  //     !isEqualSet(new Set(this.activeSymbolIds), new Set(activeSymbolIds))
  //   ) {
  //     const activeSymbols = await this.viewer.getOffChainOracleSymbols(
  //       this.contractAddress
  //     );
  //     //console.log('activeSymbolIds', activeSymbolIds, activeSymbols)
  //     this.offchainSymbolIds = activeSymbolIds.reduce((acc, i, index) => {
  //       return activeSymbols[index] == '' ? acc : acc.concat([i]);
  //     }, []);
  //     this.offchainSymbols = activeSymbols.filter((s) => s && s !== '');
  //     this.activeSymbolIds = activeSymbolIds;
  //   }
  // }

  async getAddresses() {
    const res = await this._call('getAddresses');
    // this.bTokenAddress = res.bTokenAddress;
    // this.lTokenAddress = res.lTokenAddress;
    // this.pTokenAddress = res.pTokenAddress;
    return res;
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
    return parseInt(res);
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
    let prices = [];
    await this.updateActiveSymbols()
    if (this.offChainOracleSymbolIds.length > 0) {
      const priceInfos = await getPriceInfos(this.offChainOracleSymbols);
      prices = Object.values(priceInfos).reduce((acc, p, index) => {
        acc.push([
          this.offChainOracleSymbolIds[
            this.offChainOracleSymbols.indexOf(Object.keys(priceInfos)[index])
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
