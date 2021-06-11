import { bg } from '../utils'
import {
  PerpetualPool,
} from '../contract/perpetual_pool'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('PerpetualPool', () => {
  let perpetualPool
  beforeAll(() => {
    perpetualPool = new PerpetualPool('97', '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5', true)
  })
  test('getLengths()', async() => {
    const output = 10 
    await perpetualPool.getLengths()
    expect(perpetualPool.bTokenLength).toEqual(output)
    expect(perpetualPool.symbolLength).toEqual(output)
  }, TIMEOUT)
  test('getAddresses()', async() => {
    const output = {
      lTokenAddress: '0x61162b0c9665Ce27a53b59E79C1B7A929cc3bB57',
      pTokenAddress: '0xeBA1c76F7A773B8210130f068798839F84392241',
      routerAddress: '0xaDEe3A9149ee1FBa712aB081c5A6067D613571C1',
      protocolFeeCollector: '0x4C059dD7b01AAECDaA3d2cAf4478f17b9c690080',
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
      minLiquidationReward: bg('10'),
      maxLiquidationReward: bg('200'),
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
      bTokenAddress: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
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
      oracleAddress: '0x3050D5360382B7f1dbe6895Dd5645a9cf38F14f0',
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
})