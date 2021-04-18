import { bg, max, min } from "../utils";
export * from "./fundingRate";

export const calculateShareValue = (lTokenTotalSupply, liquidity) => {
  return lTokenTotalSupply.eq(0) ? bg(0) : liquidity.div(lTokenTotalSupply);
};
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
  let shareValue = calculateShareValue(lTokenTotalSupply, liquidity);
  let value = tradersNetVolume.times(price).times(multiplier);
  let removable = liquidity
    .plus(tradersNetCost)
    .minus(value)
    .minus(value.abs().times(minPoolMarginRatio));
  let shares = max(min(lTokenBalance, removable.div(shareValue)), bg(0));
  return shares;
};

export const calculateEntryPrice = (volume, cost, multiplier) => {
  return volume.eq(0) ? bg(0) : cost.div(volume).div(multiplier);
};

export const calculateMarginHeld = (
  price,
  volume,
  multiplier,
  minInitialMarginRatio
) => {
  return volume
    .abs()
    .times(price)
    .times(multiplier)
    .times(minInitialMarginRatio);
};

export const calculatePnl = (price, volume, multiplier, cost) => {
  return volume.times(price).times(multiplier).minus(cost);
};

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
  } else {
    let held = calculateMarginHeld(
      price,
      volume,
      multiplier,
      minInitialMarginRatio
    );
    let pnl = calculatePnl(price, volume, multiplier, cost);
    let withdrawable = max(margin.plus(pnl).minus(held.times(1.02)), bg(0));
    return withdrawable;
  }
};

export const calculateLiquidationPrice = (
  volume,
  margin,
  cost,
  multiplier,
  minMaintenanceMarginRatio
) => {
  let tmp = cost.minus(margin).div(volume).div(multiplier);
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
   let minMargin = volume
     .plus(newVolume)
     .abs()
     .times(price)
     .times(multiplier)
     .times(minInitialMarginRatio);
   let poolMaxVolume = liquidity
     .div(minPoolMarginRatio)
     .div(price)
     .div(multiplier);
   if (margin.plus(amount).gte(minMargin)) {
     if (
       newVolume.lte(poolMaxVolume.minus(tradersNetVolume)) &&
       newVolume.gte(poolMaxVolume.negated().minus(tradersNetVolume))
     ) {
       return { success: true };
     } else {
       return { success: false, message: "Pool insufficient liquidity" };
     }
   } else {
     return { success: false, message: "Trader insufficient margin" };
   }
 };