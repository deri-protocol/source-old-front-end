import { bg, max, min } from '../utils';

export * from './fundingRate';

export const calculateShareValue = (lTokenTotalSupply, liquidity) =>
  lTokenTotalSupply.eq(0) ? bg(0) : liquidity.div(lTokenTotalSupply);
export const calculateMaxRemovableShares = (
  lTokenBalance,
  lTokenTotalSupply,
  liquidity,
  tradersNetVolume,
  tradersNetCost,
  multiplier,
  minPoolMarginRatio,
  price
) => {
  const shareValue = calculateShareValue(lTokenTotalSupply, liquidity);
  const value = tradersNetVolume.times(price).times(multiplier);
  const removable = liquidity
    .plus(tradersNetCost)
    .minus(value)
    .minus(value.abs().times(minPoolMarginRatio));
  const shares = max(min(lTokenBalance, removable.div(shareValue)), bg(0));
  return shares;
};

export const calculateEntryPrice = (volume, cost, multiplier) =>
  volume.eq(0) ? bg(0) : cost.div(volume).div(multiplier);

export const calculateMarginHeld = (
  price,
  volume,
  multiplier,
  minInitialMarginRatio
) => volume.abs().times(price).times(multiplier).times(minInitialMarginRatio);

export const calculatePnl = (price, volume, multiplier, cost) =>
  volume.times(price).times(multiplier).minus(cost);

export const calculateMaxWithdrawMargin = (
  price,
  volume,
  margin,
  cost,
  multiplier,
  minInitialMarginRatio
) => {
  if (volume.eq(0)) {
    return margin;
  }
  const held = calculateMarginHeld(
    price,
    volume,
    multiplier,
    minInitialMarginRatio
  );
  const pnl = calculatePnl(price, volume, multiplier, cost);
  const withdrawable = max(margin.plus(pnl).minus(held.times(1.02)), bg(0));
  return withdrawable;
};

export const calculateLiquidationPrice = (
  volume,
  margin,
  cost,
  multiplier,
  minMaintenanceMarginRatio
) => {
  const tmp = cost.minus(margin).div(volume).div(multiplier);
  let res = volume.gt(0)
    ? tmp.div(bg(1).minus(minMaintenanceMarginRatio))
    : tmp.div(bg(1).plus(minMaintenanceMarginRatio));
  res = max(res, bg(0));
  return res;
};

export const isOrderValid = (
  price,
  margin,
  volume,
  liquidity,
  tradersNetVolume,
  multiplier,
  minPoolMarginRatio,
  minInitialMarginRatio,
  newVolume,
  amount
) => {
  const minMargin = volume
    .plus(newVolume)
    .abs()
    .times(price)
    .times(multiplier)
    .times(minInitialMarginRatio);
  const poolMaxVolume = liquidity
    .div(minPoolMarginRatio)
    .div(price)
    .div(multiplier);
  if (margin.plus(amount).gte(minMargin)) {
    if (
      newVolume.lte(poolMaxVolume.minus(tradersNetVolume)) &&
      newVolume.gte(poolMaxVolume.negated().minus(tradersNetVolume))
    ) {
      return { success: true };
    }
    return { success: false, message: 'Pool insufficient liquidity' };
  }
  return { success: false, message: 'Trader insufficient margin' };
};
