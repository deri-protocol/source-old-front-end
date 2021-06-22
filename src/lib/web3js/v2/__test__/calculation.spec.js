import {
  calculateEntryPrice,
  calculatePnl,
  calculateFundingRate,
  calculateLiquidityUsed,
  calculateBTokenDynamicEquities,
  isBToken0RatioValid,
  isPoolMarginRatioValid,
} from '../calculation';
import { bg } from '../utils';

describe('calculation', () => {
  // test('calculateFundingRatePerBlock', () => {
  //   // tradersNetVolume, price, multiplier, liquidity, fundingRateCoefficient
  //   const input = ['5614', '45255.73125', '0.0001', '1103999.944686340457836027', '0.0000025']
  //   const output = '5.7532990934542826e-8'
  //   expect(calculateFundingRate(...input).toString()).toEqual(output)
  //   const input2 = ['-5614', '45255.73125', '0.0001', '1103999.944686340457836027', '0.0000025']
  //   const output2 = '-5.7532990934542826e-8'
  //   expect(calculateFundingRate(...input2).toString()).toEqual(output2)
  // })
  // test('calculateFundingRate', () => {
  //   // tradersNetVolume, price, multiplier, liquidity, fundingRateCoefficient
  //   const input = ['5614', '45255.73125', '0.0001', '1103999.944686340457836027', '0.0000025']
  //   const input2 = '56'
  //   const output = '0.603941295869140145541104'
  //   expect(processFundingRate(input2, calculateFundingRate(...input)).toString()).toEqual(output)
  // })
  // test('calculateLiquidityUsed', () => {
  //   // tradersNetVolume, price, multiplier, liquidity, poolMarginRatio
  //   const input = ['5614', '45473.06', '0.0001', '1103999.944686340457836027', '1']
  //   const output = '0.023123711198421274'
  //   expect(calculateLiquidityUsed(...input).toString()).toEqual(output)
  //   const input2 = ['-5614', '45473.06', '0.0001', '1103999.944686340457836027', '1']
  //   const output2 = '0.023123711198421274'
  //   expect(calculateLiquidityUsed(...input2).toString()).toEqual(output2)
  // })

  // test('calculatePnl', () => {
  //   // price, volume, multiplier, cost
  //   const input = ['101.238659', bg('4'), '1', '402.629984']
  //   const output = '2.324652'
  //   expect(calculatePnl(...input).toString()).toEqual(output)
  //   const input2 = ['100.238659', bg('4'), '1', '402.629984']
  //   const output2 = '-1.675348'
  //   expect(calculatePnl(...input2).toString()).toEqual(output2)
  // })

  test('calculateEntryPrice', () => {
    // price, volume, multiplier, cost
    const input = [bg('7'), bg('12.3'), bg('0.0001')]
    const output = '17571.42857142857142'
    expect(calculateEntryPrice(...input).toString()).toEqual(output)
  })
  test('calculatePnl', () => {
    // price, volume, multiplier, cost
    const input = [bg('36.97'), bg('7'), bg('0.1'), bg('27.33')]
    const output = bg('-1.451')
    expect(calculatePnl(...input)).toEqual(output)
  })
  test('calculateFundingRate()', () => {
    // price, volume, multiplier, cost
    const input = ['36.97', '7000', '0.1', '1000', '0.0001']
    const output = bg('0.0025879')
    expect(calculateFundingRate(...input)).toEqual(output)

    function withInvalidArgs() {
      return calculateFundingRate('36.97', '7000', undefined, '1000', '0.0001')
    }
    expect(withInvalidArgs).toThrow(/invalid args/);
  })
  test('calculateLiquidityUsed', () => {
    // price, volume, multiplier, cost
    const input = ['29.99', '6999', '0.1', '1000', '0.1']
    const output = bg('2.0990001')
    expect(calculateLiquidityUsed(...input)).toEqual(output)
    const input2 = ['-29.99', '6999', '0.1', '1000', '0.1']
    const output2 = bg('2.0990001')
    expect(calculateLiquidityUsed(...input2)).toEqual(output2)
  })
  test('calculateBTokenDynamicEquities', () => {
    const input = [{
      liquidity: '976',
      price: '2345.67',
      discount: '1',
      pnl: '57',
    }, {
      liquidity: '501',
      price: '42395.89',
      discount: '0.8',
      pnl: '477',
    }]
    const output = bg('19282180.632')
    const totalDynamicEquity = calculateBTokenDynamicEquities(input)
    expect(totalDynamicEquity).toEqual(output)
  })
  test('isBToken0RatioValid', () => {
    const input = [{
      liquidity: '976',
      price: '2345.67',
      discount: '1',
      pnl: '57',
    }, {
      liquidity: '501',
      price: '22395.89',
      discount: '0.8',
      pnl: '477',
    }]
    const res = isBToken0RatioValid(input, '1', '10', '0.2')
    expect(res.success).toEqual(true)
    const input2 = [{
      liquidity: '976',
      price: '2345.67',
      discount: '1',
      pnl: '57',
    }, {
      liquidity: '501',
      price: '22395.89',
      discount: '0.8',
      pnl: '477',
    }]
    const res2 = isBToken0RatioValid(input2, '1', '11', '0.2')
    expect(res2.success).toEqual(false)
    const input3 = [{
      liquidity: '976',
      price: '2345.67',
      discount: '1',
      pnl: '57',
    }, {
      liquidity: '501',
      price: '22395.89',
      discount: '0.8',
      pnl: '477',
    }]
    const res3 = isBToken0RatioValid(input3, '0', '11', '0.2')
    expect(res3.success).toEqual(true)
  })
  test('isPoolMarginRatioValid', () => {
    const bTokens = [{
      liquidity: '16',
      price: '2345.67',
      discount: '1',
      pnl: '57',
    }, {
      liquidity: '16',
      price: '22395.89',
      discount: '0.8',
      pnl: '3215',
    }]
    const symbols = [{
      symbol: 'BTCUSD',
      multiplier: bg(0.0001),
      feeRatio: bg(0.0001),
      price: bg(36379.845),
      tradersNetVolume: bg(20313),
      tradersNetCost: bg(493.5695935),
    }, {
      symbol: 'IMEME',
      multiplier: bg(0.01),
      feeRatio: bg(0.0001),
      price: bg(60.845),
      tradersNetVolume: bg(832),
      tradersNetCost: bg(12.6741221),
    }]
    const res = isPoolMarginRatioValid(bTokens, '1', '10', '11', symbols, '1')
    expect(res.success).toEqual(true)
    const bTokens2 = [{
      liquidity: '16',
      price: '2345.67',
      discount: '1',
      pnl: '57',
    }, {
      liquidity: '16',
      price: '22395.89',
      discount: '0.8',
      pnl: '3215',
    }]
    const symbols2 = [{
      symbol: 'BTCUSD',
      multiplier: bg(0.0001),
      feeRatio: bg(0.0001),
      price: bg(36379.845),
      tradersNetVolume: bg(20313),
      tradersNetCost: bg(493.5695935),
    }, {
      symbol: 'IMEME',
      multiplier: bg(0.01),
      feeRatio: bg(0.0001),
      price: bg(60.845),
      tradersNetVolume: bg(832),
      tradersNetCost: bg(12.5741221),
    }]
    const res2 = isPoolMarginRatioValid(bTokens2, '1', '10', '11', symbols2, '1')
    expect(res2.success).toEqual(false)
  })
})
