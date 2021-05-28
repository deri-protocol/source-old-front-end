import { bg } from '../utils'

export const calculateBTokenDynamicEquities = (bTokens) => {
  //const dynamicEquities = bTokens.map((b) => bg(b.liquidity).times(b.price).times(b.discount).plus(b.pnl))
  //const totalDynamicEquity = dynamicEquities.reduce((accum, d) => accum.plus(d), bg(0))
  const totalDynamicEquity = bTokens.reduce((accum, b) => accum.plus(bg(b.liquidity).times(b.price).times(b.discount).plus(b.pnl)), bg(0))
  return totalDynamicEquity
}

export const isBToken0RatioValid = (bTokens, bTokenId, newLiquidity, bToken0Ratio) => {
  const totalDynamicEquity = calculateBTokenDynamicEquities(bTokens)
  const b = bTokens[bTokenId]
  const dynamicEquity = bg(b.liquidity + newLiquidity).times(b.price).times(b.discount).plus(b.pnl)
  if (dynamicEquity.div(totalDynamicEquity).times('0.99').gt(bToken0Ratio)) {
    return { success: false, error: 'Trader insufficient bToken0' };
  } else {
    return { success: true }
  }
}