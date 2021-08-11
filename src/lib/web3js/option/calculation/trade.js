import { bg, max } from "../../shared"

export const dynamicInitialMarginRatio = (spot, strike, isCall, initialMarginRatio) => {
  if ((bg(strike).gte(spot) && !isCall) || (bg(strike).lte(spot) && isCall)) {
    return initialMarginRatio
  } else {
    const otmRatio = isCall ? bg(strike).minus(spot).div(strike) : bg(spot).minus(strike).div(strike)
    return max((bg(1).minus(otmRatio.times(3))).times(initialMarginRatio), bg(0.01))
  }
}

export const dynamicInitialPoolMarginRatio = (spot, strike, isCall, initialMarginRatio) => {
  // for pool
  const initialPoolMarginRatio = bg(initialMarginRatio).times(10)
  if ((bg(strike).gte(spot) && !isCall) || (bg(strike).lte(spot) && isCall)) {
    return initialMarginRatio
  } else {
    const otmRatio = isCall ? bg(strike).minus(spot).div(strike) : bg(spot).minus(strike).div(strike)
    return max((bg(1).minus(otmRatio.times(3))).times(initialPoolMarginRatio), bg(0.01).times(10))
  }
}

export const getDeltaFundingRatePerSecond = (symbol, delta, price, totalDynamicEquity)  => {
  return bg(totalDynamicEquity).eq(0)
    ? bg(0)
    : bg(delta)
        .times(symbol.tradersNetVolume)
        .times(price)
        .times(price)
        .times(symbol.multiplier)
        .times(symbol.multiplier)
        .times(symbol.deltaFundingCoefficient)
        .div(totalDynamicEquity);
} 
export const getPremiumFundingRate = (symbol, premiumFundingCoefficient, totalDynamicEquity)  => {
  return bg(totalDynamicEquity).eq(0)
    ? bg(0)
    : bg(symbol.timeValue)
        .times(symbol.multiplier)
        .times(premiumFundingCoefficient)
        .div(totalDynamicEquity);
} 