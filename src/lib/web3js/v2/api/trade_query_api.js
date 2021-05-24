import { perpetualPoolFactory, bTokenFactory, pTokenFactory } from '../factory';
import { getFilteredPoolConfigList, getPoolConfig} from '../config'
import {
  calculateEntryPrice,
  calculatePnl,
  calculateMarginHeld,
  calculateLiquidationPrice,
} from '../calculation'
import { getOraclePrice, bg } from '../utils'

export const getSpecification = async (
  chainId,
  poolAddress,
  bTokenId,
  symbolId,
  useInfura,
) => {
  const {symbol, bTokenSymbol } = getPoolConfig(poolAddress, bTokenId)
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

export const getPositionInfo = async (chainId, poolAddress, accountAddress, bTokenId, symbolId, useInfura) => {
  const {pToken: pTokenAddress } = getPoolConfig(poolAddress, bTokenId, symbolId)
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
  const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
  const [price, symbolInfo, parameterInfo, positionInfo, margin] = await Promise.all([
    getOraclePrice(poolAddress, symbolId),
    perpetualPool.getSymbol(symbolId),
    perpetualPool.getParameters(),
    pToken.getPosition(accountAddress, symbolId),
    pToken.getMargin(accountAddress, symbolId),
  ])
  const { volume, cost } = positionInfo
  const { multiplier } = symbolInfo
  const {
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
  } = parameterInfo
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

export const getEstimatedFee = async (chainId, poolAddress, volume, bTokenId, symbolId, useInfura) => {
  return '-'
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
  const {multiplier} = symbolInfo
  console.log('m',multiplier.toString())
  return bg(volume).abs().times(price).times(multiplier).div(bg(leverage)).toString()
}

export const getFundingRate = async (chainId, poolAddress, bTokenId, symbolId) => {
  return {
    fundingRate0: '0.00%-',
    fundingRatePerBlock: '-',
    liquidity: '-',
    volume: '-',
    tradersNetVolume: '-',
  };
}

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  bTokenId,
  symbolId,
) => {
  return {
    fundingRate1: '-',
  }
}

export const getLiquidityUsed = async (
  chainId,
  poolAddress,
  bTokenId,
  symbolId
) => {
  return {
    liquidityUsed0: '-',
  };
};

export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume,
  bTokenId,
  symbolId,
) => {
  return {
    liquidityUsed1: '-'
  }
}

export const getFundingRateCache = async(chainId, poolAddress, bTokenId, symbolId) => {
  return {
    price: '-',
    fundingRate: '-',
    liquidityUsed: '-',
  }
}

export const getPoolBTokensBySymbolId = async(chainId, poolAddress, accountAddress, symbolId, useInfura) => {
  const poolconfigList = getFilteredPoolConfigList(poolAddress, null, symbolId)
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
  let bTokenList = poolconfigList.map((i) => {
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
  bTokenList = bTokenList.map((i) => {
    i.availableBalance = '0'
    return i
  })
  return bTokenList
}