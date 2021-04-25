import { bg, getAnnualBlockNumber } from '../utils';

export const calculateLiquidityUsed = (
  tradersNetVolume,
  price,
  multiplier,
  liquidity,
  poolMarginRatio
) =>
  bg(
    ((tradersNetVolume * price * multiplier) / liquidity) * poolMarginRatio
  ).abs();

export const calculateFundingRate = (
  tradersNetVolume,
  price,
  multiplier,
  liquidity,
  fundingRateCoefficient
) =>
  ((tradersNetVolume * price * multiplier) / liquidity) *
  fundingRateCoefficient;

export const processFundingRate = (chainId, fundingRate) => {
  const annualBlockCount = getAnnualBlockNumber(chainId);
  console.log(annualBlockCount);
  const res = bg(fundingRate).times(annualBlockCount);
  // if (chainId === "1") {
  //   res = bg(fundingRate).times(2367422);
  // } else if (chainId === "56") {
  //   res = bg(fundingRate).times(10497304);
  // } else if (chainId === "128") {
  //   res = bg(fundingRate).times(10511369);
  // } else if (chainId === "3") {
  //   res = bg(fundingRate).times(2367422);
  // } else if (chainId === "97") {
  //   res = bg(fundingRate).times(10497304);
  // } else if (chainId === "256") {
  //   res = bg(fundingRate).times(10511369);
  // }
  return res;
};
