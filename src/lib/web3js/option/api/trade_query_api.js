import { bg, bTokenFactory, catchApiError, getPoolConfig } from "../../shared";
import { fundingRateCache } from "../../shared/api/api_globals";
import { wrappedOracleFactory } from "../../shared/factory/oracle";
import { dynamicInitialMarginRatio, dynamicInitialPoolMarginRatio, getDeltaFundingRatePerSecond } from "../calculation/trade";
import { everlastingOptionFactory, everlastingOptionViewerFactory, pTokenOptionFactory } from "../factory";

const SECONDS_IN_A_DAY = 86400

export const getSpecification = async(chainId, poolAddress, symbolId) => {
  const args = [chainId, poolAddress, symbolId]
  return catchApiError(async(chainId, poolAddress, symbolId) => {
    const { bTokenSymbol } = getPoolConfig(poolAddress, '0', '0', 'option');
    const optionPool = everlastingOptionFactory(chainId, poolAddress)
    const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
    const [state, symbolInfo2, poolInfo2] = await Promise.all([
      poolViewer.getPoolStates(poolAddress, []),
      optionPool.getSymbol(symbolId),
      optionPool.getParameters(),
    ]);

    const { symbolState } = state
    const symbolIndex = symbolState.findIndex((s) => s.symbolId === symbolId);
    const symbolInfo = symbolState[symbolIndex]
    const { dynamicMarginRatio, deltaFundingCoefficient } = symbolInfo;
    const { symbol, multiplier, feeRatio } = symbolInfo2;
    const {
      initialMarginRatio,
      maintenanceMarginRatio,
      minLiquidationReward,
      maxLiquidationReward,
      liquidationCutRatio,
      protocolFeeCollectRatio,
    } = poolInfo2;

    return {
      symbol,
      bTokenSymbol,
      multiplier: multiplier.toString(),
      feeRatio: feeRatio.toString(),
      //minPoolMarginRatio: minPoolMarginRatio.toString(),
      initialMarginRatioOrigin: initialMarginRatio.toString(),
      initialMarginRatio: dynamicMarginRatio.toString(),
      maintenanceMarginRatioOrigin: maintenanceMarginRatio.toString(),
      maintenanceMarginRatio: bg(dynamicMarginRatio)
        .times(maintenanceMarginRatio)
        .div(initialMarginRatio)
        .toString(),
      minLiquidationReward: minLiquidationReward.toString(),
      maxLiquidationReward: maxLiquidationReward.toString(),
      liquidationCutRatio: liquidationCutRatio.toString(),
      protocolFeeCollectRatio: protocolFeeCollectRatio.toString(),
      deltaFundingCoefficient: deltaFundingCoefficient.toString(),
    };
  }, args, 'getSpecification', {
    symbol: '',
    bTokenSymbol: '',
    multiplier: '',
    feeRatio: '',
    //minPoolMarginRatio: '',
    initialMarginRatio: '',
    maintenanceMarginRatio: '',
    minLiquidationReward: '',
    maxLiquidationReward: '',
    liquidationCutRatio: '',
    protocolFeeCollectRatio: '',
  })
}


export const getPositionInfo = async(chainId, poolAddress, accountAddress, symbolId) => {
  const args = [chainId, poolAddress, accountAddress, symbolId]
  return catchApiError(async(chainId, poolAddress, accountAddress, symbolId) => {
    const optionPool = everlastingOptionFactory(chainId, poolAddress)
    //const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress)
    const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
    const [state] = await Promise.all([
      poolViewer.getTraderStates(poolAddress, accountAddress, [])
    ])
    const { poolState, symbolState, traderState, positionState } = state
    const { initialMarginRatio } = poolState;
    const { margin, totalPnl, initialMargin } = traderState;
    const symbolIndex = symbolState.findIndex((s) => s.symbolId === symbolId);
    const symbol = symbolState[symbolIndex]
    const position = positionState[symbolIndex]
    const price = await wrappedOracleFactory(
      chainId,
      symbol.oracleAddress,
    ).getPrice();
    const marginHeldBySymbol = bg(position.volume)
      .abs()
      .times(price)
      .times(symbol.multiplier)
      .times(
        dynamicInitialMarginRatio(
          price,
          symbol.strikePrice,
          symbol.isCall,
          initialMarginRatio
        )
      );
    return {
      price,
      volume: position.volume.toString(),
      averageEntryPrice: bg(position.volume).eq(0)
        ? '0'
        : bg(position.cost).div(position.volume).div(symbol.multiplier).toString(),
      margin: margin.toString(),
      marginHeld: initialMargin.toString(),
      marginHeldBySymbol: marginHeldBySymbol.toString(),
      unrealizedPnl: totalPnl,
      unrealizedPnlList: symbolState.map((s, index) => [
        s.symbol,
        positionState[index].pnl,
      ]),
      deltaFundingAccrued: positionState[symbolIndex].deltaFundingAccrued,
      premiumFundingAccrued: positionState[symbolIndex].premiumFundingAccrued,
      liquidationPrice: '',
    };
  }, args, 'getPositionInfo', {
      price: '',
      volume: '',
      averageEntryPrice: '',
      margin: '',
      marginHeld: '',
      marginHeldBySymbol: '',
      unrealizedPnl: '',
      unrealizedPnlList: [],
      deltaFundingAccrued: '',
      premiumFundingAccrued: '',
      liquidationPrice: '',
  })
}

export const getWalletBalance = async(chainId, poolAddress, accountAddress) => {
  const args = [chainId, poolAddress, accountAddress]
  return catchApiError(async(chainId, poolAddress, accountAddress) => {
    const { bToken:bTokenAddress } = getPoolConfig(poolAddress, '0', '0', 'option')
    const balance = await bTokenFactory(chainId, bTokenAddress).balanceOf(accountAddress)
    return balance.toString()
  }, args, 'getWalletBalance', '')
}

export const isUnlocked = async(chainId, poolAddress, accountAddress) => {
  const args = [chainId, poolAddress, accountAddress]
  return catchApiError(async(chainId, poolAddress, accountAddress) => {
    const { bToken:bTokenAddress } = getPoolConfig(poolAddress, '0', '0', 'option')
    const bToken = bTokenFactory(chainId, bTokenAddress)
    return await bToken.isUnlocked(accountAddress, poolAddress)
  }, args, 'isUnlocked', '')
}


const _getFundingRate = async (chainId, poolAddress, symbolId) => {
  const optionPool = everlastingOptionFactory(chainId, poolAddress);
  const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress);
  const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
  const [symbolIds, state] = await Promise.all([
    pToken.getActiveSymbolIds(),
    poolViewer.getPoolStates(poolAddress,[]),
  ]);
    const { poolState, symbolState } = state
    const {
      initialMarginRatio,
      totalDynamicEquity,
      liquidity,
    } = poolState;
  //console.log('tvMidPrice', tvMidPrice)
  const curSymbolIndex = symbolIds.indexOf(symbolId)
  if (curSymbolIndex < 0) {
    throw new Error(`getFundingRate(): invalid symbolId(${symbolId}) for pool(${poolAddress})`)
  }
  const symbol = symbolState[curSymbolIndex]
  // const symbols = await Promise.all(
  //   symbolIds.reduce((acc, i) => acc.concat([optionPool.getSymbol(i)]), [])
  // );

  const prices = await Promise.all(
    symbolState.reduce(
      (acc, s) =>
        acc.concat([wrappedOracleFactory(chainId, s.oracleAddress).getPrice()]),
      []
    )
  );
  
  const liquidityUsedInAmount = symbolState.reduce((acc, s, index) => {
    return acc.plus(
      bg(s.tradersNetVolume)
        .times(prices[index])
        .times(s.multiplier)
        .abs()
        .times(
          dynamicInitialPoolMarginRatio(
            prices[index],
            s.strikePrice,
            s.isCall,
            initialMarginRatio
          )
        )
    );
  }, bg(0));

  const res = {
    initialMarginRatio,
    symbolIds,
    symbols: symbolState,
    liquidity,
    totalDynamicEquity,
    prices,
    liquidityUsed: liquidityUsedInAmount.div(liquidity),
    deltaFundingRate: bg(symbol.deltaFundingRatePerSecond).times(SECONDS_IN_A_DAY).toString(),
    deltaFundingRatePerSecond: symbol.deltaFundingRatePerSecond,
    premiumFundingRate:bg(symbol.premiumFundingRatePerSecond).times(SECONDS_IN_A_DAY).toString(),
    premiumFundingRatePerSecond: symbol.premiumFundingRatePerSecond,
  }
  fundingRateCache.set(chainId, poolAddress, symbolId, res)
  return res
};

export const getEstimatedFee = async(chainId, poolAddress, volume, symbolId) => {
  const args = [chainId, poolAddress, volume, symbolId];
  return catchApiError(
    async (chainId, poolAddress, volume, symbolId) => {
      const optionPool = everlastingOptionFactory(chainId, poolAddress)
      const symbol = await optionPool.getSymbol(symbolId)
      let res = fundingRateCache.get(chainId, poolAddress, symbolId);
      if (!res) {
        res = await _getFundingRate(chainId, poolAddress, symbolId);
      }
      const { symbolIds, prices } = res;
      const curSymbolIndex = symbolIds.indexOf(symbolId)
      if (curSymbolIndex < 0) {
        throw new Error(`getEstimatedFee(): invalid symbolId(${symbolId}) for pool(${poolAddress})`)
      }
      //console.log(volume, prices[curSymbolIndex], symbols[curSymbolIndex])
      return bg(volume)
        .abs()
        .times(prices[curSymbolIndex])
        .times(symbol.multiplier)
        .times(symbol.feeRatio)
        .toString();
    },
    args,
    'getFundingFee',
    ''
  );
}

export const getEstimatedMargin = async(
  chainId,
  poolAddress,
  accountAddress,
  volume,
  leverage,
  symbolId,
) => {
  const optionPool = everlastingOptionFactory(chainId, poolAddress);
  //const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress);
  const [parameterInfo, symbol] = await Promise.all([
    optionPool.getParameters(),
    optionPool.getSymbol(symbolId),
  ]);
  const price = await wrappedOracleFactory(chainId, symbol.oracleAddress).getPrice()
  const { initialMarginRatio } = parameterInfo
  const marginRatio = dynamicInitialMarginRatio(price, symbol.strikePrice, symbol.isCall, initialMarginRatio)
  //console.log(marginRatio, symbol.multiplier, price, volume)
  return bg(volume)
    .abs()
    .times(price)
    .times(symbol.multiplier)
    .times(marginRatio);
}
export const getFundingRateCache = async(chainId, poolAddress, symbolId) => {
  return fundingRateCache.get(chainId, poolAddress, symbolId)
}

export const getFundingRate = async(chainId, poolAddress, symbolId) => {
  const args = [chainId, poolAddress, symbolId]
  return catchApiError(
    async (chainId, poolAddress, symbolId) => {
      const res = await _getFundingRate(chainId, poolAddress, symbolId);
      const curSymbolIndex = res.symbolIds.indexOf(symbolId)
      if (curSymbolIndex < 0) {
        throw new Error(`getEstimatedFee(): invalid symbolId(${symbolId}) for pool(${poolAddress})`)
      }
      return {
        deltaFundingRate0: bg(res.deltaFundingRate).times(100).toString(),
        deltaFundingRatePerSecond: res.deltaFundingRatePerSecond,
        premiumFundingRate0: bg(res.premiumFundingRate).times(100).toString(),
        premiumFundingRatePerSecond: res.premiumFundingRatePerSecond,
        liquidity: res.liquidity.toString(),
        volume: '-',
        tradersNetVolume: res.symbols[curSymbolIndex].tradersNetVolume,
      };
    },
    args,
    'getFundingRate',
    {
      deltaFundingRate0: '',
      deltaFundingRatePerSecond: '',
      premiumFundingRate0: '',
      premiumFundingRatePerSecond: '',
      liquidity: '',
      volume: '-',
      tradersNetVolume: '',
    }
  );
}

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId
) => {
  const args = [chainId, poolAddress, newNetVolume, symbolId];
  return catchApiError(
    async (chainId, poolAddress, newNetVolume, symbolId) => {
      let res = fundingRateCache.get(chainId, poolAddress, symbolId);
      if (!res) {
        res = await _getFundingRate(chainId, poolAddress, symbolId);
      }
      const { symbolIds, symbols, prices, totalDynamicEquity } = res;
      const curSymbolIndex = symbolIds.indexOf(symbolId)
      if (curSymbolIndex < 0) {
        throw new Error(`getEstimatedFee(): invalid symbolId(${symbolId}) for pool(${poolAddress})`)
      }
      let symbol = symbols[curSymbolIndex] 
      symbol.tradersNetVolume = bg(symbol.tradersNetVolume).plus(newNetVolume).toString()
      const deltaFundingRate1 = getDeltaFundingRatePerSecond(symbol, symbol.delta, prices[curSymbolIndex], totalDynamicEquity)

      return {
        deltaFundingRate1: bg(deltaFundingRate1).times(SECONDS_IN_A_DAY).times(100).toString(),
      };
    },
    args,
    'getEstimatedFundingRate',
    {
      deltaFundingRate1: '',
      premiumFundingRate1: '',
    }
  );
};

export const getLiquidityUsed = async (chainId, poolAddress, symbolId) => {
  const args = [chainId, poolAddress, symbolId];
  return catchApiError(
    async (chainId, poolAddress, symbolId) => {
      let res = fundingRateCache.get(chainId, poolAddress, symbolId);
      if (!res) {
        res = await _getFundingRate(chainId, poolAddress, symbolId);
      }
      return {
        liquidityUsed0: res.liquidityUsed.times(100).toString(),
      };
    },
    args,
    'getLiquidityUsed',
    {
      liquidityUsed0: '',
    }
  );
};

export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId
) => {
  const args = [chainId, poolAddress, newNetVolume, symbolId];
  return catchApiError(async (chainId, poolAddress, newNetVolume, symbolId) => {
    let res = fundingRateCache.get(chainId, poolAddress, symbolId);
    if (!res) {
      res = await _getFundingRate(chainId, poolAddress, symbolId);
    }
    const {symbolIds, symbols, prices, liquidity, initialMarginRatio } = res;

    const liquidityUsedInAmount = symbols.reduce((acc, s, index) => {
      if (symbolIds[index] == symbolId) {
        return acc.plus(
          bg(s.tradersNetVolume).plus(newNetVolume)
            .times(prices[index])
            .times(s.multiplier)
            .abs()
            .times(
              dynamicInitialPoolMarginRatio(
                prices[index],
                s.strikePrice,
                s.isCall,
                initialMarginRatio
              )
            )
        );
      } else {
        return acc.plus(
          bg(s.tradersNetVolume)
            .times(prices[index])
            .times(s.multiplier)
            .abs()
            .times(
              dynamicInitialPoolMarginRatio(
                prices[index],
                s.strikePrice,
                s.isCall,
                initialMarginRatio
              )
            )
        );
      }
    }, bg(0));
    return {
      liquidityUsed1: liquidityUsedInAmount.div(liquidity).times(100).toString()
    }
  }, args, 'getEstimatedLiquidityUsed', {
    liquidityUsed1: '',
  });
};