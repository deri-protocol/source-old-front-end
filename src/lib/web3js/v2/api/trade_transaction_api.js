import { isOrderValid } from '../calculation';
import { getPoolConfig, getFilteredPoolConfigList } from '../config'
import {
  bTokenFactory,
  perpetualPoolRouterFactory,
  pTokenFactory,
  perpetualPoolFactory,
} from '../factory';
import { getOraclePrice, getOracleInfo, bg } from '../utils';

export const unlock = async (chainId, poolAddress, accountAddress, bTokenId) => {
   const { bToken: bTokenAddress } = getPoolConfig(poolAddress, bTokenId);
  const bToken = bTokenFactory(chainId, bTokenAddress);
  let res;
  try {
    const tx = await bToken.unlock(accountAddress, poolAddress)
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res;
};


export const depositMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const { router: routerAddress } = getPoolConfig(poolAddress, bTokenId);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const tx = await perpetualPoolRouter.addMarginWithPrices(accountAddress, bTokenId, amount);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err };
   }
   return res;
}

export const withdrawMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const { router: routerAddress } = getPoolConfig(poolAddress, bTokenId);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const tx = await perpetualPoolRouter.removeMarginWithPrices(accountAddress, bTokenId, amount);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err };
   }
   return res;
}

export const tradeWithMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  newVolume,
  symbolId,
  useInfura,
) => {
   const { router: routerAddress } = getPoolConfig(poolAddress);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
   const {pToken: pTokenAddress } = getPoolConfig(poolAddress, null, symbolId)
   const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
   const [price, symbolInfo, parameterInfo, positions] = await Promise.all([
     getOraclePrice(poolAddress, symbolId),
     perpetualPool.getSymbol(symbolId),
     perpetualPool.getParameters(),
     pToken.getPositions(accountAddress),
     //pToken.getMargin(accountAddress, symbolId),
   ]);

   const { multiplier } = symbolInfo;
   const { minInitialMarginRatio, minPoolMarginRatio} = parameterInfo;

   const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, symbolId)
   const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
   const margins = await pToken.getMargins(accountAddress)
    let promises = []
    for (let i=0; i<bTokenIdList.length; i++) {
      promises.push(perpetualPool.getBToken(bTokenIdList[i]))
    }
    const bTokens = await Promise.all(promises)
    const margin = bTokens.reduce((accum, i, index) => {
      return accum.plus(bg(i.price).times(i.discount).times(margins[index]))
    }, bg(0))

    const liquidity = bTokens.reduce((accum, i) => accum.plus(bg(i.liquidity).times(i.price).times(i.discount)), bg(0))
    //console.log('liquidity', liquidity.toString())
    const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0')
    let symbolIdList = symbolConfigList.map((i) => i.symbolId)
    promises = []
    for (let i=0; i<symbolIdList.length; i++) {
      promises.push(perpetualPool.getSymbol(symbolIdList[i]))
    }
    const symbols = await Promise.all(promises)
    let marginHeld = symbols.reduce((accum, a, index) => {
      if (index === parseInt(symbolId)) {
        return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume.plus(newVolume)).abs())
      } else {
        return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume).abs())
      }
    }, bg(0))
    marginHeld = marginHeld.times(minInitialMarginRatio)

    //console.log('margin', margin.toString(), marginHeld.toString())
    let liquidityUsed = symbols.reduce((accum, a, index) => {
      if (index === parseInt(symbolId)) {
        return accum.plus(bg(a.tradersNetVolume.plus(newVolume)).times(a.price).times(a.multiplier).abs())
      } else {
        return accum.plus(bg(a.tradersNetVolume).times(a.price).times(a.multiplier).abs())
      }
    }, bg(0))
    liquidityUsed = liquidityUsed.times(minPoolMarginRatio)
    //console.log('liquidityUsed', liquidityUsed.toString())

    const pnl = bTokens.reduce((accum, i) => accum.plus(i.pnl), bg(0))
    console.log('pnl', pnl.toString())

   const orderValidation = isOrderValid(
     //price,
     margin,
     marginHeld,
     liquidity.plus(pnl),
     liquidityUsed,
     //multiplier,
     //minPoolMarginRatio,
     //bg(newVolume),
   )
   let res;
   if (orderValidation.success) {
    try {
      const tx = await perpetualPoolRouter.tradeWithPrices(accountAddress, symbolId, newVolume);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
   } else {
     res = { success: false, error: orderValidation.error};
   }
   return res;
}

export const closePosition = async (chainId, poolAddress, accountAddress, symbolId) => {
   const { router: routerAddress, pToken: pTokenAddress } = getPoolConfig(poolAddress);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const pToken = pTokenFactory(chainId, pTokenAddress)
   const { volume } = await pToken.getPosition(accountAddress, symbolId)
   const newVolume = volume.negated()
   let res;
   if (!volume.eq(0)) {
    try {
      const tx = await perpetualPoolRouter.tradeWithPrices(accountAddress, symbolId, newVolume);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
    return res;
  } else {
    res = { success: false, error: 'no position to close' };
  }
  return res
}

export const depositMarginWithPrices = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const { router: routerAddress } = getPoolConfig(poolAddress, bTokenId);
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const promises = symbolList.map(async(s) => {
       return await getOracleInfo(poolAddress, s)
     })
     const prices = await Promise.all(promises)
     const priceInfos = prices.map((p, index) => {
       return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
     })
     const tx = await perpetualPoolRouter.addMarginWithPrices(accountAddress, bTokenId, amount, priceInfos);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err };
   }
   return res;
}

export const withdrawMarginWithPrices = async (
  chainId,
  poolAddress,
  accountAddress,
  amount,
  bTokenId,
) => {
   const { router: routerAddress } = getPoolConfig(poolAddress, bTokenId);
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const promises = symbolList.map(async(s) => {
       return await getOracleInfo(poolAddress, s)
     })
     const prices = await Promise.all(promises)
     const priceInfos = prices.map((p, index) => {
       return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
     })
     const tx = await perpetualPoolRouter.removeMarginWithPrices(accountAddress, bTokenId, amount, priceInfos);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err };
   }
   return res;
}

export const tradeWithMarginWithPrices = async (
  chainId,
  poolAddress,
  accountAddress,
  newVolume,
  symbolId,
  useInfura,
) => {
   const { router: routerAddress } = getPoolConfig(poolAddress);
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
   const {pToken: pTokenAddress } = getPoolConfig(poolAddress, null, symbolId)
   const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
   const [price, symbolInfo, parameterInfo, positions] = await Promise.all([
     getOraclePrice(poolAddress, symbolId),
     perpetualPool.getSymbol(symbolId),
     perpetualPool.getParameters(),
     pToken.getPositions(accountAddress),
     //pToken.getMargin(accountAddress, symbolId),
   ]);

   const { multiplier } = symbolInfo;
   const { minInitialMarginRatio, minPoolMarginRatio} = parameterInfo;

   const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, symbolId)
   const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
   const margins = await pToken.getMargins(accountAddress)
    let promises = []
    for (let i=0; i<bTokenIdList.length; i++) {
      promises.push(perpetualPool.getBToken(bTokenIdList[i]))
    }
    const bTokens = await Promise.all(promises)
    const margin = bTokens.reduce((accum, i, index) => {
      return accum.plus(bg(i.price).times(i.discount).times(margins[index]))
    }, bg(0))

    const liquidity = bTokens.reduce((accum, i) => accum.plus(bg(i.liquidity).times(i.price).times(i.discount)), bg(0))
    //console.log('liquidity', liquidity.toString())
    const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0')
    let symbolIdList = symbolConfigList.map((i) => i.symbolId)
    promises = []
    for (let i=0; i<symbolIdList.length; i++) {
      promises.push(perpetualPool.getSymbol(symbolIdList[i]))
    }
    const symbols = await Promise.all(promises)
    let marginHeld = symbols.reduce((accum, a, index) => {
      if (index === parseInt(symbolId)) {
        return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume.plus(newVolume)).abs())
      } else {
        return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume).abs())
      }
    }, bg(0))
    marginHeld = marginHeld.times(minInitialMarginRatio)

    //console.log('margin', margin.toString(), marginHeld.toString())
    let liquidityUsed = symbols.reduce((accum, a, index) => {
      if (index === parseInt(symbolId)) {
        return accum.plus(bg(a.tradersNetVolume.plus(newVolume)).times(a.price).times(a.multiplier).abs())
      } else {
        return accum.plus(bg(a.tradersNetVolume).times(a.price).times(a.multiplier).abs())
      }
    }, bg(0))
    liquidityUsed = liquidityUsed.times(minPoolMarginRatio)
    //console.log('liquidityUsed', liquidityUsed.toString())

    const pnl = bTokens.reduce((accum, i) => accum.plus(i.pnl), bg(0))
    console.log('pnl', pnl.toString())

   const orderValidation = isOrderValid(
     //price,
     margin,
     marginHeld,
     liquidity.plus(pnl),
     liquidityUsed,
     //multiplier,
     //minPoolMarginRatio,
     //bg(newVolume),
   )
   let res;
   if (orderValidation.success) {
    try {
     promises = symbolList.map(async(s) => {
       return await getOracleInfo(poolAddress, s)
     })
     const prices = await Promise.all(promises)
     const priceInfos = prices.map((p, index) => {
       return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
     })
      const tx = await perpetualPoolRouter.tradeWithPrices(accountAddress, symbolId, newVolume, priceInfos);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
   } else {
     res = { success: false, error: orderValidation.error};
   }
   return res;
}

export const closePositionWithPrices = async (chainId, poolAddress, accountAddress, symbolId) => {
   const { router: routerAddress, pToken: pTokenAddress } = getPoolConfig(poolAddress);
   const symbolList = getFilteredPoolConfigList(poolAddress, '0').map(c => c.symbolId)
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const pToken = pTokenFactory(chainId, pTokenAddress)
   const { volume } = await pToken.getPosition(accountAddress, symbolId)
   const newVolume = volume.negated()
   let res;
   if (!volume.eq(0)) {
    try {
     const promises = symbolList.map(async(s) => {
       return await getOracleInfo(poolAddress, s)
     })
     const prices = await Promise.all(promises)
     const priceInfos = prices.map((p, index) => {
       return [symbolList[index], p.timestamp, p.price, parseInt(p.v).toString(), p.r, p.s]
     })
      const tx = await perpetualPoolRouter.tradeWithPrices(accountAddress, symbolId, newVolume, priceInfos);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
    return res;
  } else {
    res = { success: false, error: 'no position to close' };
  }
  return res
}