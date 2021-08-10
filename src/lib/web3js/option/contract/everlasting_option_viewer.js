import { ContractBase, deleteIndexedKey, fromWeiForObject, fromWei } from '../../shared'
import { everlastingOptionViewerAbi } from './abis.js'

export class EverlastingOptionViewer extends ContractBase {
  // init
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, everlastingOptionViewerAbi)
  }

  // query
  async getMarginStatusForTrader(pool, account) {
    const res = await this._call('getMarginStatusForTrader', [pool, account])
    return fromWeiForObject(deleteIndexedKey(res), [
      'dynamicMargin',
      'initialMargin',
      'maintenanceMargin',
    ]);
  }
  // async getMarginStatusForTraders(pool, accounts) {
  //   const res = await this._call('getMarginStatusForTraders', [pool, accounts])
  //   return res
  // }
  async getPoolState(pool) {
    const res = await this._call('getPoolState', [pool])
    return {
      pool: res[0],
      bToken: res[1],
      lToken: res[2],
      pToken: res[3],
      liquidatorQualifier: res[4],
      protocolFeeCollector: res[5],

      minPoolMarginRatio: res[6],
      initialMarginRatio: res[7],
      maintenanceMarginRatio: res[8],
      minLiquidationReward: res[9],
      maxLiquidationReward: res[10],
      liquidationCutRatio: res[11],
      protocolFeeCollectRatio: res[12],
      premiumFundingPeriod: res[13],
      premiumFundingCoefficient: res[14],

      liquidity: res[15],
      protocolFeeAccrued: res[16],
      totalDynamicEquity: res[17],
      totalAbsCost: res[18],
      preTimestamp: res[19],
      curTimestamp: res[20],
    };
  }
  async getSymbols(pool) {
    const symbols = await this._call('getSymbols', [pool])
    return symbols.reduce((acc, res) => {
      return acc.concat([{
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
      }])
    }, []);
  }
  async getTraderMargin(symbols, positions, margin, initialMarginRatio, maintenanceMarginRatio) {
    const res = await this._call('getTraderMargin', [symbols, positions, margin, initialMarginRatio, maintenanceMarginRatio])
    return res
  }
  async getTraderPorfolio(pToken, account) {
    const res = await this._call('getTraderPorfolio', [pToken, account])
    const newRes = fromWeiForObject(deleteIndexedKey(res), [
      'margin',
    ]);
    newRes.positions = newRes.positions.map((i) => ({
      volume: fromWei(i[0]),
      cost: fromWei(i[1]),
      lastCumulativePremiumFundingRate: fromWei(i[2]),
      lastCumulativeDeltaFundingRate: fromWei(i[3]),
    }));
    return newRes
  }
  async updateSymbolPricesAndFundingRates(ps, symbols) {
    const res = await this._call('updateSymbolPricesAndFundingRates', [ps, symbols])
    return res
  }

  // tx


}