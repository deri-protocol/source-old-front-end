import { getFilteredPoolConfigList, getPoolConfig } from '../config'
import { perpetualPoolRouterFactory, perpetualPoolFactory, lTokenFactory } from '../factory'
import { getOracleInfo } from '../utils'
import { isBToken0RatioValid, isPoolMarginRatioValid } from '../calculation'

export const addLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const {router:routerAddress} = getPoolConfig(poolAddress, bTokenId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
   const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, '0').sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
   const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
   let promises = []
   for (let i=0; i<bTokenIdList.length; i++) {
    promises.push(perpetualPool.getBToken(bTokenIdList[i]))
   }
   const bTokens = await Promise.all(promises)
   const { minBToken0Ratio } = await perpetualPool.getParameters();
   const validation = isBToken0RatioValid(bTokens, bTokenId, amount, minBToken0Ratio)
   let res
   if (validation.success) {
    try {
      const tx = await perpetualPoolRouter.addLiquidity(accountAddress, bTokenId, amount);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err};
    }
   } else {
      res = { success: false, error: validation.error};
   }
   return res
}

export const removeLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
  isMaximum=false,
) => {
   const {router:routerAddress} = getPoolConfig(poolAddress, bTokenId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const {lToken:lTokenAddress} = getPoolConfig(poolAddress, bTokenId)
   const perpetualPool = perpetualPoolFactory(chainId, poolAddress)
   const lToken = lTokenFactory(chainId, lTokenAddress);
   const lTokenAsset = await lToken.getAsset(accountAddress, bTokenId)
  const { liquidity:userLiquidity } = lTokenAsset
   const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, '0').sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
   const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
   let promises = []
   for (let i=0; i<bTokenIdList.length; i++) {
    promises.push(perpetualPool.getBToken(bTokenIdList[i]))
   }
   const bTokens = await Promise.all(promises)
   const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId))
   let symbolIdList = symbolConfigList.map((i) => i.symbolId)
   promises = []
   for (let i=0; i<symbolIdList.length; i++) {
     promises.push(perpetualPool.getSymbol(symbolIdList[i]))
   }
   const symbols = await Promise.all(promises)
   const { minPoolMarginRatio } = await perpetualPool.getParameters();
   const validation = isPoolMarginRatioValid(bTokens, bTokenId, amount, userLiquidity, symbols, minPoolMarginRatio)
   let res
   if (validation.success) {
     try {
       const tx = await perpetualPoolRouter.removeLiquidity(accountAddress, bTokenId, amount, isMaximum);
       res = { success: true, transaction: tx };
     } catch (err) {
       res = { success: false, error: err};
     }
   } else {
    res = { success: false, error: validation.error };
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
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId)).map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
   const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, '0').sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
   const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
   let promises = []
   for (let i=0; i<bTokenIdList.length; i++) {
    promises.push(perpetualPool.getBToken(bTokenIdList[i]))
   }
   const bTokens = await Promise.all(promises)
   const { minBToken0Ratio } = await perpetualPool.getParameters();
   const validation = isBToken0RatioValid(bTokens, bTokenId, amount, minBToken0Ratio)
   let res
   if (validation.success) {
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
   } else {
    res = { success: false, error: validation.error };
   }
   return res
}

export const removeLiquidityWithPrices = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
  isMaximum = false,
) => {
   const {router:routerAddress, lToken:lTokenAddress} = getPoolConfig(poolAddress, bTokenId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const perpetualPool = perpetualPoolFactory(chainId, poolAddress)

   const lToken = lTokenFactory(chainId, lTokenAddress);
   const lTokenAsset = await lToken.getAsset(accountAddress, bTokenId)
   const { liquidity:userLiquidity } = lTokenAsset
   const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, '0').sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
   const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
   let promises = []
   for (let i=0; i<bTokenIdList.length; i++) {
    promises.push(perpetualPool.getBToken(bTokenIdList[i]))
   }
   const bTokens = await Promise.all(promises)
   promises = []

   const symbolList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId)).map(c => c.symbolId)
   for (let i=0; i<symbolList.length; i++) {
     promises.push(perpetualPool.getSymbol(symbolList[i]))
   }
   const symbols = await Promise.all(promises)
   const { minPoolMarginRatio } = await perpetualPool.getParameters();

   const validation = isPoolMarginRatioValid(bTokens, bTokenId, amount, userLiquidity, symbols, minPoolMarginRatio)
   let res
   if (validation.success) {
     try {
       promises = symbolList.map(async(s) => {
         return await getOracleInfo(poolAddress, s)
       })
       const prices = await Promise.all(promises)
       const priceInfos = prices.map((p, index) => {
         return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
       })
       const tx = await perpetualPoolRouter.removeLiquidityWithPrices(accountAddress, bTokenId, amount, priceInfos, isMaximum);
       res = { success: true, transaction: tx };
     } catch (err) {
       res = { success: false, error: err};
     }
   } else {
    res = { success: false, error: validation.error };
   }
   return res
}
