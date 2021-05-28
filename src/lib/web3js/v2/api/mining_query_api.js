import { lTokenFactory, perpetualPoolFactory } from '../factory'
import { getPoolConfig } from '../config'
import { deriToNatural } from '../utils'
import { databaseFactory } from '../../factory/contracts';

export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  useInfura,
) => {
  try {
    const {lToken:lTokenAddress} = getPoolConfig(poolAddress, bTokenId)
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
      shares: liquidity.toString(),
      maxRemovableShares: liquidity.toString()
    };
  } catch (err) {
    console.log(err)
  }
  return {
    poolLiquidity: '',
    hares: '',
    maxRemovableShares: '',
  };
};

export const getPoolLiquidity = async (chainId, poolAddress, bTokenId, useInfura=false) => {
  // const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  // const res = await perpetualPool.getBToken(bTokenId)
  // return res.liquidity.toString()

  // use the dev database
  const db = databaseFactory();
  try {
    const res = await db
      .getValues([`${chainId}.${poolAddress}.${bTokenId}.liquidity`])
      .catch((err) => console.log('getPoolLiquidity', err));
    if (res) {
      const [liquidity] = res;
      return {
        liquidity: deriToNatural(liquidity).toString(),
        symbol:'',
      };
    }
  } catch (err) {
    console.log(err);
  }
  return {
    liquidity: '',
    symbol:'',
  };
};