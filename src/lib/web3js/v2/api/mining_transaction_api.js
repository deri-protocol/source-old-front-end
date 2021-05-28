import { getFilteredPoolConfigList, getPoolConfig } from '../config'
import { perpetualPoolRouterFactory } from '../factory'
import { getOracleInfo, getOraclePrice } from '../utils'

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

export const addLiquidityWithPrices = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const {router:routerAddress} = getPoolConfig(poolAddress, bTokenId)
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   let res
   try {
     const promises = symbolList.map(async(s) => {
       return await getOracleInfo(poolAddress, s)
     })
     const prices = await Promise.all(promises)
     const priceInfos = prices.map((p, index) => {
       return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
     })
     const tx = await perpetualPoolRouter.addLiquidityWithPrices(accountAddress, bTokenId, amount, priceInfos);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err};
   }
   return res
}

export const removeLiquidityWithPrices = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const {router:routerAddress} = getPoolConfig(poolAddress, bTokenId)
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   let res
   try {
     const promises = symbolList.map(async(s) => {
       return await getOracleInfo(poolAddress, s)
     })
     const prices = await Promise.all(promises)
     const priceInfos = prices.map((p, index) => {
       return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
     })
     const tx = await perpetualPoolRouter.removeLiquidityWithPrices(accountAddress, bTokenId, amount, priceInfos);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err};
   }
   return res
}