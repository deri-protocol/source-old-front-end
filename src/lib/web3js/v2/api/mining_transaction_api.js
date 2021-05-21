import { DeriEnv } from '../../config'
import { getPoolConfig } from '../config'
import { perpetualPoolRouterFactory } from '../factory'

export const addLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  amount,
) => {
   const {router:routerAddress} = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId)
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
  bTokenId,
  shares,
) => {
   const {router:routerAddress} = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   let res
   try {
     const tx = await perpetualPoolRouter.removeLiquidity(accountAddress, bTokenId, shares);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err};
   }
   return res
}