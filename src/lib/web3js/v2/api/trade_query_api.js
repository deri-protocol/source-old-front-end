import { perpetualPoolFactory, bTokenFactory, pTokenFactory } from '../factory';
import { getFilteredPoolConfigList, getPoolConfig} from '../config'
import {
  calculateEntryPrice,
  calculateLiquidationPrice,
  calculateFundingRate,
  processFundingRate,
} from '../calculation';
import { getOraclePrice, bg, min, max } from '../utils'
import { fundingRateCache, priceCache } from '../api/api_globals';

export const getSpecification = async (
  chainId,
  poolAddress,
  bTokenId,
  symbolId,
  useInfura,
) => {
  try {
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
  } catch (err) {
    console.log(err)
  }
  return {
    symbol: '',
    bSymbol: '',
    multiplier: '',
    feeRatio: '',
    fundingRateCoefficient: '',
    minPoolMarginRatio: '',
    minInitialMarginRatio: '',
    minMaintenanceMarginRatio: '',
    minLiquidationReward: '',
    maxLiquidationReward: '',
    liquidationCutRatio: '',
    protocolFeeCollectRatio: '',
  }
};

export const getPositionInfo = async (chainId, poolAddress, accountAddress, symbolId, useInfura) => {
  try {
    const bTokenConfigList = getFilteredPoolConfigList(poolAddress, null, symbolId).sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
    const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId))
    const bTokenIdList = bTokenConfigList.map((i) => i.bTokenId)
    const symbolIdList = symbolConfigList.map((i) => i.symbolId)
    const symbolList = symbolConfigList.map((i) => i.symbol)
    //console.log('bTokenList', bTokenList)
    const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
    const {pToken: pTokenAddress, symbol } = getPoolConfig(poolAddress, null, symbolId)
    const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
    const [price, symbolInfo, parameterInfo, positionInfo, margins, positions ] = await Promise.all([
      //getOraclePrice(poolAddress, symbolId),
      getOraclePrice(chainId, symbol, useInfura),
      perpetualPool.getSymbol(symbolId),
      perpetualPool.getParameters(),
      pToken.getPosition(accountAddress, symbolId),
      pToken.getMargins(accountAddress),
      pToken.getPositions(accountAddress),
      //pToken.getMargin(accountAddress, symbolId),
    ])
    priceCache.set(poolAddress, symbolId, price)
    const { volume, cost } = positionInfo
    const { multiplier } = symbolInfo
    const {
      minInitialMarginRatio,
      minMaintenanceMarginRatio,
    } = parameterInfo
    let promises = []
    for (let i=0; i<bTokenIdList.length; i++) {
      promises.push(perpetualPool.getBToken(bTokenIdList[i]))
    }
    const bTokens = await Promise.all(promises)
    const margin = bTokens.reduce((accum, a, index) => {
      return accum.plus(bg(a.price).times(a.discount).times(margins[index]))
    }, bg(0))

    promises = []
    for (let i=0; i<symbolIdList.length; i++) {
      promises.push(perpetualPool.getSymbol(symbolIdList[i]))
    }
    const symbols = await Promise.all(promises)
    promises = []
    for (let i=0; i<symbolList.length; i++) {
      promises.push(getOraclePrice(chainId, symbolList[i], useInfura))
    }
    const symbolPrices = await Promise.all(promises)
    const marginHeld = symbols.reduce((accum, s, index) => {
      return accum.plus(bg(symbolPrices[index]).times(s.multiplier).times(positions[index].volume).times(minInitialMarginRatio).abs())
    }, bg(0))
    const marginHeldBySymbol = bg(volume).abs().times(multiplier).times(symbolPrices[symbolId]).times(minInitialMarginRatio)
    //console.log('margin', margin.toString(), marginHeld.toString())
    //
    //const unrealizedPnl = bg(positions[symbolId].volume).times(price).times(multiplier).minus(positions[symbolId].cost)
    const unrealizedPnl = symbols.reduce((accum, s, index) => {
      return accum.plus(bg(s.price).times(s.multiplier).times(positions[index].volume).minus(positions[index].cost))
    }, bg(0))
    const unrealizedPnlList = symbols.map((s, index) => {
      return [s.symbol, bg(s.price).times(s.multiplier).times(positions[index].volume).minus(positions[index].cost).toString()]
    })

    const totalCost = positions.reduce((accum, a) => {
      return accum.plus(bg(a.cost))
    }, bg(0))
    const dynamicCost = symbols.reduce((accum, a, index) => {
      if (index !== parseInt(symbolId)) {
        return accum.plus(bg(positions[index].volume).times(a.price).times(a.multiplier))
      } else {
        return accum
      }
    }, bg(0))
    //console.log('cost', costTotal.toString())
  return {
      price: symbolPrices[symbolId],
      volume: volume.toString(),
      averageEntryPrice: calculateEntryPrice(volume, cost, multiplier).toString(),
      margin: margin.toString(),
      marginHeld: marginHeld.toString(),
      marginHeldBySymbol: marginHeldBySymbol.toString(),
      unrealizedPnl: unrealizedPnl.toString(),
      unrealizedPnlList,
      liquidationPrice: calculateLiquidationPrice(
        volume,
        margin,
        totalCost,
        dynamicCost,
        multiplier,
        minMaintenanceMarginRatio
      ).toString(),
    };
  } catch(err) {
    console.log(err)
  }
  return {
    volume: '',
    averageEntryPrice: '',
    margin: '',
    marginHeld: '',
    unrealizedPnl: '',
    liquidationPrice: '',
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
  const {symbol} = getPoolConfig(poolAddress, null, symbolId)
  if (!price) {
    //price = await getOraclePrice(poolAddress, symbolId)
    price = await getOraclePrice(chainId, symbol, useInfura)
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
  const {symbol} = getPoolConfig(poolAddress, null, symbolId)
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura);
  const [price, symbolInfo ] = await Promise.all([
    //getOraclePrice(poolAddress, symbolId),
    getOraclePrice(chainId, symbol, useInfura),
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
  const poolConfigList = getFilteredPoolConfigList(poolAddress, null, symbolId).sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
  const {symbol} = getPoolConfig(poolAddress, null, symbolId)
  let bTokenIdList = poolConfigList.map((i) => i.bTokenId)
  let promiseList = []
  for (let i=0; i<bTokenIdList.length; i++) {
    promiseList.push(perpetualPool.getBToken(i))
  }
  const bTokenInfoList = await Promise.all(promiseList)
  const liquidity = bTokenInfoList.reduce((accum, i) => accum.plus(bg(i.liquidity).times(i.price).times(i.discount).plus(i.pnl)), bg(0))
  //const pnl = bTokenInfoList.reduce((accum, i) => accum.plus(i.pnl), bg(0))
  //console.log('pnl', pnl.toString())

  const [price, symbolInfo, parameterInfo ] = await Promise.all([
    //getOraclePrice(poolAddress, symbolId),
    getOraclePrice(chainId, symbol, useInfura),
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
  // const liquidityUsedArgs = [
  //   tradersNetVolume,
  //   price,
  //   multiplier,
  //   liquidity,
  //   minPoolMarginRatio,
  // ]
  const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId))
  let symbolIdList = symbolConfigList.map((i) => i.symbolId)
  let promises = []
  for (let i=0; i<symbolIdList.length; i++) {
    promises.push(perpetualPool.getSymbol(symbolIdList[i]))
  }
  const symbols = await Promise.all(promises)
  //console.log('margin', margin.toString(), marginHeld.toString())
  const liquidityUsedInAmount = symbols.reduce((accum, a) => {
    return accum.plus(bg(a.tradersNetVolume).times(a.price).times(a.multiplier).times(minPoolMarginRatio).abs())
  }, bg(0))

  //const liquidityUsed = liquidityUsedInAmount.div(liquidity)
  const res = {
    price,
    multiplier: multiplier.toString(),
    feeRatio: feeRatio.toString(),
    tradersNetVolume: tradersNetVolume.toString(),
    liquidity: liquidity.toString(),
    //pnl: pnl.toString(),
    fundingRateCoefficient: fundingRateCoefficient.toString(),
    minPoolMarginRatio: minPoolMarginRatio.toString(),
    fundingRatePerBlock: fundingRatePerBlock,
    fundingRate: fundingRate,
    liquidityUsed: liquidityUsedInAmount.div(liquidity)
  }
  fundingRateCache.set(chainId, poolAddress, symbolId, res)
  return res
}

export const getFundingRate = async (chainId, poolAddress, symbolId, useInfura) => {
  try {
    const res = await _getFundingRate(chainId, poolAddress, symbolId, useInfura)
    const { fundingRate, fundingRatePerBlock, liquidity, tradersNetVolume } = res
    return {
      fundingRate0: fundingRate.times(100).toString(),
      fundingRatePerBlock: fundingRatePerBlock.toString(),
      liquidity: liquidity.toString(),
      volume: '-',
      tradersNetVolume: tradersNetVolume.toString()
    };
  } catch(err) {
    console.log(err)
  }
  return {
    fundingRate0: '',
    fundingRatePerBlock: '',
    liquidity: '',
    volume: '',
    tradersNetVolume: '',
  };
}

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId,
  useInfura,
) => {
  try {
    let res = fundingRateCache.get(chainId, poolAddress, symbolId)
    if (!res) {
      res = await _getFundingRate(chainId, poolAddress, symbolId, useInfura)
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
      fundingRate1: fundingRate1.times(100).toString()
    }
  } catch(err) {
    console.log(err)
  }
  return {
    fundingRate1: '',
  }
}

export const getLiquidityUsed = async (
  chainId,
  poolAddress,
  symbolId,
  useInfura,
) => {
  try {
    let res = fundingRateCache.get(chainId, poolAddress, symbolId)
    if (!res) {
      res = await _getFundingRate(chainId, poolAddress, symbolId, useInfura)
    }
    return {
      liquidityUsed0: res.liquidityUsed.times(100).toString(),
    };
  } catch(err) {
    console.log(err)
  }
  return {
    liquidityUsed0: '',
  }
};

export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId,
  useInfura,
) => {
  try {
    let res = fundingRateCache.get(chainId, poolAddress, symbolId)
    if (!res) {
      res = await _getFundingRate(chainId, poolAddress, symbolId, useInfura)
    }
    const perpetualPool = perpetualPoolFactory(chainId, poolAddress, useInfura)
    // const {pToken: pTokenAddress } = getPoolConfig(poolAddress, null, symbolId)
    // const pToken = pTokenFactory(chainId, pTokenAddress, useInfura);
    // const { volume } = pToken.getPosition(accountAddress, symbolId);
    const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId))
    let symbolIdList = symbolConfigList.map((i) => i.symbolId)
    let promises = []
    for (let i=0; i<symbolIdList.length; i++) {
      promises.push(perpetualPool.getSymbol(symbolIdList[i]))
    }
    const symbols = await Promise.all(promises)
    let liquidityUsed0 = symbols.reduce((accum, a, index) => {
      if (index === parseInt(symbolId)) {
        return accum.plus(bg(a.price).times(a.multiplier).times(a.tradersNetVolume.plus(newNetVolume)).abs())
      } else {
        return accum.plus(bg(a.price).times(a.multiplier).times(a.tradersNetVolume).abs())
      }
    }, bg(0))
    //liquidityUsed0 = liquidityUsed0.times(res.minPoolMarginRatio)
    //const liquidityUsed = bg(newNetVolume).times(res.price).times(res.multiplier).times(res.minPoolMarginRatio).div(res.liquidity)
    const liquidityUsed1 = liquidityUsed0.times(res.minPoolMarginRatio).div(res.liquidity)
    return {
      liquidityUsed1: liquidityUsed1.times(100).toString()
    }
  } catch(err) {
    console.log(err)
  }
  return {
    liquidityUsed1: '',
  }
}


export const getPoolBTokensBySymbolId = async(chainId, poolAddress, accountAddress, symbolId, useInfura) => {
  try {
    const bTokensConfigList = getFilteredPoolConfigList(poolAddress, null, symbolId).sort((i, j) => parseInt(i.bTokenId) - parseInt(j.bTokenId))
    const symbolsConfigList = getFilteredPoolConfigList(poolAddress, '0').sort((i, j) => parseInt(i.symbolId) - parseInt(j.symbolId))
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
    const [margins, positions, parameterInfo] = await Promise.all([
      pToken.getMargins(accountAddress),
      pToken.getPositions(accountAddress),
      perpetualPool.getParameters(),
    ]);
    const { minInitialMarginRatio } = parameterInfo;

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
      promises.push(perpetualPool.getSymbol(symbolIdList[i]))
    }
    const symbols = await Promise.all(promises)
    const marginHeld = symbols.reduce((accum, a, index) => {
      return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume).abs().times(minInitialMarginRatio))
    }, bg(0))
    //console.log('marginHeld', marginHeld.toString())

    const pnl = symbols.reduce((accum, a, index) => {
      return accum.plus(bg(a.price).times(a.multiplier).times(positions[index].volume).minus(positions[index].cost))
    }, bg(0))
    //console.log('pnl', pnl.toString())

    bTokenList = bTokenList.map((i, index) => {
      if(!isNaN(parseFloat(bTokens[index].price)) || bTokens[index].price !== '0') {
        i.availableBalance = max(min(margin.minus(marginHeld).plus(pnl).div(bTokens[index].price).div(bTokens[index].discount), margins[index]), bg(0)).toString()
      } else {
        i.availableBalance = '-'
      }
      return i
    })
    return bTokenList
  } catch(err) {
    console.log(err)
  }
  return []
}
