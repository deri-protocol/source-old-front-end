import { bg, bTokenFactory, catchApiError, getPoolConfig, max } from "../../shared";
import { fundingRateCache, priceCache } from "../../shared/api/api_globals";
import { wrappedOracleFactory } from "../../shared/factory/oracle";
import { dynamicInitialMarginRatio, dynamicInitialPoolMarginRatio } from "../calculation/trade";
import { everlastingOptionFactory, everlastingOptionViewerFactory, pTokenOptionFactory } from "../factory";

export const getSpecification = async(chainId, poolAddress, symbolId) => {
  const args = [chainId, poolAddress, symbolId]
  return catchApiError(async(chainId, poolAddress, symbolId) => {
    const { bTokenSymbol } = getPoolConfig(poolAddress, '0', '0', 'option');
    const optionPool = everlastingOptionFactory(chainId, poolAddress)
    const [symbolInfo, parameterInfo] = await Promise.all([
      optionPool.getSymbol(symbolId),
      optionPool.getParameters(),
    ])
    const { symbol, multiplier, feeRatio } = symbolInfo;
    const {
      initialMarginRatio,
      maintenanceMarginRatio,
      minLiquidationReward,
      maxLiquidationReward,
      liquidationCutRatio,
      protocolFeeCollectRatio,
    } = parameterInfo;

    return {
      symbol,
      bTokenSymbol,
      multiplier: multiplier.toString(),
      feeRatio: feeRatio.toString(),
      //minPoolMarginRatio: minPoolMarginRatio.toString(),
      initialMarginRatio: initialMarginRatio.toString(),
      maintenanceMarginRatio: maintenanceMarginRatio.toString(),
      minLiquidationReward: minLiquidationReward.toString(),
      maxLiquidationReward: maxLiquidationReward.toString(),
      liquidationCutRatio: liquidationCutRatio.toString(),
      protocolFeeCollectRatio: protocolFeeCollectRatio.toString(),
    }
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
    const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress)
    const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
    const [symbolInfo, parameterInfo, position, margin, marginInfo ] = await Promise.all([
      optionPool.getSymbol(symbolId),
      optionPool.getParameters(),
      pToken.getPosition(accountAddress, symbolId),
      pToken.getMargin(accountAddress),
      poolViewer.getMarginStatusForTrader(poolAddress, accountAddress)
    ])
    const { dynamicMargin, initialMargin, maintenanceMargin } = marginInfo;
    const { initialMarginRatio } = parameterInfo
    const price = await wrappedOracleFactory(
      chainId,
      symbolInfo.oracleAddress,
    ).getPrice();
    const marginHeldBySymbol = bg(position.volume)
      .abs()
      .times(price)
      .times(symbolInfo.multiplier)
      .times(
        dynamicInitialMarginRatio(
          price,
          symbolInfo.strikePrice,
          symbolInfo.isCall,
          initialMarginRatio
        )
      );
    return {
      price,
      volume: position.volume.toString(),
      averageEntryPrice: '',
      margin: margin.toString(),
      marginHeld: initialMargin.toString(),
      marginHeldBySymbol: marginHeldBySymbol.toString(),
      unrealizedPnl: '',
      unrealizedPnlList: [],
      fundingFee: '',
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
      fundingFee: '',
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
  const [parameterInfo, liquidity, symbolIds] = await Promise.all([
    optionPool.getParameters(),
    optionPool.getLiquidity(),
    pToken.getActiveSymbolIds()
  ]);
  const currentSymbolIndex = symbolIds.indexOf(symbolId)
  if (currentSymbolIndex < 0) {
    throw new Error(`getFundingRate(): invalid symbolId(${symbolId}) for pool(${poolAddress})`)
  }
  const { initialMarginRatio } = parameterInfo;
  const symbols = await Promise.all(
    symbolIds.reduce((acc, i) => acc.concat([optionPool.getSymbol(i)]), [])
  );

  const prices = await Promise.all(
    symbols.reduce(
      (acc, s) =>
        acc.concat([wrappedOracleFactory(chainId, s.oracleAddress).getPrice()]),
      []
    )
  );

  const liquidityUsedInAmount = symbols.reduce((acc, s, index) => {
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
    symbols,
    liquidity,
    prices,
    liquidityUsed: liquidityUsedInAmount.div(liquidity)
  }
  fundingRateCache.set(chainId, poolAddress, symbolId, res)
  return res
};

export const getEstimatedFee = async(chainId, poolAddress, volume, symbolId) => {
  const args = [chainId, poolAddress, volume, symbolId]
  return catchApiError(
    async (chainId, poolAddress, volume, symbolId) => {
      const optionPool = everlastingOptionFactory(chainId, poolAddress);
      return '0.125';
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
  const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress);
  const [parameterInfo, liquidity, symbol] = await Promise.all([
    optionPool.getParameters(),
    optionPool.getLiquidity(),
    optionPool.getSymbol(symbolId),
  ]);
  const price = await wrappedOracleFactory(chainId, symbol.oracleAddress).getPrice()
  const { initialMarginRatio } = parameterInfo
  const marginRatio = dynamicInitialMarginRatio(price, symbol.strikePrice, symbol.isCall, initialMarginRatio)
  console.log(marginRatio, symbol.multiplier, price, volume)
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
      return {
        deltaFundingRate0: '0.125',
        premiumFundingRate0: '0.126',
        liquidity: '12345',
        volume: '-',
        tradersNetVolume: '321',
      };
    },
    args,
    'getFundingRate',
    {
      deltaFundingRate0: '',
      premiumFundingRate0: '',
      liquidity: '',
      volume: '',
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
      return {
        deltaFundingRate1: '0.128',
        premiumFundingRate1: '0.129',
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