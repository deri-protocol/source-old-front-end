import { perpetualPoolFactory } from '../factory';
import { getFilteredPoolConfigList } from '../config'
import { bTokenFactory } from '../../factory/contracts';

export const getSpecification = async (
  chainId,
  poolAddress,
  bTokenId,
  symbolId,
) => {
  const {symbol, bTokenSymbol } = getPoolConfig(DeriEnv.get(), poolAddress, bTokenId)
  const perpetualPool = perpetualPoolFactory(chainId, routerAddress);

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
    minPoolMarginRatio: minPoolMarginRatio.toString(),
    minInitialMarginRatio: minInitialMarginRatio.toString(),
    minMaintenanceMarginRatio: minMaintenanceMarginRatio.toString(),
    //minAddLiquidity: minAddLiquidity.toString(),
    //redemptionFeeRatio: redemptionFeeRatio.toString(),
    fundingRateCoefficient: fundingRateCoefficient.toString(),
    minLiquidationReward: minLiquidationReward.toString(),
    maxLiquidationReward: maxLiquidationReward.toString(),
    liquidationCutRatio: liquidationCutRatio.toString(),
    protocolFeeCollectRatio: protocolFeeCollectRatio.toString(),
  }
};

export const getPositionInfo = async (chainId, poolAddress, accountAddress, bTokenId, symbolId) => {
//  return {
//    volume: volume.toString(),
//    averageEntryPrice: calculateEntryPrice(volume, cost, multiplier).toString(),
//    margin: margin.toString(),
//    marginHeld: calculateMarginHeld(
//      price,
//      volume,
//      multiplier,
//      minInitialMarginRatio
//    ).toString(),
//    unrealizedPnl: calculatePnl(price, volume, multiplier, cost).toString(),
//    liquidationPrice: calculateLiquidationPrice(
//      volume,
//      margin,
//      cost,
//      multiplier,
//      minMaintenanceMarginRatio
//    ).toString(),
//  };
 return {
   volume: '-',
   averageEntryPrice: '-',
   margin: '-',
   marginHeld: '-',
   unrealizedPnl: '-',
   liquidationPrice: '-',
 };
}

export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
) => {
  return '-'
}

export const isUnlocked = async (chainId, poolAddress, accountAddress, bTokenId) => { 
  return false
}

export const getEstimatedFee = async (chainId, poolAddress, bTokenId, symbolId, volume) => {
  return '-'
}

export const getEstimatedMargin = async(chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  symbolId,
  volume,
  leverage
) => {
  return '-'
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
  bTokenId,
  symbolId,
  newNetVolume
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
  bTokenId,
  symbolId,
  newNetVolume
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

export const getPoolBTokensBySymbolId = async(chainId, poolAddress, symbolId) => {
  const poolconfigList = getFilteredPoolConfigList(chainId, poolAddress, null, symbolId)
  let bTokenList = poolconfigList.map((i) => {
    return {bTokenId: i.bTokenId, bTokenSymbol: i.bTokenSymbol}
  })
  bTokenList = bTokenList.map((i) => {
    i.walletBalance = '0',
    i.availableBalance = '0'
    return i
  })
  return bTokenList
}