import { getLiquidityInfo2 } from '../api/restApi';
import { getPoolLiquidity as getPoolLiquidity2 } from '../api/databaseApi';
import { 
  getLiquidityInfo as getLiquidityInfoV2,
  getPoolLiquidity as getPoolLiquidityV2,
 } from '../v2';

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  symbolId
) => {
  if (bTokenId === undefined) {
    return getLiquidityInfo2(chainId, poolAddress, accountAddress)
  } else {
    return getLiquidityInfoV2(chainId, poolAddress, accountAddress, bTokenId, symbolId)
  }
};

export const getPoolLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  symbolId
) => {
  if (bTokenId === undefined) {
    return getPoolLiquidity2(chainId, poolAddress, accountAddress)
  } else {
    return getPoolLiquidityV2(chainId, poolAddress, accountAddress, bTokenId, symbolId)
  }
};