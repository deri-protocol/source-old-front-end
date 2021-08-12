import { ACCOUNT_ADDRESS, CHAIN_ID, MID_NUMBER, MIN_NUMBER, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { bg } from '../../shared';
import { getEstimatedFee, getEstimatedFundingRate, getEstimatedLiquidityUsed, getEstimatedMargin, getEstimatedTimePrice, getFundingRate, getLiquidityUsed, getPositionInfo, getSpecification } from "../api/trade_query_api"

describe('trade query api', () => {
  it(
    'getSpecification',
    async () => {
      const res = await getSpecification(CHAIN_ID, OPTION_POOL_ADDRESS, '0');
      expect(res).toEqual({
        bTokenSymbol: 'BUSD',
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
        isCall: true,
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
      expect(bg(res.margin).toNumber()).toBeGreaterThanOrEqual(0)
      expect(bg(res.averageEntryPrice).toNumber()).toBeGreaterThanOrEqual(0)
      expect(bg(res.price).toNumber()).toBeGreaterThanOrEqual(30000)
      expect(res.isCall).toEqual(true)
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
          deltaFunding0: expect.any(String),
          deltaFundingPerSecond: expect.any(String),
          liquidity: expect.any(String),
          premiumFunding0:  expect.any(String),
          premiumFundingPerSecond: expect.any(String),
          tradersNetVolume:  expect.any(String),
          volume: '-',
        })
      );
      expect(bg(res.deltaFunding0).abs().toNumber()).toBeLessThanOrEqual(1000);
      expect(bg(res.tradersNetVolume).abs().toNumber()).toBeLessThanOrEqual(100000);
      expect(bg(res.liquidity).toNumber()).toBeGreaterThanOrEqual(1000);
      //expect(res).toEqual({});
    },
    TIMEOUT
  );
  it(
    'getEstimatedFundingRate',
    async () => {
      const res = await getEstimatedFundingRate(CHAIN_ID, OPTION_POOL_ADDRESS, '-61', '0');
      expect(bg(res.deltaFunding1).abs().toNumber()).toBeGreaterThanOrEqual(0)
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
  it(
    'getEstimateTimePrice',
    async () => {
      const res = await getEstimatedTimePrice(CHAIN_ID, OPTION_POOL_ADDRESS, '2', '0');
      expect(bg(res).toNumber()).toBeGreaterThanOrEqual(MIN_NUMBER)
      expect(bg(res).toNumber()).toBeLessThanOrEqual(10)
    },
    TIMEOUT
  );
})