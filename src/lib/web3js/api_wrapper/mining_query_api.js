//import { getLiquidityInfo2 } from '../v1/api/rest_api';
import { getPoolVersion } from '../shared';
import { getLiquidityInfo2 } from '../v1/api';
import {
  getPoolLiquidity as getPoolLiquidity2,
  getPoolInfoApy as getPoolInfoApy2,
} from '../shared/api/database_api';
import {
  getLiquidityInfoV2,
  getPoolLiquidityV2,
  getPoolInfoApyV2,
} from '../v2/api';
import {
  getLiquidityInfoV2l,
  getPoolLiquidityV2l,
  getPoolInfoApyV2l,
} from '../v2_lite/api';

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
) => {
  if (['v2_lite', 'v2_lite_open'].includes(getPoolVersion(poolAddress))) {
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
  if (['v2_lite', 'v2_lite_open'].includes(getPoolVersion(poolAddress))) {
    return getPoolLiquidityV2l(chainId, poolAddress)
  }
  if (bTokenId === undefined) {
    return getPoolLiquidity2(chainId, poolAddress)
  } else {
    return getPoolLiquidityV2(chainId, poolAddress, bTokenId)
  }
};

export const getPoolInfoApy = async (chainId, poolAddress, bTokenId) => {
  if (['v2_lite', 'v2_lite_open'].includes(getPoolVersion(poolAddress))) {
    return getPoolInfoApyV2l(chainId, poolAddress)
  }
  if (bTokenId === undefined) {
    return getPoolInfoApy2(chainId, poolAddress)
  } else {
    return getPoolInfoApyV2(chainId, poolAddress, bTokenId)
  }
};