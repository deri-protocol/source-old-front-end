import { getLiquidityInfo2 } from '../api/restApi';
import { getPoolLiquidity as getPoolLiquidity2, getPoolInfoApy as getPoolInfoApy2 } from '../api/databaseApi';
import { 
  getLiquidityInfo as getLiquidityInfoV2,
  getPoolLiquidity as getPoolLiquidityV2,
  getPoolInfoApy as getPoolInfoApyV2,
  getLiquidityInfoV2l,
  getPoolLiquidityV2l,
  getPoolInfoApyV2l,
  getPoolVersion,
 } from '../v2';

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getLiquidityInfoV2l(chainId, poolAddress, accountAddress)
  }
  if (bTokenId === undefined) {
    return getLiquidityInfo2(chainId, poolAddress, accountAddress)
  } else {
    return getLiquidityInfoV2(chainId, poolAddress, accountAddress, bTokenId)
  }
};

export const getPoolLiquidity = async (
  chainId,
  poolAddress,
  bTokenId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getPoolLiquidityV2l(chainId, poolAddress)
  }
  if (bTokenId === undefined) {
    return getPoolLiquidity2(chainId, poolAddress)
  } else {
    return getPoolLiquidityV2(chainId, poolAddress, bTokenId)
  }
};

export const getPoolInfoApy = async (chainId, poolAddress, bTokenId) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getPoolInfoApyV2l(chainId, poolAddress)
  }
  if (bTokenId === undefined) {
    return getPoolInfoApy2(chainId, poolAddress)
  } else {
    return getPoolInfoApyV2(chainId, poolAddress, bTokenId)
  }
};