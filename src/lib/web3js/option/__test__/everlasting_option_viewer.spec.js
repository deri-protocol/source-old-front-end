import { getPoolLiteViewerConfig } from "../../shared"
import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { everlastingOptionViewerFactory } from "../factory"

describe('EverlastingOptionViewer', () => {
  let everlastingOptionViewer
  beforeAll(() => {
    const viewAddress = getPoolLiteViewerConfig(CHAIN_ID, 'option')
    everlastingOptionViewer = everlastingOptionViewerFactory(CHAIN_ID, viewAddress )
  })
  it(
    'getPoolStates',
    async () => {
      const res = await everlastingOptionViewer.getPoolStates(
        OPTION_POOL_ADDRESS,
       [] 
      );
      res.symbolState.forEach((s) => console.log(s))
      expect(res.poolState).toEqual(
        expect.objectContaining({
          curTimestamp: expect.any(String),
          initialMarginRatio: '0.1',
          liquidity: expect.any(String),
          maintenanceMarginRatio: '0.05',
          pToken: '0x7484e22022C971e314A00e0dfbfCDe8E223c80aC',
          pool: '0x98EfC36182eEC80eC20F600533E87f82AeDbb2e6',
          preTimestamp: expect.any(String),
          premiumFundingCoefficient: expect.any(String),
          premiumFundingPeriod: expect.any(String),
          totalDynamicEquity: expect.any(String),
          totalInitialMargin: expect.any(String),
        })
      );
      expect(res.symbolState[0]).toEqual(
        expect.objectContaining({
          K: '0.9',
          cumulativeDeltaFundingRate: expect.any(String),
          cumulativePremiumFundingRate: expect.any(String),
          delta: expect.any(String),
          deltaFundingCoefficient: expect.any(String),
          deltaFundingPerSecond: expect.any(String),
          dynamicMarginRatio: expect.any(String),
          intrinsicValue: expect.any(String),
          isCall: true,
          multiplier: '0.01',
          oracleAddress: '0x18C036Ee25E205c224bD78f10aaf78715a2B6Ff1',
          oraclePrice: expect.any(String),
          premiumFundingPerSecond: expect.any(String),
          quoteBalanceOffset: expect.any(String),
          strikePrice: '20000',
          symbol: 'BTCUSD-20000-C',
          symbolId: '0',
          timePrice: expect.any(String),
          timeValue: expect.any(String),
          tradersNetCost: expect.any(String),
          tradersNetVolume: expect.any(String),
          volatilityAddress: '0x7A4701A1A93BB7692351aEBcD4F5Fab1d4377BBc',
        })
      );
    },
    TIMEOUT
  );
  it(
    'getTraderStates',
    async () => {
      const res = await everlastingOptionViewer.getTraderStates(
        OPTION_POOL_ADDRESS,
        ACCOUNT_ADDRESS,
       [] 
      );
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
  // it('getMarginStatusForTrader', async() => {
  //   const res = await everlastingOptionViewer.getMarginStatusForTrader(
  //     OPTION_POOL_ADDRESS,
  //     ACCOUNT_ADDRESS
  //   );
  //   expect(res).toEqual(
  //     expect.objectContaining({
  //       dynamicMargin: expect.any(String),
  //       initialMargin: expect.any(String),
  //       maintenanceMargin: expect.any(String),
  //     })
  //   );
  //   expect(bg(res.dynamicMargin).toNumber()).toBeGreaterThanOrEqual(0.01);
  // }, TIMEOUT)
})