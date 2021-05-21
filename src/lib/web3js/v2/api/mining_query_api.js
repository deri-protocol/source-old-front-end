import { lTokenFactory, perpetualPoolFactory } from '../factory'
import { getPoolConfig } from '../config'
import { DeriEnv } from '../../config';

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  symbolId,
  useInfura,
) => {
  // const {lToken:lTokenAddress} = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId, symbolId)
  // const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  // const lToken = lTokenFactory(chainId, lTokenAddress, useInfura);

  // const [price, symbolInfo, parameterInfo] = await Promise.all([
  //   getBTCUSDPrice(chainId, poolAddress),
  //   pPool.getSymbol(symbolId),
  //   pPool.getParameters(),
  // ])
  // const { multiplier, tradersNetCost, tradersNetVolume } = symbolInfo
  // const { minPoolMarginRatio } = parameterInfo
  // const poolDynamicEquity = liquidity.plus(
  //   tradersNetCost.minus(tradersNetVolume.times(price).times(multiplier))
  // );

  // const [lTokenBalance, lTokenTotalSupply] = await Promise.all([
  //   lToken.balance(accountAddress),
  //   lToken.totalSupply(),
  // ]);
  // return {
  //   totalSupply: lTokenTotalSupply.toString(),
  //   poolLiquidity: liquidity.toString(),
  //   shares: lTokenBalance.toString(),
  //   shareValue: calculateShareValue(
  //     lTokenTotalSupply,
  //     poolDynamicEquity
  //   ).toString(),
  //   maxRemovableShares: calculateMaxRemovableShares(
  //     lTokenBalance,
  //     lTokenTotalSupply,
  //     liquidity,
  //     tradersNetVolume,
  //     tradersNetCost,
  //     multiplier,
  //     minPoolMarginRatio,
  //     price
  //   ).toString(),
  // };
  return {
    totalSupply: '-',
    poolLiquidity: '-',
    shares: '-',
    shareValue: '-',
    maxRemovableShares: '-',
  };
};

export const getPoolLiquidity = async (chainId, poolAddress, bTokenId, useInfura=false) => {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  const res = await perpetualPool.getBToken(bTokenId)
  return res.liquidity.toString()
};