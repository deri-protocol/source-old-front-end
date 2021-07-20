// v2
export {
  getLiquidityInfo,
  getPoolLiquidity,
  getPoolInfoApy,
} from './v2/mining_query_api'

export {
  addLiquidity,
  removeLiquidity,
  addLiquidityWithPrices,
  removeLiquidityWithPrices,
} from './v2/mining_transaction_api'

export {
  getSpecification,
  getPositionInfo,
  isUnlocked,
  getWalletBalance,
  getEstimatedFee,
  getEstimatedMargin,
  getFundingRate,
  getEstimatedFundingRate,
  getLiquidityUsed,
  getEstimatedLiquidityUsed,
  getFundingRateCache,
  getPoolBTokensBySymbolId,
  getFundingFee,
} from './v2/trade_query_api';

export {
  unlock,
  depositMargin,
  withdrawMargin,
  tradeWithMargin,
  closePosition,
  depositMarginWithPrices,
  withdrawMarginWithPrices,
  tradeWithMarginWithPrices,
  closePositionWithPrices,
} from './v2/trade_transaction_api';

// v2 lite
export {
  getLiquidityInfo as getLiquidityInfoV2l,
  getPoolLiquidity as getPoolLiquidityV2l,
  getPoolInfoApy as getPoolInfoApyV2l,
} from './v2_lite/mining_query_api'

export {
  addLiquidity as addLiquidityV2l,
  removeLiquidity as removeLiquidityV2l,
} from './v2_lite/mining_transaction_api'

export {
  getSpecification as getSpecificationV2l,
  getPositionInfo as getPositionInfoV2l,
  isUnlocked as isUnlockedV2l,
  getWalletBalance as getWalletBalanceV2l,
  getEstimatedFee as getEstimatedFeeV2l,
  getEstimatedMargin as getEstimatedMarginV2l,
  getFundingRate as getFundingRateV2l,
  getEstimatedFundingRate as getEstimatedFundingRateV2l,
  getLiquidityUsed as getLiquidityUsedV2l,
  getEstimatedLiquidityUsed as getEstimatedLiquidityUsedV2l,
  getFundingRateCache as getFundingRateCacheV2l,
  // getPoolBTokensBySymbolId ,
  // getFundingFee,
} from './v2_lite/trade_query_api';

export {
  unlock as unlockV2l,
  depositMargin as depositMarginV2l,
  withdrawMargin as withdrawMarginV2l,
  tradeWithMargin as tradeWithMarginV2l,
  closePosition as closePositionV2l,
} from './v2_lite/trade_transaction_api';

export {
  getTradeHistory
} from './trade_history_api';

export {
  setBroker
} from './broker_api'

export {
  airdropPToken,
  isUserPTokenExist,
  getAirdropPTokenWhitelistCount,
} from './activity_api'