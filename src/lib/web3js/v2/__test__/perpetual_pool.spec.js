import { bg } from '../utils'
import {
  PerpetualPool,
} from '../contract/perpetual_pool'
import {
  TIMEOUT,
  POOL_ADDRESS,
  LTOKEN_ADDRESS,
  PTOKEN_ADDRESS,
  ROUTER_ADDRESS,
  PROTOCOL_FEE_COLLECTOR,
  BTCUSD_ORACLE_ADDRESS,
  BTOKEN_ADDRESS,
} from './setup';

describe('PerpetualPool', () => {
  let perpetualPool
  beforeAll(() => {
    perpetualPool = new PerpetualPool('97', POOL_ADDRESS, true)
  })
  test('getLengths()', async() => {
    const output = 10 
    await perpetualPool.getLengths()
    expect(perpetualPool.bTokenCount).toEqual(output)
    expect(perpetualPool.symbolCount).toEqual(output)
  }, TIMEOUT)
  test('getAddresses()', async() => {
    const output = {
      lTokenAddress: LTOKEN_ADDRESS,
      pTokenAddress: PTOKEN_ADDRESS,
      routerAddress: ROUTER_ADDRESS,
      protocolFeeCollector: PROTOCOL_FEE_COLLECTOR,
    };
    await perpetualPool.getAddresses()
    expect(perpetualPool.lTokenAddress).toEqual(output.lTokenAddress)
    expect(perpetualPool.pTokenAddress).toEqual(output.pTokenAddress)
    expect(perpetualPool.routerAddress).toEqual(output.routerAddress)
    expect(perpetualPool.protocolFeeCollector).toEqual(output.protocolFeeCollector)
  }, TIMEOUT)
  test('getParameters()', async() => {
    const output = {
      decimals0: '18',
      minBToken0Ratio: bg(0.2),
      minPoolMarginRatio: bg(1),
      minInitialMarginRatio: bg(0.1),
      minMaintenanceMarginRatio: bg('0.05'),
      minLiquidationReward: bg('0'),
      maxLiquidationReward: bg('1000'),
      liquidationCutRatio: bg('0.5'),
      protocolFeeCollectRatio: bg(0.2),
    }
    const res = await perpetualPool.getParameters()
    expect(res).toEqual(output)
  }, TIMEOUT)
  test('getProtocolFeeAccrued()', async() => {
    const output = bg('0.56613448027')
    await perpetualPool.getProtocolFeeAccrued()
    expect(perpetualPool.protocolFeeAccrued).toEqual(output)
  }, TIMEOUT)
  test('getBToken()', async() => {
    const input = '0'
    const output = {
      bTokenAddress: BTOKEN_ADDRESS,
      swapperAddress: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
      oracleAddress: '0x0000000000000000000000000000000000000000',
      decimals: '18',
      discount: bg('1'),
      price: bg('1'),
      liquidity: bg('6009.99558635764855457'),
      pnl: bg('1652.829442776692341525'),
      cumulativePnl: bg('0.338632704460278345'),
    };
    expect(await perpetualPool.getBToken(input)).toEqual(output)
  }, TIMEOUT)
  test('getBTokenOracle()', async() => {
    const input = '0'
    const output = '0x0000000000000000000000000000000000000000'
    expect(await perpetualPool.getBTokenOracle(input)).toEqual(output)
  }, TIMEOUT)
  test('getSymbol()', async() => {
    const input = '0'
    const output = {
      symbol: 'BTCUSD',
      oracleAddress: BTCUSD_ORACLE_ADDRESS,
      multiplier: bg(0.0001),
      feeRatio: bg(0.0001),
      fundingRateCoefficient: bg(0.00001),
      price: bg(36379.845),
      cumulativeFundingRate: bg('0.379548594773587618'),
      tradersNetVolume: bg(123),
      tradersNetCost: bg(593.5695935),
    };
    expect(await perpetualPool.getSymbol(input)).toEqual(output)
  }, TIMEOUT)
  test('getSymbolOracle()', async() => {
    const input = '0'
    const output = '0x3050D5360382B7f1dbe6895Dd5645a9cf38F14f0'
    expect(await perpetualPool.getSymbolOracle(input)).toEqual(output)
  }, TIMEOUT)
  test('getLastUpdatedBlockNumber', async() => {
    const output = 10178982
    expect(await perpetualPool.getLastUpdatedBlockNumber()).toBeGreaterThanOrEqual(output)
  }, TIMEOUT)
  test('getLatestBlockNumber', async() => {
    const output = 10178982
    expect(await perpetualPool.getLatestBlockNumber()).toBeGreaterThan(output)
  }, TIMEOUT)
})