import {
  getEstimatedFundingRateOption,
  getFundingRateCacheOption,
  getFundingRateOption,
  getLiquidityUsedOption,
  getPositionInfoOption,
  getSpecificationOption,
  getWalletBalanceOption,
  getEstimatedFeeOption,
  getEstimatedMarginOption,
  getEstimatedLiquidityUsedOption,
  isUnlockedOption,
  getPositionInfosPosition,
} from '../option/api';
import { getPoolVersion, isDeriUnlocked, LITE_VERSIONS } from '../shared';
import {
  getPositionInfo2,
  isUnlocked2,
  getEstimatedMargin2,
  getEstimatedFee2,
  getEstimatedFundingRate2,
  getEstimatedLiquidityUsed2,
  getWalletBalance2,
  getSpecification2,
  getFundingRate2,
  getLiquidityUsed2,
  getFundingRateCache2,
} from '../v1/api';

import {
  getPositionInfoV2,
  isUnlockedV2,
  getEstimatedMarginV2,
  getEstimatedFeeV2,
  getEstimatedFundingRateV2,
  getEstimatedLiquidityUsedV2,
  getSpecificationV2,
  getWalletBalanceV2,
  getFundingRateV2,
  getLiquidityUsedV2,
  getFundingRateCacheV2,
} from '../v2/api';

import {
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
} from '../v2_lite/api';

export const getSpecification = async (chainId, poolAddress, symbolId) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getSpecificationV2l(chainId, poolAddress, symbolId);
  } else if (version === 'option') {
    return getSpecificationOption(chainId, poolAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getSpecification2(chainId, poolAddress);
  } else {
    return getSpecificationV2(chainId, poolAddress, symbolId);
  }
};

export const getPositionInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getPositionInfoV2l(chainId, poolAddress, accountAddress, symbolId);
  } else if (version === 'option') {
    return getPositionInfoOption(
      chainId,
      poolAddress,
      accountAddress,
      symbolId
    );
  }
  if (symbolId === undefined) {
    return getPositionInfo2(chainId, poolAddress, accountAddress);
  } else {
    return getPositionInfoV2(chainId, poolAddress, accountAddress, symbolId);
  }
};

export const getPositionInfos = async(chainId, poolAddress, accountAddress) => {
  const version = getPoolVersion(poolAddress);
  if (version === 'option') {
    return getPositionInfosPosition(chainId, poolAddress, accountAddress)
  } else {
    // return empty array for v1, v2, v2_lite
    return []
  }
}
export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getWalletBalanceV2l(chainId, poolAddress, accountAddress);
  } else if (version === 'option') {
    return getWalletBalanceOption(chainId, poolAddress, accountAddress);
  }
  if (bTokenId === undefined) {
    return getWalletBalance2(chainId, poolAddress, accountAddress);
  } else {
    return getWalletBalanceV2(chainId, poolAddress, accountAddress, bTokenId);
  }
};

export const isUnlocked = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return isUnlockedV2l(chainId, poolAddress, accountAddress);
  } else if (version === 'option') {
    return isUnlockedOption(chainId, poolAddress, accountAddress);
  }
  if (accountAddress === undefined) {
    return isDeriUnlocked(chainId, poolAddress);
  } else if (bTokenId === undefined) {
    return isUnlocked2(chainId, poolAddress, accountAddress);
  } else {
    return isUnlockedV2(chainId, poolAddress, accountAddress, bTokenId);
  }
};

export const getEstimatedFee = async (
  chainId,
  poolAddress,
  volume,
  symbolId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getEstimatedFeeV2l(chainId, poolAddress, volume, symbolId);
  } else if (version === 'option') {
    return getEstimatedFeeOption(chainId, poolAddress, volume, symbolId);
  }
  if (symbolId === undefined) {
    return getEstimatedFee2(chainId, poolAddress, volume);
  } else {
    return getEstimatedFeeV2(chainId, poolAddress, volume, symbolId);
  }
};

export const getEstimatedMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  volume,
  leverage,
  symbolId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getEstimatedMarginV2l(
      chainId,
      poolAddress,
      accountAddress,
      volume,
      leverage,
      symbolId
    );
  } else if (version === 'option') {
    return getEstimatedMarginOption(
      chainId,
      poolAddress,
      accountAddress,
      volume,
      leverage,
      symbolId
    );
  }
  if (symbolId === undefined) {
    return getEstimatedMargin2(
      chainId,
      poolAddress,
      accountAddress,
      volume,
      leverage
    );
  } else {
    return getEstimatedMarginV2(
      chainId,
      poolAddress,
      accountAddress,
      volume,
      leverage,
      symbolId
    );
  }
};

export const getFundingRate = async (chainId, poolAddress, symbolId) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getFundingRateV2l(chainId, poolAddress, symbolId);
  } else if (version === 'option') {
    return getFundingRateOption(chainId, poolAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getFundingRate2(chainId, poolAddress);
  } else {
    return getFundingRateV2(chainId, poolAddress, symbolId);
  }
};

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getEstimatedFundingRateV2l(
      chainId,
      poolAddress,
      newNetVolume,
      symbolId
    );
  } else if (version === 'option') {
    return getEstimatedFundingRateOption(
      chainId,
      poolAddress,
      newNetVolume,
      symbolId
    );
  }
  if (symbolId === undefined) {
    return getEstimatedFundingRate2(chainId, poolAddress, newNetVolume);
  } else {
    return getEstimatedFundingRateV2(
      chainId,
      poolAddress,
      newNetVolume,
      symbolId
    );
  }
};

export const getLiquidityUsed = async (chainId, poolAddress, symbolId) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getLiquidityUsedV2l(chainId, poolAddress, symbolId);
  } else if (version === 'option') {
    return getLiquidityUsedOption(chainId, poolAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getLiquidityUsed2(chainId, poolAddress);
  } else {
    return getLiquidityUsedV2(chainId, poolAddress, symbolId);
  }
};

export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getEstimatedLiquidityUsedV2l(
      chainId,
      poolAddress,
      newNetVolume,
      symbolId
    );
  } else if (version === 'option') {
    return getEstimatedLiquidityUsedOption(
      chainId,
      poolAddress,
      newNetVolume,
      symbolId
    );
  }
  if (symbolId === undefined) {
    return getEstimatedLiquidityUsed2(chainId, poolAddress, newNetVolume);
  } else {
    return getEstimatedLiquidityUsedV2(
      chainId,
      poolAddress,
      newNetVolume,
      symbolId
    );
  }
};

export const getFundingRateCache = async (chainId, poolAddress, symbolId) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getFundingRateCacheV2l(chainId, poolAddress, symbolId);
  } else if (version === 'option') {
    return getFundingRateCacheOption(chainId, poolAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getFundingRateCache2(chainId, poolAddress);
  } else {
    return getFundingRateCacheV2(chainId, poolAddress, symbolId);
  }
};
