import { perpetualPoolLiteFactory } from '../factory';
import { CHAIN_ID, POOL_V2L_ADDRESS, TIMEOUT } from '../../shared/__test__/setup';
import { bg } from '../../shared/utils';

describe('PerpetualPool', () => {
  let perpetualPool
  beforeAll(() => {
    perpetualPool =  perpetualPoolLiteFactory(CHAIN_ID, POOL_V2L_ADDRESS)
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
    const res = await perpetualPool.getSymbol('0')
    expect(res).toHaveProperty('price')
    expect(res).toHaveProperty('symbol')
    expect(res).toHaveProperty('feeRatio')
    expect(res).toHaveProperty('cumulativeFundingRate')
    expect(res).toHaveProperty('fundingRateCoefficient')
    expect(res).toHaveProperty('multiplier')
    expect(res).toHaveProperty('oracleAddress')
    expect(res).toHaveProperty('tradersNetVolume')
    expect(res).toHaveProperty('tradersNetCost')
    expect(bg(res.price).toNumber()).toBeGreaterThanOrEqual(30000)
    expect(bg(res.tradersNetVolume).toNumber()).toBeGreaterThanOrEqual(0)
    expect(bg(res.tradersNetVolume).toNumber()).toBeLessThanOrEqual(100000)
  }, TIMEOUT)

  it('getProtocolFeeAccrued()', async() => {
    const output = 200
    expect(bg(await perpetualPool.getProtocolFeeAccrued()).toNumber()).toBeGreaterThanOrEqual(output)
  }, TIMEOUT)

  it('getLiquidity()', async() => {
    const output = 200000
    expect(bg(await perpetualPool.getLiquidity()).toNumber()).toBeGreaterThanOrEqual(output)
  }, TIMEOUT)
})
