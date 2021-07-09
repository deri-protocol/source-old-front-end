import {
  getPositionInfo as getPositionInfo2,
  isUnlocked as isUnlocked2,
  isDeriUnlocked,
  getEstimatedMargin as getEstimatedMargin2,
  getEstimatedFee as getEstimatedFee2,
  getEstimatedFundingRate as getEstimatedFundingRate2,
  getEstimatedLiquidityUsed as getEstimatedLiquidityUsed2,
  getWalletBalance as getWalletBalance2,
} from '../api/contractQueryApi'

import {
  getSpecification2,
  getFundingRate2,
  getLiquidityUsed2,
  getFundingRateCache2,
} from '../api/restApi'
//import { bTokenFactory } from '../factory/contracts'

import {
  getPositionInfo as getPositionInfoV2,
  isUnlocked as isUnlockedV2,
  getEstimatedMargin as getEstimatedMarginV2,
  getEstimatedFee as getEstimatedFeeV2,
  getEstimatedFundingRate as getEstimatedFundingRateV2,
  getEstimatedLiquidityUsed as getEstimatedLiquidityUsedV2,
  getSpecification as getSpecificationV2,
  getWalletBalance as getWalletBalanceV2,
  getFundingRate as getFundingRateV2,
  getLiquidityUsed as getLiquidityUsedV2,
  getFundingRateCache as getFundingRateCacheV2,

  getPositionInfoV2l,
  isUnlockedV2l,
  getEstimatedMarginV2l,
  getEstimatedFeeV2l,
  getEstimatedFundingRateV2l,
  getEstimatedLiquidityUsedV2l,
  getSpecificationV2l,
  getWalletBalanceV2l,
  getFundingRateV2l,
  getLiquidityUsedV2l,
  getFundingRateCacheV2l,

  getPoolVersion,
} from '../v2'


export const getSpecification = async (
  chainId,
  poolAddress,
  bTokenId,
  symbolId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getSpecificationV2l(chainId, poolAddress, symbolId)
  }
  if (symbolId === undefined) {
    return getSpecification2(chainId, poolAddress)
  } else {
    return getSpecificationV2(chainId, poolAddress, bTokenId, symbolId)
  }
}

export const getPositionInfo = async (chainId, poolAddress, accountAddress, symbolId) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getPositionInfoV2l(chainId, poolAddress, symbolId)
  }
  if (symbolId === undefined) {
    return getPositionInfo2(chainId, poolAddress, accountAddress)
  } else {
    return getPositionInfoV2(chainId, poolAddress, accountAddress, symbolId)
  }
}
export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getWalletBalanceV2l(chainId, poolAddress, accountAddress)
  }
  if (bTokenId === undefined) {
    return getWalletBalance2(chainId, poolAddress, accountAddress)
  } else {
    return getWalletBalanceV2(chainId, poolAddress, accountAddress, bTokenId)
  }
}

export const isUnlocked = async (chainId, poolAddress, accountAddress, bTokenId) => { 
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return isUnlockedV2l(chainId, poolAddress, accountAddress)
  }
  if (accountAddress === undefined) {
    return isDeriUnlocked(chainId, poolAddress)
  } else if (bTokenId === undefined) {
    return isUnlocked2(chainId, poolAddress, accountAddress)
  } else {
    return isUnlockedV2(chainId, poolAddress, accountAddress, bTokenId)
  }
}

export const getEstimatedFee = async (chainId, poolAddress, volume, symbolId) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getEstimatedFeeV2l(chainId, poolAddress, volume, symbolId)
  }
  if (symbolId === undefined) {
    return getEstimatedFee2(chainId, poolAddress, volume)
  } else {
    return getEstimatedFeeV2(chainId, poolAddress, volume, symbolId)
  }
}

export const getEstimatedMargin = async(
  chainId,
  poolAddress,
  accountAddress,
  volume,
  leverage,
  symbolId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getEstimatedMarginV2l(chainId, poolAddress, accountAddress, volume, leverage, symbolId)
  }
  if (symbolId === undefined) {
    return getEstimatedMargin2(chainId, poolAddress, accountAddress, volume, leverage)
  } else {
    return getEstimatedMarginV2(chainId, poolAddress, accountAddress, volume, leverage, symbolId)
  }
}

export const getFundingRate = async (chainId, poolAddress, symbolId) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getFundingRateV2l(chainId, poolAddress, symbolId)
  }
  if (symbolId === undefined) {
    return getFundingRate2(chainId, poolAddress)
  } else {
    return getFundingRateV2(chainId, poolAddress, symbolId)
  }
}

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getEstimatedFundingRateV2l(chainId, poolAddress, newNetVolume, symbolId)
  }
  if (symbolId === undefined) {
    return getEstimatedFundingRate2(chainId, poolAddress, newNetVolume)
  } else {
    return getEstimatedFundingRateV2(chainId, poolAddress, newNetVolume, symbolId)
  }
}

export const getLiquidityUsed = async (
  chainId,
  poolAddress,
  symbolId
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getLiquidityUsedV2l(chainId, poolAddress, symbolId)
  }
  if (symbolId === undefined) {
    return getLiquidityUsed2(chainId, poolAddress)
  } else {
    return getLiquidityUsedV2(chainId, poolAddress, symbolId)
  }
};

export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getEstimatedLiquidityUsedV2l(chainId, poolAddress, newNetVolume, symbolId)
  }
  if (symbolId === undefined) {
    return getEstimatedLiquidityUsed2(chainId, poolAddress, newNetVolume)
  } else {
    return getEstimatedLiquidityUsedV2(chainId, poolAddress, newNetVolume, symbolId)
  }
}

export const getFundingRateCache = async(chainId, poolAddress, symbolId) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getFundingRateCacheV2l(chainId, poolAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getFundingRateCache2(chainId, poolAddress)
  } else {
    return getFundingRateCacheV2(chainId, poolAddress, symbolId)
  }
}
