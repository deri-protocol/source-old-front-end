import { perpetualPoolLiteFactory } from '../../factory';
import { CHAIN_ID, POOL_ADDRESS_LITE, TIMEOUT } from '../setup';
import { bg } from '../../utils';

describe('PerpetualPool', () => {
  let perpetualPool
  beforeAll(() => {
    perpetualPool =  perpetualPoolLiteFactory(CHAIN_ID, POOL_ADDRESS_LITE)
  })

  it('getParameters()', async() => {
    const output = {
      minPoolMarginRatio: bg('1'),
      minInitialMarginRatio: bg('0.1'),
      minMaintenanceMarginRatio: bg('0.05'),
      minLiquidationReward: bg('10'),
      maxLiquidationReward: bg('1000'),
      liquidationCutRatio: bg('0.5'),
      protocolFeeCollectRatio: bg('0.2'),
    }
    expect(await perpetualPool.getParameters()).toEqual(output)
  }, TIMEOUT)

  it('getSymbol()', async() => {
    const output = {
      symbol: 'BTCUSD',
      oracleAddress: '0x78Db6d02EE87260a5D825B31616B5C29f927E430',
      multiplier: bg('0.0001'),
      feeRatio: bg('0.001'),
      fundingRateCoefficient: bg('0.00005'),
      price: bg('34299.81'),
      cumulativeFundingRate: bg('1.073406984697133649'),
      tradersNetVolume: bg('23'),
      tradersNetCost: bg('78.889563'),
    }
    expect(await perpetualPool.getSymbol('0')).toEqual(output)
  }, TIMEOUT)

  it('getProtocolFeeAccrued()', async() => {
    expect((await perpetualPool.getProtocolFeeAccrued()).toString()).toEqual('6.4969760876')
  }, TIMEOUT)

  it('getLiquidity()', async() => {
    expect((await perpetualPool.getLiquidity()).toString()).toEqual('69482.233475609474967096')
  }, TIMEOUT)
})
