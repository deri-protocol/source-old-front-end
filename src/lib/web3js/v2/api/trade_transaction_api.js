import { DeriEnv } from '../../config'
import { getPoolConfig } from '../config'
import { bTokenFactory, perpetualPoolRouterFactory, pTokenFactory } from '../factory'

export const unlock = async (chainId, poolAddress, accountAddress, bTokenId) => {
   const { bToken: bTokenAddress } = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId);
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
   const { router: routerAddress } = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const tx = await perpetualPoolRouter.addMargin(accountAddress, bTokenId, amount);
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
  bTokenId,
  amount
) => {
   const { router: routerAddress } = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const tx = await perpetualPoolRouter.removeMargin(accountAddress, bTokenId, amount);
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
  symbolId,
  newVolume,
) => {
   const { router: routerAddress } = getPoolConfig(DeriEnv.get(), poolAddress);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress);
   let res;
   try {
     const tx = await perpetualPoolRouter.trade(accountAddress, symbolId, newVolume);
     res = { success: true, transaction: tx };
   } catch (err) {
     res = { success: false, error: err };
   }
   return res;
}

export const closePosition = async (chainId, poolAddress, accountAddress, symbolId) => {
   const { router: routerAddress, pToken: pTokenAddress } = getPoolConfig(DeriEnv.get(), poolAddress);
   const perpetualPoolRouter = perpetualPoolRouterFactory(chainId, routerAddress)
   const pToken = pTokenFactory(chainId, pTokenAddress)
   const { volume } = await pToken.getPosition(accountAddress, symbolId)
   const newVolume = volume.negated()
   let res;
   if (!volume.eq(0)) {
    try {
      const tx = await perpetualPoolRouter.trade(accountAddress, symbolId, newVolume);
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