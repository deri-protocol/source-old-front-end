import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { getEstimatedLiquidityUsed, getEstimatedMargin, getLiquidityUsed, getPositionInfo, getSpecification } from "../api/trade_query_api"

describe('trade query api', () => {
  it(
    'getSpecification',
    async () => {
      const res = await getSpecification(CHAIN_ID, OPTION_POOL_ADDRESS, '0');
      expect(res).toEqual({
        bTokenSymbol: 'USDT',
        feeRatio: '0.005',
        initialMarginRatio: '0.1',
        liquidationCutRatio: '0.5',
        maintenanceMarginRatio: '0.05',
        maxLiquidationReward: '1000',
        minLiquidationReward: '10',
        minPoolMarginRatio: '1',
        multiplier: '0.01',
        protocolFeeCollectRatio: '0.2',
        symbol: 'BTCUSD-20000-C',
      });
    },
    TIMEOUT
  );
  it(
    'getPositionInfo',
    async () => {
      const res = await getPositionInfo(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '0');
      expect(res).toEqual({});
    },
    TIMEOUT
  );
  it(
    'getEstimateMargin',
    async () => {
      const res = await getEstimatedMargin(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '5', '3', '0');
      expect(res).toEqual({});
    },
    TIMEOUT
  );
  it(
    'getLiquidityUsed',
    async () => {
      const res = await getLiquidityUsed(CHAIN_ID, OPTION_POOL_ADDRESS, '0');
      expect(res).toEqual({});
    },
    TIMEOUT
  );
  it(
    'getEstimateLiquidityUsed',
    async () => {
      const res = await getEstimatedLiquidityUsed(CHAIN_ID, OPTION_POOL_ADDRESS, '3', '0');
      expect(res).toEqual({});
    },
    TIMEOUT
  );
})