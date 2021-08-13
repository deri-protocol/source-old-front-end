import { getPoolConfig, getPoolLiteViewerConfig, getPoolSymbolList } from "../../shared"
import { getOraclePricesForOption, getOracleVolatilitiesForOption } from "../../shared/utils/oracle"
import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { everlastingOptionViewerFactory } from "../factory/tokens"

describe('EverlastingOptionViewer', () => {
  let everlastingOptionViewer
  beforeAll(() => {
    const viewAddress = getPoolLiteViewerConfig(CHAIN_ID, 'option')
    everlastingOptionViewer = everlastingOptionViewerFactory(CHAIN_ID, viewAddress )
  })
  it(
    'getPoolStates',
    async () => {
      const symbols = getPoolSymbolList(OPTION_POOL_ADDRESS).map((s) => s.symbol)
      const [symbolPrices, symbolVolatilities] = await Promise.all([
        getOraclePricesForOption(CHAIN_ID, symbols),
        getOracleVolatilitiesForOption(symbols),
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
      expect(res.poolState).toEqual(
        expect.objectContaining({
          pool: '0x98EfC36182eEC80eC20F600533E87f82AeDbb2e6',
          pToken: '0x7484e22022C971e314A00e0dfbfCDe8E223c80aC',
          pmmPricer: '0x1D7AFF20BB5E52dDD10d5B4B0e0b91b5327Ae826',
          optionPricer: '0x2D346A85299d812C0c0e97B23CD1ff0F37b606Ab',
          optionPricer: expect.any(String),
          initialMarginRatio: '0.1',
          maintenanceMarginRatio: '0.05',
          premiumFundingPeriod: expect.any(String),
          premiumFundingCoefficient: expect.any(String),
          liquidity: expect.any(String),
          totalDynamicEquity: expect.any(String),
          totalInitialMargin: expect.any(String),
          curTimestamp: expect.any(String),
          preTimestamp: expect.any(String),
        })
      );
      expect(res.symbolState[0]).toEqual(
        expect.objectContaining({
          symbol: 'BTCUSD-20000-C',
          symbolId: '0',
          oracleAddress: '0x18C036Ee25E205c224bD78f10aaf78715a2B6Ff1',
          volatilityAddress: '0x7A4701A1A93BB7692351aEBcD4F5Fab1d4377BBc',
          isCall: true,
          multiplier: '0.01',
          deltaFundingCoefficient: expect.any(String),
          strikePrice: '20000',
          oraclePrice: expect.any(String),
          oracleVolatility: expect.any(String),
          timePrice: expect.any(String),
          dynamicMarginRatio: expect.any(String),
          intrinsicValue: expect.any(String),
          timeValue: expect.any(String),
          delta: expect.any(String),
          K: '0.9',
          quoteBalanceOffset: expect.any(String),
          tradersNetVolume: expect.any(String),
          tradersNetCost: expect.any(String),
          cumulativeDeltaFundingRate: expect.any(String),
          cumulativePremiumFundingRate: expect.any(String),
          deltaFundingPerSecond: expect.any(String),
          premiumFundingPerSecond: expect.any(String),
        })
      );
    },
    TIMEOUT
  );
  it(
    'getTraderStates',
    async () => {
      const symbols = getPoolSymbolList(OPTION_POOL_ADDRESS).map((s) => s.symbol)
      const [symbolPrices, symbolVolatilities] = await Promise.all([
        getOraclePricesForOption(CHAIN_ID, symbols),
        getOracleVolatilitiesForOption(symbols),
      ]);
      const res = await everlastingOptionViewer.getTraderStates(
        OPTION_POOL_ADDRESS,
        ACCOUNT_ADDRESS,
       symbolPrices,
       symbolVolatilities,
      );
      // console.log(res.traderState)
      // console.log(res.positionState[0])
      expect(res.traderState).toEqual(
        expect.objectContaining({
          dynamicMargin: expect.any(String),
          initialMargin: expect.any(String),
          maintenanceMargin: expect.any(String),
          margin: expect.any(String),
          totalFundingAccrued: expect.any(String),
          totalPnl: expect.any(String),
        })
      );
      expect(res.positionState[0]).toEqual(
        expect.objectContaining({
          volume: expect.any(String),
          cost: expect.any(String),
          lastCumulativeDeltaFundingRate: expect.any(String),
          lastCumulativePremiumFundingRate: expect.any(String),
          pnl: expect.any(String),
          deltaFundingAccrued: expect.any(String),
          premiumFundingAccrued: expect.any(String),
        })
      );
    },
    TIMEOUT
  );
})