import { ContractBase, fromWei } from '../../shared';
import { everlastingOptionViewerAbi } from './abis';

export class EverlastingOptionViewer extends ContractBase {
  // init
  constructor(chainId, contractAddress) {
    super(chainId, contractAddress, everlastingOptionViewerAbi);
  }

  // query
  async _getTraderPortfolio(state, account) {
    const res = await this._call('_getTraderPortfolio', [state, account]);
    return res;
  }
  async _initState(poolAddress, oraclePrices) {
    const res = await this._call('_initState', [poolAddress, oraclePrices]);
    return res;
  }
  async _updateSymbolPrices(state) {
    const res = await this._call('_updateSymbolPrices', [state]);
    return res;
  }
  async getPoolStates(poolAddress, oraclePrices) {
    const res = await this._call('getPoolStates', [poolAddress, oraclePrices]);
    const symbolState = res[2].reduce((acc, i) => {
      const symbol = {
        symbolId: i[0],
        symbol: i[1],
        oracleAddress: i[2],
        volatilityAddress: i[3],
        isCall: i[4],
        multiplier: fromWei(i[5]),
        deltaFundingCoefficient: fromWei(i[6]),
        strikePrice: fromWei(i[7]),
        oraclePrice: fromWei(i[8]),
        dynamicMarginRatio: fromWei(i[9]),
        intrinsicPrice: fromWei(i[10]),
        timePrice: fromWei(i[11]),
        delta: fromWei(i[12]),
        tradersNetVolume: fromWei(i[13]),
        tradersNetCost: fromWei(i[14]),
        cumulativeDeltaFundingRate: fromWei(i[15]),
        cumulativePremiumFundingRate: fromWei(i[16]),
        deltaFundingRatePerSecond: fromWei(i[17]),
        premiumFundingRatePerSecond: fromWei(i[18]),
      }
      return acc.concat([symbol])
    }, [])
    return {
      poolState: {
        pool: res[0][0],
        pToken: res[0][1],
        initialMarginRatio: fromWei(res[0][2]),
        maintenanceMarginRatio: fromWei(res[0][3]),
        premiumFundingPeriod: fromWei(res[0][4]),
        premiumFundingCoefficient: fromWei(res[0][5]),
        liquidity: fromWei(res[0][6]),
        totalDynamicEquity: fromWei(res[0][7]),
        totalInitialMargin: fromWei(res[0][8]),
        preTimestamp: res[0][9],
        curTimestamp: res[0][10],
      },
      symbolState,
    };
  }
  async getTraderStates(poolAddress, account, oraclePrices) {
    const res = await this._call('getTraderStates', [
      poolAddress,
      account,
      oraclePrices,
    ]);
    const symbolState = res[2].reduce((acc, i) => {
      const symbol = {
        symbolId: i[0],
        symbol: i[1],
        oracleAddress: i[2],
        volatilityAddress: i[3],
        isCall: i[4],
        multiplier: fromWei(i[5]),
        deltaFundingCoefficient: fromWei(i[6]),
        strikePrice: fromWei(i[7]),
        oraclePrice: fromWei(i[8]),
        dynamicMarginRatio: fromWei(i[9]),
        intrinsicPrice: fromWei(i[10]),
        timePrice: fromWei(i[11]),
        delta: fromWei(i[12]),
        tradersNetVolume: fromWei(i[13]),
        tradersNetCost: fromWei(i[14]),
        cumulativeDeltaFundingRate: fromWei(i[15]),
        cumulativePremiumFundingRate: fromWei(i[16]),
        deltaFundingRatePerSecond: fromWei(i[17]),
        premiumFundingRatePerSecond: fromWei(i[18]),
      }
      return acc.concat([symbol])
    }, [])
    const positionState = res[3].reduce((acc, i) => {
      const position = {
        volume: fromWei(i[0]),
        cost: fromWei(i[1]),
        lastCumulativeDeltaFundingRate: fromWei(i[2]),
        lastCumulativePremiumFundingRate: fromWei(i[3]),
        pnl: fromWei(i[4]),
        deltaFundingAccrued: fromWei(i[5]),
        premiumFundingAccrued: fromWei(i[6]),
      }
      return acc.concat([position])
    }, [])
    return {
      poolState: {
        pool: res[0][0],
        pToken: res[0][1],
        initialMarginRatio: fromWei(res[0][2]),
        maintenanceMarginRatio: fromWei(res[0][3]),
        premiumFundingPeriod: fromWei(res[0][4]),
        premiumFundingCoefficient: fromWei(res[0][5]),
        liquidity: fromWei(res[0][6]),
        totalDynamicEquity: fromWei(res[0][7]),
        totalInitialMargin: fromWei(res[0][8]),
        preTimestamp: res[0][9],
        curTimestamp: res[0][10],
      },
      traderState: {
        margin: fromWei(res[1][0]),
        totalPnl: fromWei(res[1][1]),
        totalFundingAccrued: fromWei(res[1][2]),
        dynamicMargin: fromWei(res[1][3]),
        initialMargin: fromWei(res[1][4]),
        maintenanceMargin: fromWei(res[1][5]),
      },
      symbolState: symbolState,
      positionState: positionState,
    };
  }
  async getVolatilityOracles(poolAddress) {
    const res = await this._call('getVolatilityOracles', [poolAddress]);
    return res;
  }
  async getPriceOracles(poolAddress) {
    const res = await this._call('getPriceOracles', [poolAddress]);
    return res;
  }

  // tx
}
