import {
  bTokenFactory,
  ContractBase,
  DeriEnv,
  deriToNatural,
} from '../../shared';
import { normalizeSymbolUnit } from '../../shared/config/oracle';
import { getPoolV2LiteManagerConfig } from '../config';
import { perpetualPoolLiteAbi } from './abis';
import { PerpetualPoolLiteManager } from './perpetual_pool_lite_manager';
import { PTokenLite } from './p_token';

export class PerpetualPoolLite extends ContractBase {
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, perpetualPoolLiteAbi);
  }

  async updateAddresses() {
    if (!this.bTokenAddress) {
     const res = await this._call('getAddresses');
    // update this state
     this.bTokenAddress = res.bTokenAddress;
     this.lTokenAddress= res.lTokenAddress;
     this.pTokenAddress= res.pTokenAddress;
    }
  }
  async getParameters() {
    const res = await this._call('getParameters');
    return {
      minPoolMarginRatio: deriToNatural(res.minPoolMarginRatio),
      minInitialMarginRatio: deriToNatural(res.minInitialMarginRatio),
      minMaintenanceMarginRatio: deriToNatural(res.minMaintenanceMarginRatio),
      minLiquidationReward: deriToNatural(res.minLiquidationReward),
      maxLiquidationReward: deriToNatural(res.maxLiquidationReward),
      liquidationCutRatio: deriToNatural(res.liquidationCutRatio),
      protocolFeeCollectRatio: deriToNatural(res.protocolFeeCollectRatio),
    };
  }
  async getSymbol(symbolId) {
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
  }
  async getSymbols() {
    await this.updateAddresses()
    if (!this.pToken) {
      this.pToken = new PTokenLite(this.chainId, this.pTokenAddress)
    }
    // update this state
    this.symbolIds = await this.pToken.getActiveSymbolIds()
    this.symbols = await Promise.all(
      this.symbolIds.reduce((acc, i) => acc.concat([this.getSymbol(i)]), [])
    );
    return this.symbols
  }
  async getBTokenSymbol() {
    await this.updateAddresses()
    if (!this.bToken) {
      this.bToken = bTokenFactory(this.chainId, this.bTokenAddress)
    }
    // update this state
    this.bTokenSymbol = await this.bToken.symbol()
    return this.bTokenSymbol
  }
  async getInitialBlock() {
  //   const managerConfig= getPoolV2LiteManagerConfig(DeriEnv.get())
  //   console.log(managerConfig)
  //   const manager = new PerpetualPoolLiteManager(this.chainId, managerConfig.address)
  //   await manager._init()
  //   const event = await manager.contract.getPastEvents('CreatePool', {
  //     fromBlock: managerConfig.initialBlock,
  //     topics: ['0xdbd2a1ea6808362e6adbec4db4969cbc11e3b0b28fb6c74cb342defaaf1daada']
  //   })
  //   return event
  }
  async getConfig() {
    const [bToken, symbols] = await Promise.all([
      this.getBTokenSymbol(),
      this.getSymbols(),
    ])
    return {
      pool: this.contractAddress,
      pToken: this.pTokenAddress,
      lToken: this.lTokenAddress,
      bToken: this.bTokenAddress,
      bTokenSymbol: bToken,
      symbols: symbols.map((s, index) => ({
        symbolId: this.symbolIds[index],
        symbol: s.symbol,
        unit: normalizeSymbolUnit(s.symbol),
      }))
    }
  }
}
