import {
  calculateEntryPrice,
  calculatePnl,
  calculateMaxWithdrawMargin,
} from '../calculation';
import { bg } from '../utils';
import fetch from 'node-fetch'
global.fetch = fetch

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
})