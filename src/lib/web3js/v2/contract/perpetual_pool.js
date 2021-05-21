import { ContractBase } from './contract_base'
import { perpetualPoolAbi } from './abis';
import { deriToNatural } from '../utils'

export class PerpetualPool extends ContractBase {
  constructor(chainId, contractAddress, useInfura=false) {
    super(chainId, contractAddress, useInfura)
    this.contractAbi = perpetualPoolAbi

    this.bTokenLength = 0
    this.symbolLength = 0

    this.lTokenAddress = ''
    this.pTokenAddress = ''
    this.routerAddress = ''
    this.protocolFeeCollector = ''

    this.protocolFeeAccrued = 0
  }
  async _init() {
    if (!this.web3) {
      await super._init()
      this.contract = new this.web3.eth.Contract(this.contractAbi, this.contractAddress)
    }
  }

  async _update() {
    await Promise.all([
      this.getLengths(),
      this.getAddresses(),
      this.getParameters(),
    ]);
  }

  async getLengths() {
    try {
      const res = await this._call('getLengths')
      //console.log(res[0])
      if (res[0] && res[1]) {
        this.bTokenLength = parseInt(res[0])
        this.symbolLength = parseInt(res[1])
      }
    } catch(err) {
      throw new Error(`PerpetualPool#_getLength error: ${err}`)
    }
  }
  async getAddresses() {
    try {
      const res = await this._call('getAddresses')
      this.lTokenAddress = res.lTokenAddress
      this.pTokenAddress = res.pTokenAddress
      this.routerAddress = res.routerAddress
      this.protocolFeeCollector = res.protocolFeeCollector
    } catch (err) {
      throw new Error(`PerpetualPool#_getAddress error: ${err}`)
    }
  }
  async getParameters() {
    const res = await this._call('getParameters')
    return {
      decimals0: res.decimals0,
      minBToken0Ratio: deriToNatural(res.minBToken0Ratio),
      minPoolMarginRatio: deriToNatural(res.minPoolMarginRatio),
      minInitialMarginRatio: deriToNatural(res.minInitialMarginRatio),
      minMaintenanceMarginRatio: deriToNatural(res.minMaintenanceMarginRatio),
      minLiquidationReward: deriToNatural(res.minLiquidationReward),
      maxLiquidationReward: deriToNatural(res.maxLiquidationReward),
      liquidationCutRatio: deriToNatural(res.liquidationCutRatio),
      protocolFeeCollectRatio: deriToNatural(res.protocolFeeCollectRatio),
    };
  }
  async getProtocolFeeAccrued() {
    const res =  await this._call('getProtocolFeeAccrued')
    this.protocolFeeAccrued = deriToNatural(res)
  }
  async getBToken(bTokenId) {
    try {
      //bTokenId = parseInt(bTokenId)
      const res = await this._call('getBToken', [bTokenId]);
      return {
        bTokenAddress: res.bTokenAddress,
        swapperAddress: res.bTokenAddress,
        oracleAddress: res.oracleAddress,
        decimals: res.decimals,
        discount: deriToNatural(res.discount),
        price: deriToNatural(res.price),
        liquidity: deriToNatural(res.liquidity),
        pnl: deriToNatural(res.pnl),
        cumulativePnl: deriToNatural(res.cumulativePnl),
      };
    } catch (err) {
      throw new Error(`PerpetualPool#getBToken error: ${err}`);
    }
  }
  async getBTokenOracle(bTokenId) {
    //bTokenId = parseInt(bTokenId)
    return await this._call('getBTokenOracle', [bTokenId])
  }
  async getSymbol(symbolId) {
    //symbolId = parseInt(symbolId)
    try {
      const res =  await this._call('getSymbol', [symbolId])
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
  async getSymbolOracle(symbolId) {
    //symbolId = parseInt(symbolId)
    return await this._call('getSymbolOracle', [symbolId])
  }
}