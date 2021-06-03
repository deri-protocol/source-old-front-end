import { lTokenFactory, perpetualPoolFactory } from '../factory'
import { getPoolConfig, getFilteredPoolConfigList} from '../config'
import { bg, deriToNatural } from '../utils'
import { calculateMaxRemovableLiquidity } from '../calculation'
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

    const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, '0').sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
    const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId))
    const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
    const symbolIdList = symbolConfigList.map((i) => i.symbolId)

    const [parameterInfo, bTokenInfo, lTokenAsset ] = await Promise.all([
      perpetualPool.getParameters(),
      perpetualPool.getBToken(bTokenId),
      lToken.getAsset(accountAddress, bTokenId),
    ])
    const { minPoolMarginRatio } = parameterInfo
    let promises = []
    for (let i=0; i<bTokenIdList.length; i++) {
      promises.push(perpetualPool.getBToken(bTokenIdList[i]))
    }
    const bTokens = await Promise.all(promises)

    promises = []
    for (let i=0; i<symbolIdList.length; i++) {
      promises.push(perpetualPool.getSymbol(symbolIdList[i]))
    }
    const symbols = await Promise.all(promises)

    const cost = symbols.reduce((accum, s) => {
        return accum.plus(bg(s.tradersNetVolume).times(s.price).times(s.multiplier).abs())
    }, bg(0))
    const pnl = symbols.reduce((accum, s) => {
        return accum.plus(bg(s.tradersNetVolume).times(s.price).times(s.multiplier).minus(s.tradersNetCost))
    }, bg(0))
    const restLiquidity = bTokens.reduce((accum, b, index) => {
      if (index === parseInt(bTokenId)) {
        return accum.plus(b.pnl)
      } else {
        return accum.plus(bg(b.liquidity).times(b.price).times(b.discount).plus(b.pnl))
      }
    }, bg(0))

    const { liquidity: poolLiquidity } = bTokenInfo;
    const { liquidity } = lTokenAsset
    const maxRemovableShares = calculateMaxRemovableLiquidity(bTokens[bTokenId], liquidity, cost, pnl, restLiquidity, minPoolMarginRatio)
    return {
      //totalSupply: lTokenTotalSupply.toString(),
      poolLiquidity: poolLiquidity.toString(),
      // shares: liquidity.toString(),
      // shareValue: '1',
      // maxRemovableShares: liquidity.toString()
      shares: liquidity.toString(),
      maxRemovableShares: maxRemovableShares.toString()
    };
  } catch (err) {
    console.log(err)
  }
  return {
    poolLiquidity: '',
    shares: '',
    maxRemovableShares: '',
  };
};

export const getPoolLiquidity = async (chainId, poolAddress, bTokenId) => {
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