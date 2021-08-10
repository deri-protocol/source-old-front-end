import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { bg } from '../../shared';
import { getEstimatedFee, getEstimatedFundingRate, getEstimatedLiquidityUsed, getEstimatedMargin, getFundingRate, getLiquidityUsed, getPositionInfo, getSpecification } from "../api/trade_query_api"

describe('trade query api', () => {
  it(
    'getSpecification',
    async () => {
      const res = await getSpecification(CHAIN_ID, OPTION_POOL_ADDRESS, '0');
      expect(res).toEqual({
        bTokenSymbol: 'USDT',
        feeRatio: '0.005',
        initialMarginRatioOrigin: '0.1',
        initialMarginRatio: '0.1',
        liquidationCutRatio: '0.5',
        maintenanceMarginRatioOrigin: '0.05',
        maintenanceMarginRatio: '0.05',
        maxLiquidationReward: '1000',
        minLiquidationReward: '10',
        multiplier: '0.01',
        protocolFeeCollectRatio: '0.2',
        deltaFundingCoefficient: '0.000005',
        symbol: 'BTCUSD-20000-C',
      });
    },
    TIMEOUT
  );
  it(
    'getPositionInfo',
    async () => {
      const res = await getPositionInfo(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '0');
      expect(res).toEqual(
        expect.objectContaining({
          averageEntryPrice:  expect.any(String),
          deltaFundingAccrued:  expect.any(String),
          liquidationPrice: '',
          margin:  expect.any(String),
          marginHeld:  expect.any(String),
          marginHeldBySymbol:  expect.any(String),
          premiumFundingAccrued:  expect.any(String),
          price:  expect.any(String),
          unrealizedPnl: expect.any(String),
          unrealizedPnlList: expect.any(Array),
          volume: expect.any(String)
        })
      );
      expect(bg(res.margin).toNumber()).toBeGreaterThanOrEqual(1)
      expect(bg(res.averageEntryPrice).toNumber()).toBeGreaterThanOrEqual(15000)
      expect(bg(res.price).toNumber()).toBeGreaterThanOrEqual(30000)
    },
    TIMEOUT
  );
  it(
    'getEstimateMargin',
    async () => {
      const res = await getEstimatedMargin(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '5', '3', '0');
      expect(bg(res).toNumber()).toBeGreaterThanOrEqual(190);
    },
    TIMEOUT
  );
  it(
    'getFundingRate',
    async () => {
      const res = await getFundingRate(CHAIN_ID, OPTION_POOL_ADDRESS, '0');
      expect(res).toEqual(
        expect.objectContaining({
          deltaFundingRate0: expect.any(String),
          deltaFundingRatePerSecond: expect.any(String),
          liquidity: expect.any(String),
          premiumFundingRate0:  expect.any(String),
          premiumFundingRatePerSecond: expect.any(String),
          tradersNetVolume:  expect.any(String),
        })
      );
      expect(bg(res.deltaFundingRate0).abs().toNumber()).toBeLessThanOrEqual(1000);
      expect(bg(res.liquidity).toNumber()).toBeGreaterThanOrEqual(1000);
    },
    TIMEOUT
  );
  it(
    'getEstimatedFundingRate',
    async () => {
      const res = await getEstimatedFundingRate(CHAIN_ID, OPTION_POOL_ADDRESS, '1', '0');
      expect(bg(res.deltaFundingRate1).abs().toNumber()).toBeLessThanOrEqual(1000)
    },
    TIMEOUT
  );
  it(
    'getLiquidityUsed',
    async () => {
      const res = await getLiquidityUsed(CHAIN_ID, OPTION_POOL_ADDRESS, '0');
      expect(bg(res.liquidityUsed0).toNumber()).toBeGreaterThanOrEqual(0)
      expect(bg(res.liquidityUsed0).toNumber()).toBeLessThanOrEqual(100)
    },
    TIMEOUT
  );
  it(
    'getEstimateLiquidityUsed',
    async () => {
      const res = await getEstimatedLiquidityUsed(CHAIN_ID, OPTION_POOL_ADDRESS, '3', '0');
      expect(bg(res.liquidityUsed1).toNumber()).toBeGreaterThanOrEqual(0)
      expect(bg(res.liquidityUsed1).toNumber()).toBeLessThanOrEqual(100)
    },
    TIMEOUT
  );
  it(
    'getEstimateFee',
    async () => {
      const res = await getEstimatedFee(CHAIN_ID, OPTION_POOL_ADDRESS, '3', '0');
      expect(bg(res).toNumber()).toBeGreaterThanOrEqual(0.01)
      expect(bg(res).toNumber()).toBeLessThanOrEqual(10)
    },
    TIMEOUT
  );
})