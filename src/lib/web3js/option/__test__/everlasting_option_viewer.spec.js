import { getPoolLiteViewerConfig, bg } from "../../shared"
import { ACCOUNT_ADDRESS, CHAIN_ID, MIN_NUMBER, OPTION_POOL_ADDRESS, OPTION_PTOKEN_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { everlastingOptionViewerFactory } from "../factory"

describe('EverlastingOptionViewer', () => {
  let everlastingOptionViewer
  beforeAll(() => {
    const viewAddress = getPoolLiteViewerConfig(CHAIN_ID, 'option')
    console.log('viewAddress',viewAddress)
    everlastingOptionViewer = everlastingOptionViewerFactory(CHAIN_ID, viewAddress )
  })
  it(
    'getPoolState',
    async () => {
      const res = await everlastingOptionViewer.getPoolState(
        OPTION_POOL_ADDRESS
      );
      expect(res).toEqual(
        expect.objectContaining({
          bToken: '0x4405F3131E2659120E4F931146f032B4c05314E2',
          curTimestamp: expect.any(String),
          initialMarginRatio: '100000000000000000',
          lToken: '0xc14097dBfC37719dB731F8532AA3F4D0fd305262',
          liquidationCutRatio: '500000000000000000',
          liquidatorQualifier: '0x0000000000000000000000000000000000000000',
          liquidity: expect.any(String),
          maintenanceMarginRatio: '50000000000000000',
          maxLiquidationReward: '1000000000000000000000',
          minLiquidationReward: '10000000000000000000',
          minPoolMarginRatio: '1000000000000000000',
          pToken: '0x980a0B311e2B8D20557E3CA1C6d981Fd77520bC0',
          pool: '0x0ee8b0133135268bEc201D8d7752B2f90E5a6c92',
          preTimestamp: expect.any(String),
          premiumFundingCoefficient: expect.any(String),
          premiumFundingPeriod: expect.any(String),
          protocolFeeAccrued: expect.any(String),
          protocolFeeCollectRatio: '200000000000000000',
          protocolFeeCollector: '0x4aF582Fd437f997F08df645aB6b0c070CC791DeE',
          totalAbsCost: expect.any(String),
          totalDynamicEquity: expect.any(String),
        })
      );
    },
    TIMEOUT
  );
  it('getSymbols', async() => {
    const res = await everlastingOptionViewer.getSymbols(OPTION_POOL_ADDRESS)
    expect(res.length).toEqual(12);
    expect(res[0]).toEqual(
      expect.objectContaining({
        K: '0.9',
        cumulativeDeltaFundingRate: expect.any(String),
        cumulativePremiumFundingRate: expect.any(String),
        diseqFundingCoefficient: '0.000005',
        feeRatio: '0.005',
        intrinsicValue: expect.any(String),
        isCall: true,
        multiplier: '0.01',
        oracleAddress: '0x78Db6d02EE87260a5D825B31616B5C29f927E430',
        quote_balance_offset: expect.any(String),
        strikePrice: '20000',
        symbol: 'BTCUSD-20000-C',
        symbolId: '0',
        timeValue: expect.any(String),
        tradersNetCost: expect.any(String),
        tradersNetVolume: expect.any(String),
        volatilityAddress: '0x2480C977c737a9057d8DA9ef3A91d3b66E093c7d',
      })
    );
  }, TIMEOUT)
  it('getMarginStatusForTrader', async() => {
    const res = await everlastingOptionViewer.getMarginStatusForTrader(
      OPTION_POOL_ADDRESS,
      ACCOUNT_ADDRESS
    );
    expect(res).toEqual(
      expect.objectContaining({
        dynamicMargin: expect.any(String),
        initialMargin: expect.any(String),
        maintenanceMargin: expect.any(String),
      })
    );
    expect(bg(res.dynamicMargin).toNumber()).toBeGreaterThanOrEqual(0.01);
  }, TIMEOUT)
  it('getTraderPorfolio', async() => {
    const res = await everlastingOptionViewer.getTraderPorfolio(OPTION_PTOKEN_ADDRESS, ACCOUNT_ADDRESS)
    expect(res).toEqual(expect.objectContaining({
      margin: expect.any(String),
      positions: expect.any(Array),
    }))
    expect(bg(res.margin).toNumber()).toBeGreaterThanOrEqual(MIN_NUMBER)
    expect(res.positions.length).toBeGreaterThanOrEqual(12)
  }, TIMEOUT)
})