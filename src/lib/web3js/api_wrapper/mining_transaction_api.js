//import {addLiquidity2, removeLiquidity2 } from '../v1/api/contract_transaction_api_v2';
import { getPoolVersion, LITE_VERSIONS } from '../shared'
import { addLiquidity2, removeLiquidity2 } from '../v1/api';
import { addLiquidityV2, removeLiquidityV2 } from '../v2/api';
import { addLiquidityV2l, removeLiquidityV2l } from '../v2_lite/api';
import { addLiquidityOption, removeLiquidityOption } from '../option/api';

export const addLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return addLiquidityV2l(chainId, poolAddress, accountAddress, amount)
  } else if (version === 'option') {
    return addLiquidityOption(chainId, poolAddress, accountAddress, amount);
  }
  if (bTokenId === undefined) {
    return addLiquidity2(chainId, poolAddress, accountAddress, amount);
  } else {
    return addLiquidityV2(
      chainId,
      poolAddress,
      accountAddress,
      amount,
      bTokenId
    );
  }
}

export const removeLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
  isMaximum,
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return removeLiquidityV2l(chainId, poolAddress, accountAddress, amount, isMaximum)
  } else if (version === 'option') {
    return removeLiquidityOption(chainId, poolAddress, accountAddress, amount, isMaximum)
  }
  if (bTokenId === undefined) {
    return removeLiquidity2(chainId, poolAddress, accountAddress, amount);
  } else {
    return removeLiquidityV2(
      chainId,
      poolAddress,
      accountAddress,
      amount,
      bTokenId,
      isMaximum,
    );
  }
}
