import { perpetualPoolLiteFactory } from '../../factory/v2_lite';
import { catchTxApiError } from '../../utils';

export const addLiquidity = async(chainId, poolAddress, accountAddress, amount) => {
  const args = [chainId, poolAddress, accountAddress, amount]
  return catchTxApiError(async (chainId, poolAddress, accountAddress, amount) => {
    const perpetualPool = perpetualPoolLiteFactory(chainId, poolAddress)
    return await perpetualPool.addLiquidity(accountAddress, amount)
  }, args)
}

export const removeLiquidity = async(chainId, poolAddress, accountAddress, amount, isMaximum=false) => {
  const args = [chainId, poolAddress, accountAddress, amount, isMaximum]
  return catchTxApiError(async (chainId, poolAddress, accountAddress, amount, isMaximum) => {
    const perpetualPool = perpetualPoolLiteFactory(chainId, poolAddress)
    return await perpetualPool.removeLiquidity(accountAddress, amount, isMaximum)
  }, args)
}
