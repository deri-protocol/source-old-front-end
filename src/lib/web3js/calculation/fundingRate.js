import { bg, getDailyBlockNumber } from '../utils';

export const calculateLiquidityUsed = (
  tradersNetVolume,
  price,
  multiplier,
  liquidity,
  poolMarginRatio
) => {
  return bg(
    ((tradersNetVolume * price * multiplier) / liquidity) * poolMarginRatio
  ).abs();
}

export const calculateFundingRate = (
  tradersNetVolume,
  price,
  multiplier,
  liquidity,
  fundingRateCoefficient
) => {
  return ((tradersNetVolume * price * multiplier) / liquidity) *
  fundingRateCoefficient;
}

export const processFundingRate = (chainId, fundingRate) => {
  const annualBlockCount = getDailyBlockNumber(chainId);
  //console.log(annualBlockCount);
  return bg(fundingRate).times(annualBlockCount);
};
