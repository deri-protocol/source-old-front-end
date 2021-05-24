import { getPoolConfig } from '../config'
import { perpetualPoolRouterFactory } from '../factory'

export const addLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const {router:routerAddress} = getPoolConfig(poolAddress, bTokenId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   let res
   try {
     const tx = await perpetualPoolRouter.addLiquidity(accountAddress, bTokenId, amount);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err};
   }
   return res
}

export const removeLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const {router:routerAddress} = getPoolConfig(poolAddress, bTokenId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   let res
   try {
     const tx = await perpetualPoolRouter.removeLiquidity(accountAddress, bTokenId, amount);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err};
   }
   return res
}