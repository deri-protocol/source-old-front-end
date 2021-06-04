import { lTokenFactory, perpetualPoolFactory } from '../factory'
import { getPoolConfig, getFilteredPoolConfigList} from '../config'
import { bg, deriToNatural } from '../utils'
import { getNetworkName } from '../../utils'
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
    const totalPnl = symbols.reduce((accum, s) => {
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
    const { liquidity, pnl } = lTokenAsset
    const maxRemovableShares = calculateMaxRemovableLiquidity(bTokens[bTokenId], liquidity, cost, totalPnl, restLiquidity, minPoolMarginRatio)
    return {
      //totalSupply: lTokenTotalSupply.toString(),
      poolLiquidity: poolLiquidity.toString(),
      // shares: liquidity.toString(),
      // shareValue: '1',
      // maxRemovableShares: liquidity.toString()
      shares: liquidity.toString(),
      pnl: pnl.toString(),
      maxRemovableShares: maxRemovableShares.toString()
    };
  } catch (err) {
    console.log(err)
  }
  return {
    poolLiquidity: '',
    shares: '',
    pnl: '',
    maxRemovableShares: '',
  };
};

export const getPoolLiquidity = async (chainId, poolAddress, bTokenId) => {
  // use the dev database
  const db = databaseFactory();
  try {
    const res = await db
      .getValues([`${chainId}.${poolAddress}.liquidity${bTokenId}`])
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

export const getPoolInfoApy = async (chainId, poolAddress, bTokenId) => {
  const db = databaseFactory(true);
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.apy${bTokenId}`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ])
      .catch((err) => console.log('getPoolInfoApy', err));
    if (res) {
      const [apy, volume1h, volume24h] = res;
      return {
        apy: deriToNatural(apy).toString(),
        volume1h: deriToNatural(volume1h).toString(),
        volume24h: deriToNatural(volume24h).toString(),
      };
    }
  } catch (err) {
    console.log(err);
  }
};