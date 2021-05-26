import { perpetualPoolFactory, bTokenFactory, pTokenFactory } from '../factory';
import { getFilteredPoolConfigList, getPoolConfig} from '../config'
import {
  calculateEntryPrice,
  calculatePnl,
  calculateMarginHeld,
  calculateLiquidationPrice,
  calculateLiquidityUsed,
  calculateFundingRate,
  processFundingRate,
} from '../calculation';
import { getOraclePrice, bg } from '../utils'
import { fundingRateCache, priceCache } from '../api/api_globals';

export const getSpecification = async (
  chainId,
  poolAddress,
  bTokenId,
  symbolId,
  useInfura,
) => {
  const {symbol, bTokenSymbol } = getPoolConfig(poolAddress, bTokenId, symbolId)
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
  const [symbolInfo, parameterInfo] = await Promise.all([
    perpetualPool.getSymbol(symbolId),
    perpetualPool.getParameters(),
  ])
  const { multiplier, feeRatio, fundingRateCoefficient} = symbolInfo
  const {
    minPoolMarginRatio,
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
    minLiquidationReward,
    maxLiquidationReward,
    liquidationCutRatio,
    protocolFeeCollectRatio,
  } = parameterInfo
  return {
    symbol: symbol,
    bSymbol: bTokenSymbol,
    multiplier: multiplier.toString(),
    feeRatio: feeRatio.toString(),
    fundingRateCoefficient: fundingRateCoefficient.toString(),
    minPoolMarginRatio: minPoolMarginRatio.toString(),
    minInitialMarginRatio: minInitialMarginRatio.toString(),
    minMaintenanceMarginRatio: minMaintenanceMarginRatio.toString(),
    //minAddLiquidity: minAddLiquidity.toString(),
    //redemptionFeeRatio: redemptionFeeRatio.toString(),
    minLiquidationReward: minLiquidationReward.toString(),
    maxLiquidationReward: maxLiquidationReward.toString(),
    liquidationCutRatio: liquidationCutRatio.toString(),
    protocolFeeCollectRatio: protocolFeeCollectRatio.toString(),
  }
};

export const getPositionInfo = async (chainId, poolAddress, accountAddress, symbolId, useInfura) => {
  const poolconfigList = getFilteredPoolConfigList(poolAddress, null, symbolId)
  let bTokenList = poolconfigList.map((i) => {
    return i.bTokenId
  })
  //console.log('bTokenList', bTokenList)
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
  const {pToken: pTokenAddress } = getPoolConfig(poolAddress, null, symbolId)
  const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
  const [price, symbolInfo, parameterInfo, positionInfo ] = await Promise.all([
    getOraclePrice(poolAddress, symbolId),
    perpetualPool.getSymbol(symbolId),
    perpetualPool.getParameters(),
    pToken.getPosition(accountAddress, symbolId),
    //pToken.getMargin(accountAddress, symbolId),
  ])
  priceCache.set(poolAddress, symbolId, price)
  const { volume, cost } = positionInfo
  const { multiplier } = symbolInfo
  const {
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
  } = parameterInfo
  const margins = await pToken.getMargins(accountAddress)
  //console.log('margins', margins[0].toString(), margins[1].toString())
  let promises = []
  for (let i=0; i<bTokenList.length; i++) {
    promises.push(perpetualPool.getBToken(bTokenList[i]))
  }
  const bTokens = await Promise.all(promises)
  const margin = bTokens.reduce((accum, a, index) => {
    return accum.plus(bg(a.price).times(a.discount).times(margins[index]))
  }, bg(0))
 return {
   volume: volume.toString(),
   averageEntryPrice: calculateEntryPrice(volume, cost, multiplier).toString(),
   margin: margin.toString(),
   marginHeld: calculateMarginHeld(
     price,
     volume,
     multiplier,
     minInitialMarginRatio
   ).toString(),
   unrealizedPnl: calculatePnl(price, volume, multiplier, cost).toString(),
   liquidationPrice: calculateLiquidationPrice(
     volume,
     margin,
     cost,
     multiplier,
     minMaintenanceMarginRatio
   ).toString(),
 };
}

export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  useInfura,
) => {
  const { bToken: bTokenAddress } = getPoolConfig(poolAddress, bTokenId);
  const balance = await bTokenFactory(chainId, bTokenAddress, useInfura).balanceOf(accountAddress)
  return balance.toString()
}

export const isUnlocked = async (chainId, poolAddress, accountAddress, bTokenId, useInfura) => { 
  const { bToken: bTokenAddress } = getPoolConfig(poolAddress, bTokenId);
  const bToken = await bTokenFactory(chainId, bTokenAddress, useInfura)
  return bToken.isUnlocked(accountAddress, poolAddress)
}

export const getEstimatedFee = async (chainId, poolAddress, volume, symbolId, useInfura) => {
  let price = priceCache.get(poolAddress, symbolId)
  if (!price) {
    price = await getOraclePrice(poolAddress, symbolId)
    priceCache.set(poolAddress, symbolId, price)
  }
  let cache = fundingRateCache.get(chainId, poolAddress, symbolId)
  if (!cache || !cache.multiplier) {
    await _getFundingRate(chainId, poolAddress, symbolId, useInfura)
    cache = fundingRateCache.get(chainId, poolAddress, symbolId)
  }
  const { multiplier, feeRatio } = cache;
  //console.log(volume, price, multiplier, feeRatio)
  return bg(volume).abs().times(price).times(multiplier).times(feeRatio).toString()
}

export const getEstimatedMargin = async(
  chainId,
  poolAddress,
  accountAddress,
  volume,
  leverage,
  symbolId,
  useInfura,
) => {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
  const [price, symbolInfo ] = await Promise.all([
    getOraclePrice(poolAddress, symbolId),
    perpetualPool.getSymbol(symbolId),
  ])
  priceCache.set(poolAddress, symbolId, price)
  const {multiplier} = symbolInfo
  //console.log('m',multiplier.toString())
  return bg(volume).abs().times(price).times(multiplier).div(bg(leverage)).toString()
}

export const getFundingRateCache = async(chainId, poolAddress, symbolId) => {
  return fundingRateCache.get(chainId, poolAddress, symbolId)
}

const _getFundingRate = async(chainId, poolAddress, symbolId, useInfura) => {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  const poolconfigList = getFilteredPoolConfigList(poolAddress, null, symbolId)
  let bTokenIdList = poolconfigList.map((i) => i.bTokenId)
  let promiseList = []
  for (let i=0; i<bTokenIdList.length; i++) {
    promiseList.push(perpetualPool.getBToken(i))
  }
  const bTokenInfoList = await Promise.all(promiseList)
  //console.log('bTokenInfoList', bTokenInfoList[0].discount.toString(), bTokenInfoList[1].discount.toString())
  const liquidity = bTokenInfoList.reduce((accum, i) => accum.plus(bg(i.liquidity).times(i.discount).plus(i.pnl)), bg(0))
  //console.log('liquidity', liquidity.toString())

  const [price, symbolInfo, parameterInfo] = await Promise.all([
    getOraclePrice(poolAddress, symbolId),
    perpetualPool.getSymbol(symbolId),
    perpetualPool.getParameters(),
  ])
  priceCache.set(poolAddress, symbolId, price)
  const { multiplier, fundingRateCoefficient, tradersNetVolume, feeRatio } = symbolInfo;
  const { minPoolMarginRatio } = parameterInfo;
  const fundingRateArgs = [
    tradersNetVolume,
    price,
    multiplier,
    liquidity,
    fundingRateCoefficient,
  ]
  const fundingRatePerBlock = calculateFundingRate(...fundingRateArgs)
  const fundingRate = processFundingRate(chainId, fundingRatePerBlock)
  const liquidityUsedArgs = [
    tradersNetVolume,
    price,
    multiplier,
    liquidity,
    minPoolMarginRatio,
  ]
  const liquidityUsed = calculateLiquidityUsed(...liquidityUsedArgs)
  const res = {
    price,
    multiplier: multiplier.toString(),
    feeRatio: feeRatio.toString(),
    tradersNetVolume: tradersNetVolume.toString(),
    liquidity: liquidity.toString(),
    fundingRateCoefficient: fundingRateCoefficient.toString(),
    minPoolMarginRatio: minPoolMarginRatio.toString(),
    fundingRatePerBlock: fundingRatePerBlock,
    fundingRate: fundingRate,
    liquidityUsed: liquidityUsed,
  }
  fundingRateCache.set(chainId, poolAddress, symbolId, res)
  return res
}

export const getFundingRate = async (chainId, poolAddress, symbolId, useInfura) => {
  const res = await _getFundingRate(chainId, poolAddress, symbolId, useInfura)
  const { fundingRate, fundingRatePerBlock, liquidity, tradersNetVolume } = res
  return {
    fundingRate0: fundingRate.toString(),
    fundingRatePerBlock: fundingRatePerBlock.toString(),
    liquidity: liquidity.toString(),
    volume: '-',
    tradersNetVolume: tradersNetVolume.toString()
  };
}

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId,
  useInfura,
) => {
  let res = fundingRateCache.get(chainId, poolAddress, symbolId)
  if (!res) {
    res = _getFundingRate(chainId, poolAddress, symbolId, useInfura)
  }
  const args = [
    bg(res.tradersNetVolume).plus(newNetVolume).toString(),
    res.price,
    res.multiplier,
    res.liquidity,
    res.fundingRateCoefficient,
  ]
  let fundingRate1 = calculateFundingRate(...args)
  fundingRate1 = processFundingRate(chainId, fundingRate1)
  return {
    fundingRate1: fundingRate1.toString()
  }
}

export const getLiquidityUsed = async (
  chainId,
  poolAddress,
  symbolId,
  useInfura,
) => {
  let res = fundingRateCache.get(chainId, poolAddress, symbolId)
  if (!res) {
    res = _getFundingRate(chainId, poolAddress, symbolId, useInfura)
  }
  return {
    liquidityUsed0: res.liquidityUsed.toString(),
  };
};

export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId,
  useInfura,
) => {
  let res = fundingRateCache.get(chainId, poolAddress, symbolId)
  if (!res) {
    res = _getFundingRate(chainId, poolAddress, symbolId, useInfura)
  }
  const args = [
    bg(res.tradersNetVolume).plus(newNetVolume).toString(),
    res.price,
    res.multiplier,
    res.liquidity,
    res.minPoolMarginRatio,
  ]
  const liquidityUsed1 = calculateLiquidityUsed(...args)
  return {
    liquidityUsed1: liquidityUsed1.toString()
  }
}


export const getPoolBTokensBySymbolId = async(chainId, poolAddress, accountAddress, symbolId, useInfura) => {
  const bTokensConfigList = getFilteredPoolConfigList(poolAddress, null, symbolId)
  const symbolsConfigList = getFilteredPoolConfigList(poolAddress, '0')
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  const {pToken: pTokenAddress } = getPoolConfig(poolAddress, null, symbolId)
  const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
  let bTokenList = bTokensConfigList.map((i) => {
    return {bTokenId: i.bTokenId, bTokenSymbol: i.bTokenSymbol, bTokenAddress: i.bToken}
  })
  let promiseList = []
  for (let i=0; i<bTokenList.length; i++) {
    promiseList.push(bTokenFactory(chainId, bTokenList[i].bTokenAddress, useInfura).balanceOf(accountAddress))
  }
  const resultList = await Promise.all(promiseList)
  for (let i=0; i<bTokenList.length; i++) {
    bTokenList[i].walletBalance = resultList[i].toString()
  }

  let bTokenIdList = bTokensConfigList.map((i) => i.bTokenId)
  let symbolIdList = symbolsConfigList.map((i) => i.symbolId)
  //console.log('symbolIds', symbolIdList)
  const [margins, positions, parameterInfo] = await Promise.all([
    pToken.getMargins(accountAddress),
    pToken.getPositions(accountAddress),
    perpetualPool.getParameters(),
  ]);
  const { minInitialMarginRatio } = parameterInfo;
  //console.log('margins', margins[0].toString(), margins[1].toString())
  let promises = []
  for (let i=0; i<bTokenIdList.length; i++) {
    promises.push(perpetualPool.getBToken(bTokenIdList[i]))
  }
  const bTokens = await Promise.all(promises)
  const margin = bTokens.reduce((accum, a, index) => {
    return accum.plus(bg(a.price).times(a.discount).times(margins[index]))
  }, bg(0))
  //console.log('margin', margin.toString())
  promises = []
  for (let i=0; i<symbolIdList.length; i++) {
    promises.push(perpetualPool.getSymbol(bTokenIdList[i]))
  }
  const symbols = await Promise.all(promises)
  //console.log('symbols', symbols[0].price.toString(), symbols[0].multiplier.toString(), symbols[1].price.toString(), symbols[1].multiplier.toString())
  const marginHeld = symbols.reduce((accum, a, index) => {
    return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume).times(minInitialMarginRatio).abs())
  }, bg(0))
  //console.log('marginHeld', marginHeld.toString())
  bTokenList = bTokenList.map((i, index) => {
    i.availableBalance = margin.minus(marginHeld).div(bTokens[index].price).toString()
    return i
  })
  return bTokenList
}