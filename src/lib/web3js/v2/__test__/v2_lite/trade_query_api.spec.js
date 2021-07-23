import {
  getFundingRate,
  getSpecification,
  getWalletBalance,
  isUnlocked,
  getEstimatedFundingRate,
  getLiquidityUsed,
  getEstimatedLiquidityUsed,
  getPositionInfo,
} from '../../api/v2_lite/trade_query_api';
import {
  ACCOUNT_ADDRESS,
  ACCOUNT2_ADDRESS,
  CHAIN_ID,
  POOL_ADDRESS_LITE,
  TIMEOUT,
} from '../setup';
import { DeriEnv } from '../../../config';

describe('trade_query_api', () => {
  it(
    'getSpecification',
    async () => {
      const output = {
        symbol: 'BTCUSD',
        bTokenSymbol: 'BUSD',
        multiplier: '0.0001',
        feeRatio: '0.001',
        fundingRateCoefficient: '0.00005',
        minPoolMarginRatio: '1',
        minInitialMarginRatio: '0.1',
        minMaintenanceMarginRatio: '0.05',
        minLiquidationReward: '10',
        maxLiquidationReward: '1000',
        liquidationCutRatio: '0.5',
        protocolFeeCollectRatio: '0.2',
      };
      expect(await getSpecification(CHAIN_ID, POOL_ADDRESS_LITE, '0')).toEqual(
        output
      );
    },
    TIMEOUT
  );
  it('getPositionInfo', async () => {
    const output = {};
    const res = await getPositionInfo(CHAIN_ID, POOL_ADDRESS_LITE, ACCOUNT_ADDRESS, '0')
    //const res = await getPositionInfo('137', '0xb144cCe7992f792a7C41C2a341878B28b8A11984', '0xFefC938c543751babc46cc1D662B982bd1636721', '0')
    expect(res).toEqual(output);
  });
  it(
    'getWalletBalance',
    async () => {
      const output = '39229.155962163085673733';
      expect(
        await getWalletBalance(CHAIN_ID, POOL_ADDRESS_LITE, ACCOUNT_ADDRESS)
      ).toEqual(output);
    },
    TIMEOUT
  );
  it(
    'isUnlocked',
    async () => {
      expect(
        await isUnlocked(CHAIN_ID, POOL_ADDRESS_LITE, ACCOUNT_ADDRESS)
      ).toEqual(true);
      expect(
        await isUnlocked(CHAIN_ID, POOL_ADDRESS_LITE, ACCOUNT2_ADDRESS)
      ).toEqual(false);
    },
    TIMEOUT
  );
  it(
    'getFundingRate',
    async () => {
      const output = {
        fundingRate0: '0.1585373310040846',
        fundingRatePerBlock: '0.000000055126162594',
        liquidity: '69482.233475609474967096',
        tradersNetVolume: '23',
        volume: '-',
      };
      expect(await getFundingRate(CHAIN_ID, POOL_ADDRESS_LITE, '0')).toEqual(
        output
      );
    },
    TIMEOUT
  );
  it(
    'getEstimatedFundingRate',
    async () => {
      const output = {
        fundingRate1: '0.1585373310040846',
      };
      expect(
        await getEstimatedFundingRate(CHAIN_ID, POOL_ADDRESS_LITE, '3', '0')
      ).toEqual(output);
    },
    TIMEOUT
  );
  it('getLiquidityUsed', async () => {
    const output = { liquidityUsed0: '0.163716438447436' };
    expect(await getLiquidityUsed(CHAIN_ID, POOL_ADDRESS_LITE, '0')).toEqual(
      output
    );
  });
  it('getEstimatedLiquidityUsed', async () => {
    const output = { liquidityUsed1: '0.163716438447436' };
    expect(
      await getEstimatedLiquidityUsed(CHAIN_ID, POOL_ADDRESS_LITE, '2', '0')
    ).toEqual(output);
  });
});
