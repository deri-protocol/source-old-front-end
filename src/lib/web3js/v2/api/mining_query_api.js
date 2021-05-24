import { lTokenFactory, perpetualPoolFactory } from '../factory'
import { getPoolConfig } from '../config'

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  symbolId,
  useInfura,
) => {
  const {lToken:lTokenAddress} = getPoolConfig(poolAddress, bTokenId, symbolId)
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  const lToken = lTokenFactory(chainId, lTokenAddress, useInfura);

  const [bTokenInfo, lTokenAsset] = await Promise.all([
    perpetualPool.getBToken(bTokenId),
    lToken.getAsset(accountAddress, bTokenId),
  ])
  const { liquidity: poolLiquidity } = bTokenInfo;
  const { liquidity } = lTokenAsset
  return {
    //totalSupply: lTokenTotalSupply.toString(),
    poolLiquidity: poolLiquidity.toString(),
    // shares: liquidity.toString(),
    // shareValue: '1',
    // maxRemovableShares: liquidity.toString()
    liquidity: liquidity.toString(),
    maxRemovableLiquidity: liquidity.toString()
  };
};

export const getPoolLiquidity = async (chainId, poolAddress, bTokenId, useInfura=false) => {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  const res = await perpetualPool.getBToken(bTokenId)
  return res.liquidity.toString()
};