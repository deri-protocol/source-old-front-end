import { getPoolViewerConfig, getPoolSymbolList } from "../../shared"
import { getOraclePricesForOption } from "../../shared/utils/oracle"
import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { everlastingOptionViewerFactory } from "../factory/tokens"
import { volatilitiesCache } from "../utils"

describe('EverlastingOptionViewer', () => {
  let everlastingOptionViewer
  beforeAll(() => {
    const viewAddress = getPoolViewerConfig(CHAIN_ID, 'option')
    everlastingOptionViewer = everlastingOptionViewerFactory(CHAIN_ID, viewAddress )
  })
  it(
    'getPoolStates',
    async () => {
      const symbols = getPoolSymbolList(OPTION_POOL_ADDRESS).map((s) => s.symbol)
      const [symbolPrices, symbolVolatilities] = await Promise.all([
        getOraclePricesForOption(CHAIN_ID, symbols),
        volatilitiesCache.get(OPTION_POOL_ADDRESS, symbols),
      ]);
      const res = await everlastingOptionViewer.getPoolStates(
        OPTION_POOL_ADDRESS,
        symbolPrices,
        symbolVolatilities,
       [],
      );
      // console.log(res.poolState)
      // console.log(res.symbolState[14])
      //res.symbolState.forEach((s) => console.log(s))
      expect(res.poolState).toHaveProperty('pool', expect.any(String))
      expect(res.poolState).toHaveProperty('pToken', expect.any(String))
      expect(res.poolState).toHaveProperty('optionPricer', expect.any(String))
      expect(res.poolState).toHaveProperty('initialMarginRatio', '0.1')
      expect(res.poolState).toHaveProperty('maintenanceMarginRatio', '0.05')
      expect(res.poolState).toHaveProperty('liquidity', expect.any(String))
      expect(res.poolState).toHaveProperty('totalDynamicEquity', expect.any(String))
      expect(res.poolState).toHaveProperty('totalInitialMargin', expect.any(String))
      expect(res.poolState).toHaveProperty('curTimestamp', expect.any(String))
      expect(res.poolState).toHaveProperty('preTimestamp', expect.any(String))
      expect(res.poolState).toHaveProperty('fundingCoefficient', expect.any(String))
      expect(res.poolState).toHaveProperty('fundingPeriod', expect.any(String))

      expect(Object.keys(res.symbolState[0]).length).toEqual(25)
      expect(res.symbolState[0]).toHaveProperty('symbolId', '0')
      expect(res.symbolState[0]).toHaveProperty('symbol', 'BTCUSD-50000-C')
      expect(res.symbolState[0]).toHaveProperty('oracleAddress', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('volatilityAddress', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('isCall', true)
      expect(res.symbolState[0]).toHaveProperty('multiplier', '0.001')
      expect(res.symbolState[0]).toHaveProperty('dynamicMarginRatio', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('strikePrice', '50000')
      expect(res.symbolState[0]).toHaveProperty('K', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('alpha', '0.01')
      expect(res.symbolState[0]).toHaveProperty('delta', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('cumulativeFundingRate', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('fundingPerSecond', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('intrinsicValue', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('timeValue', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('spotPrice', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('volatility', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('dpmmPrice', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('tradersNetCost', expect.any(String))
      expect(res.symbolState[0]).toHaveProperty('tradersNetVolume', expect.any(String))
      expect(res.symbolState[0]).toEqual({})
    },
    TIMEOUT
  );
  it(
    'getTraderStates',
    async () => {
      const symbols = getPoolSymbolList(OPTION_POOL_ADDRESS).map((s) => s.symbol)
      const [symbolPrices, symbolVolatilities] = await Promise.all([
        getOraclePricesForOption(CHAIN_ID, symbols),
        volatilitiesCache.get(OPTION_POOL_ADDRESS, symbols),
      ]);
      const res = await everlastingOptionViewer.getTraderStates(
        OPTION_POOL_ADDRESS,
        ACCOUNT_ADDRESS,
        symbolPrices,
        symbolVolatilities
      );
      // console.log(
      //   toNumberForObject(res.poolState, [
      //     'initialMarginRatio',
      //     'maintenanceMarginRatio',
      //     'premiumFundingPeriod',
      //     'premiumFundingCoefficient',
      //     'liquidity',
      //     'totalDynamicEquity',
      //     'totalInitialMargin',
      //   ])
      // );
      // console.log(
      //   toNumberForObject(res.traderState, [
      //     'margin',
      //     'totalPnl',
      //     'totalFundingAccrued',
      //     'dynamicMargin',
      //     'initialMargin',
      //     'maintenanceMargin',
      //   ])
      // );
      // res.symbolState.forEach((s) => {
      //   if (s.symbolId === '0' || s.symbolId === '12') {
      //     console.log(
      //       toNumberForObject(s, [
      //         'multiplier',
      //         'deltaFundingCoefficient',
      //         'strikePrice',
      //         'oraclePrice',
      //         'oracleVolatility',
      //         'timePrice',
      //         'dynamicMarginRatio',
      //         'intrinsicValue',
      //         'timeValue',
      //         'delta',
      //         'K',
      //         'quoteBalanceOffset',
      //         'tradersNetVolume',
      //         'tradersNetCost',
      //         'cumulativeDeltaFundingRate',
      //         'cumulativePremiumFundingRate',
      //         'deltaFundingPerSecond',
      //         'premiumFundingPerSecond',
      //       ])
      //     );
      //   }
      // });
      // res.symbolState.forEach((s) => {
      //   if (s.symbolId === '0' || s.symbolId === '12') {
      //     console.log(
      //       toNumberForObject(res.positionState[s.symbolId], [
      //         'volume',
      //         'cost',
      //         'lastCumulativeDeltaFundingRate',
      //         'lastCumulativePremiumFundingRate',
      //         'pnl',
      //         'deltaFundingAccrued',
      //         'premiumFundingAccrued',
      //       ])
      //     );
      //   }
      // });
      expect(res.traderState).toEqual(
        expect.objectContaining({
          margin: expect.any(String),
          totalPnl: expect.any(String),
          totalFundingAccrued: expect.any(String),
          dynamicMargin: expect.any(String),
          initialMargin: expect.any(String),
          maintenanceMargin: expect.any(String),
        })
      );
      expect(res.positionState[0]).toEqual(
        expect.objectContaining({
          volume: expect.any(String),
          cost: expect.any(String),
          lastCumulativeFundingRate: expect.any(String),
          pnl: expect.any(String),
          fundingAccrued: expect.any(String),
        })
      );
    },
    TIMEOUT
  );
  it('test only', async()=> {
    const viewer = everlastingOptionViewerFactory('56', '0x33D0EB220185d3F2A04260b1Ef5ED2e4b90C30D2')
    const res = await viewer.getTraderStates('0x776F280eEC075938855f115DE5e50682A76eBdBD', '0xFefC938c543751babc46cc1D662B982bd1636721', [], [])
    console.log(JSON.stringify(res, null, 2))
  }, TIMEOUT)
})