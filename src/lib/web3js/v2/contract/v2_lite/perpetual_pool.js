import { ContractBase } from '../contract_base'
import { perpetualPoolLiteAbi } from '../abis';
import { deriToNatural, naturalToDeri } from '../../utils'
import { MAX_INT256} from '../../config'

export class PerpetualPoolLite extends ContractBase {
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, perpetualPoolLiteAbi)

    this.bTokenAddress = ''
    this.lTokenAddress = ''
    this.pouterAddress = ''
    this.liquidatorQualifierAddress =''
    this.protocolFeeCollector = ''
  }

  async _update() {
    await Promise.all([
      this.getAddresses(),
      this.getParameters(),
    ]);
  }

  async getAddresses() {
    const res = await this._call('getAddresses')
    this.bTokenAddress = res.bTokenAddress
    this.lTokenAddress = res.lTokenAddress
    this.pTokenAddress = res.pTokenAddress
    this.liquidatorQualifierAddress = res.liquidatorQualifierAddress
    this.protocolFeeCollector = res.protocolFeeCollector
  }
  async getParameters() {
    const res = await this._call('getParameters')
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
  async getProtocolFeeAccrued() {
    const res =  await this._call('getProtocolFeeAccrued')
    return deriToNatural(res)
  }
  async getLiquidity() {
    const res =  await this._call('getLiquidity')
    return deriToNatural(res)
  }
  // async getBTokenOracle(bTokenId) {
  //   //bTokenId = parseInt(bTokenId)
  //   return await this._call('getBTokenOracle', [bTokenId])
  // }
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
  // async getSymbolOracle(symbolId) {
  //   //symbolId = parseInt(symbolId)
  //   return await this._call('getSymbolOracle', [symbolId])
  // }


  // === transaction ===
  async addLiquidity(accountAddress, amount) {
    return await this._transact(
      'addLiquidity',
      [naturalToDeri(amount), []],
      accountAddress
    );
  }
  async removeLiquidity(accountAddress, amount) {
    return await this._transact(
      'removeLiquidity',
      [naturalToDeri(amount), []],
      accountAddress
    );
  }

  async addMargin(accountAddress, amount) {
    return await this._transact(
      'addMargin',
      [naturalToDeri(amount), []],
      accountAddress
    );
  }

  async removeMargin(accountAddress, amount) {
    // if (isMaximum) {
    //   return await this._transact(
    //     'removeMargin',
    //     [MAX_INT256,[]],
    //     accountAddress
    //   );
    // } else {
    return await this._transact(
      'removeMargin',
      [naturalToDeri(amount), []],
      accountAddress
    );
    // }
  }

  async trade(accountAddress, symbolId, newVolume) {
    return await this._transact(
      'trade',
      [symbolId, naturalToDeri(newVolume), []],
      accountAddress
    );
  }
}
