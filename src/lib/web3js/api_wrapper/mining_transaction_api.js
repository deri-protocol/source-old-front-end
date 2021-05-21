import {addLiquidity2, removeLiquidity2 } from '../api/contractTransactionApiV2';
import { 
  addLiquidity as addLiquidityV2,
  removeLiquidity as removeLiquidityV2
 } from '../v2';

export const addLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  amount,
) => {
  if (amount === undefined) {
    return addLiquidity2(chainId, poolAddress, accountAddress, amount);
  } else {
    return addLiquidityV2(
      chainId,
      poolAddress,
      accountAddress,
      bTokenId,
      amount
    );
  }
}

export const removeLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  amount,
) => {
  if (amount === undefined) {
    return removeLiquidity2(chainId, poolAddress, accountAddress, amount);
  } else {
    return removeLiquidityV2(
      chainId,
      poolAddress,
      accountAddress,
      bTokenId,
      amount
    );
  }
}
