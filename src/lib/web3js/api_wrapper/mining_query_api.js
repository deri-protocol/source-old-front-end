import { getLiquidityInfo2 } from '../api/restApi';
import { getPoolLiquidity as getPoolLiquidity2, getPoolInfoApy as getPoolInfoApy2 } from '../api/databaseApi';
import { 
  getLiquidityInfo as getLiquidityInfoV2,
  getPoolLiquidity as getPoolLiquidityV2,
  getPoolInfoApy as getPoolInfoApyV2,
 } from '../v2';

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
) => {
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
  if (bTokenId === undefined) {
    return getPoolLiquidity2(chainId, poolAddress)
  } else {
    return getPoolLiquidityV2(chainId, poolAddress, bTokenId)
  }
};

export const getPoolInfoApy = async (chainId, poolAddress, bTokenId) => {
  if (bTokenId === undefined) {
    return getPoolInfoApy2(chainId, poolAddress)
  } else {
    return getPoolInfoApyV2(chainId, poolAddress, bTokenId)
  }
};