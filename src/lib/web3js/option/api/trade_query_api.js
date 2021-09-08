import {
  bg,
  bTokenFactory,
  catchApiError,
  deriToNatural,
  getPoolConfig,
} from '../../shared';
import { fundingRateCache } from '../../shared/api/api_globals';
import { normalizeOptionSymbol } from '../../shared/config/token';
import { wrappedOracleFactory } from '../../shared/factory/oracle';
import {
  getOraclePricesForOption,
  getPriceFromRest,
  getOracleVolatilitiesForOption,
} from '../../shared/utils/oracle';
import { queryTradePMM } from '../calculation/PMM2';
import {
  dynamicInitialMarginRatio,
  dynamicInitialPoolMarginRatio,
  getAverageEntryPrice,
  //getDeltaFundingPerSecond,
  getIntrinsicPrice,
  getLiquidationPrice,
  getLiquidationPrices,
  getMarginHeldBySymbol,
} from '../calculation/trade';
import { everlastingOptionFactory } from '../factory/pool';
import { volatilitiesCache } from '../utils';
import { getIndexInfo } from '../../shared/config/token';

//
const SECONDS_IN_A_DAY = 86400;

export const getSpecification = async (chainId, poolAddress, symbolId) => {
  const args = [chainId, poolAddress, symbolId];
  return catchApiError(
    async (chainId, poolAddress, symbolId) => {
      const { bTokenSymbol } = getPoolConfig(poolAddress, '0', '0', 'option');
      const optionPool = everlastingOptionFactory(chainId, poolAddress);
      await optionPool._updateConfig();
      const [symbolInfo2, poolInfo2] = await Promise.all([
        optionPool.getSymbol(symbolId),
        optionPool.getParameters(),
      ]);

      const symbols = optionPool.activeSymbols;
      const [symbolPrices, symbolVolatilities] = await Promise.all([
        getOraclePricesForOption(
          chainId,
          symbols.map((s) => s.symbol)
        ),
        volatilitiesCache.get(
          poolAddress,
          symbols.map((s) => s.symbol)
        ),
      ]);
      const state = await optionPool.viewer.getPoolStates(
        poolAddress,
        symbolPrices,
        symbolVolatilities
      );
      const { symbolState } = state;
      const symbolIndex = symbolState.findIndex((s) => s.symbolId === symbolId);
      const symbolInfo = symbolState[symbolIndex];
      const { dynamicMarginRatio, isCall } =
        symbolInfo;
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
        isCall: isCall,
        indexConstituents: getIndexInfo(symbol),
      };
    },
    args,
    'getSpecification',
    {
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
      indexConstituents: { url: '', tokens: [] },
    }
  );
};

export const getPositionInfo = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId
) => {
  const args = [chainId, poolAddress, accountAddress, symbolId];
  return catchApiError(
    async (chainId, poolAddress, accountAddress, symbolId) => {
      const { symbol: symbolStr } = getPoolConfig(
        poolAddress,
        undefined,
        symbolId,
        'option'
      );
      const optionPool = everlastingOptionFactory(chainId, poolAddress);
      await optionPool._updateConfig();
      //const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress)
      //const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
      const symbols = optionPool.activeSymbols;
      let symbolPrices = [],
        symbolVolatilities = [],
        volPrice;
      if (symbols && symbols.length > 0) {
        [symbolPrices, symbolVolatilities, volPrice] = await Promise.all([
          getOraclePricesForOption(
            chainId,
            symbols.map((s) => s.symbol)
          ),
          volatilitiesCache.get(
            poolAddress,
            symbols.map((s) => s.symbol)
          ),
          getPriceFromRest(`VOL-${normalizeOptionSymbol(symbolStr)}`, 'option'),
        ]);
      }
      const state = await optionPool.viewer.getTraderStates(
        poolAddress,
        accountAddress,
        symbolPrices,
        symbolVolatilities
      );
      const { poolState, symbolState, traderState, positionState } = state;
      const { initialMarginRatio } = poolState;
      const { margin, totalPnl, initialMargin } = traderState;
      const symbolIndex = symbolState.findIndex((s) => s.symbolId === symbolId);
      const symbol = symbolState[symbolIndex];
      const position = positionState[symbolIndex];
      const price = await wrappedOracleFactory(
        chainId,
        symbol.oracleAddress
      ).getPrice();
      return {
        symbolId,
        symbol: symbolStr,
        price,
        strikePrice: symbol.strikePrice.toString(),
        timePrice: symbol.timeValue.toString(),
        markPrice: symbol.dpmmPrice.toString(),
        volume: bg(position.volume).times(symbol.multiplier).toString(),
        averageEntryPrice: getAverageEntryPrice(position, symbol),
        margin: margin.toString(),
        marginHeld: initialMargin.toString(),
        marginHeldBySymbol: getMarginHeldBySymbol(
          position.volume,
          price,
          symbol,
          initialMarginRatio
        ).toString(),
        unrealizedPnl: totalPnl,
        unrealizedPnlList: symbolState
          .filter((s, index) => positionState[index].pnl !== '0')
          .map((s) => [s.symbol, positionState[symbolState.findIndex((oS) => oS.symbolId === s.symbolId)].pnl]),
        premiumFundingAccrued: positionState[symbolIndex].fundingAccrued,
        isCall: symbol.isCall,
        volatility: bg(volPrice).times(100).toString(),
        liquidationPrice: getLiquidationPrice(state, symbolId),
      };
    },
    args,
    'getPositionInfo',
    {
      price: '',
      strikePrice: '',
      timePrice: '',
      volume: '',
      averageEntryPrice: '',
      margin: '',
      marginHeld: '',
      marginHeldBySymbol: '',
      unrealizedPnl: '',
      unrealizedPnlList: [],
      premiumFundingAccrued: '',
      liquidationPrice: '',
      volatility: '',
    }
  );
};

export const getPositionInfos = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const args = [chainId, poolAddress, accountAddress];
  return catchApiError(
    async (chainId, poolAddress, accountAddress) => {
      const optionPool = everlastingOptionFactory(chainId, poolAddress);
      await optionPool._updateConfig();
      //const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress)
      //const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
      const symbols = optionPool.activeSymbols;
      const [symbolPrices, symbolVolatilities, volPrices] = await Promise.all([
        getOraclePricesForOption(
          chainId,
          symbols.map((s) => s.symbol)
        ),
        volatilitiesCache.get(
          poolAddress,
          symbols.map((s) => s.symbol)
        ),
        getOracleVolatilitiesForOption(symbols.map((s) => s.symbol)),
      ]);
      const state = await optionPool.viewer.getTraderStates(
        poolAddress,
        accountAddress,
        symbolPrices,
        symbolVolatilities
      );
      const { poolState, traderState, positionState, symbolState } = state;
      const { initialMarginRatio } = poolState;
      const { margin, initialMargin } = traderState;
      const prices = await Promise.all(
        symbols.reduce(
          (acc, s) =>
            acc.concat([
              wrappedOracleFactory(chainId, s.oracleAddress).getPrice(),
            ]),
          []
        )
      );

      const liquidationPrices = getLiquidationPrices(state);
      return symbols
        .filter((s) => positionState[s.symbolId].volume !== '0')
        .map((s) => {
          const vIndex = symbolState.findIndex(
            (oS) => oS.symbolId === s.symbolId
          );
          return {
            symbolId: s.symbolId,
            symbol: s.symbol,
            price: prices[vIndex],
            // strikePrice: s.strikePrice.toString(),
            // timePrice: s.timeValue.toString(),
            volume: bg(positionState[vIndex].volume)
              .times(symbolState[vIndex].multiplier)
              .toString(),
            averageEntryPrice: getAverageEntryPrice(positionState[vIndex], s),
            margin: margin.toString(),
            marginHeld: initialMargin.toString(),
            marginHeldBySymbol: getMarginHeldBySymbol(
              positionState[vIndex].volume,
              prices[vIndex],
              s,
              initialMarginRatio
            ).toString(),
            unrealizedPnl: positionState[vIndex].pnl,
            premiumFundingAccrued: positionState[vIndex].fundingAccrued,
            isCall: s.isCall,
            volatility: deriToNatural(volPrices[vIndex]).times(100).toString(),
            liquidationPrice: liquidationPrices,
          };
        });
    },
    args,
    'getPositionInfos',
    []
  );
};

export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const args = [chainId, poolAddress, accountAddress];
  return catchApiError(
    async (chainId, poolAddress, accountAddress) => {
      const { bToken: bTokenAddress } = getPoolConfig(
        poolAddress,
        '0',
        '0',
        'option'
      );
      const balance = await bTokenFactory(chainId, bTokenAddress).balanceOf(
        accountAddress
      );
      return balance.toString();
    },
    args,
    'getWalletBalance',
    ''
  );
};

export const isUnlocked = async (chainId, poolAddress, accountAddress) => {
  const args = [chainId, poolAddress, accountAddress];
  return catchApiError(
    async (chainId, poolAddress, accountAddress) => {
      const { bToken: bTokenAddress } = getPoolConfig(
        poolAddress,
        '0',
        '0',
        'option'
      );
      const bToken = bTokenFactory(chainId, bTokenAddress);
      return await bToken.isUnlocked(accountAddress, poolAddress);
    },
    args,
    'isUnlocked',
    ''
  );
};

const _getFundingRate = async (chainId, poolAddress, symbolId) => {
  //const { symbol } = getPoolConfig(poolAddress, undefined, symbolId, 'option')
  const optionPool = everlastingOptionFactory(chainId, poolAddress);
  await optionPool._updateConfig();
  //const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress);
  //const poolViewer = everlastingOptionViewerFactory(chainId, optionPool.viewerAddress)
  const symbols = optionPool.activeSymbols;
  const [symbolPrices, symbolVolatilities] = await Promise.all([
    getOraclePricesForOption(
      chainId,
      symbols.map((s) => s.symbol)
    ),
    volatilitiesCache.get(
      poolAddress,
      symbols.map((s) => s.symbol)
    ),
  ]);
  const state = await optionPool.viewer.getPoolStates(
    poolAddress,
    symbolPrices,
    symbolVolatilities
  );
  const { poolState, symbolState } = state;
  const { initialMarginRatio, totalDynamicEquity, liquidity } = poolState;
  const curSymbolIndex = optionPool.activeSymbolIds.indexOf(symbolId);
  if (curSymbolIndex < 0) {
    throw new Error(
      `getFundingRate(): invalid symbolId(${symbolId}) for pool(${poolAddress})`
    );
  }
  const symbolInfo = symbolState[curSymbolIndex];

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
    symbolIds: optionPool.activeSymbolIds,
    symbols: symbolState,
    liquidity,
    totalDynamicEquity,
    prices,
    liquidityUsed: bg(liquidity).eq(0) ? bg(0) : liquidityUsedInAmount.div(liquidity),
    premiumFunding: bg(symbolInfo.fundingPerSecond)
      .div(symbolInfo.multiplier)
      .times(SECONDS_IN_A_DAY)
      .toString(),
    premiumFundingPerSecond: bg(symbolInfo.fundingPerSecond).div(
      symbolInfo.multiplier
    ),
  };
  return res;
};

export const getEstimatedFee = async (
  chainId,
  poolAddress,
  volume,
  symbolId
) => {
  const args = [chainId, poolAddress, volume, symbolId];
  return catchApiError(
    async (chainId, poolAddress, volume, symbolId) => {
      const optionPool = everlastingOptionFactory(chainId, poolAddress);
      const symbolInfo = await optionPool.getSymbol(symbolId);
      let res = fundingRateCache.get(chainId, poolAddress, symbolId);
      if (!res) {
        res = await _getFundingRate(chainId, poolAddress, symbolId);
      }
      const { symbolIds, prices, symbols } = res;
      const curSymbolIndex = symbolIds.indexOf(symbolId);
      if (curSymbolIndex < 0) {
        throw new Error(
          `getEstimatedFee(): invalid symbolId(${symbolId}) for pool(${poolAddress})`
        );
      }
      const symbol = symbols[curSymbolIndex];
      const intrinsicPrice = getIntrinsicPrice(
        prices[curSymbolIndex],
        symbol.strikePrice,
        symbol.isCall
      );
      //console.log(volume, prices[curSymbolIndex], symbol, intrinsicPrice.toString())
      return bg(volume)
        .abs()
        .times(intrinsicPrice.plus(symbol.timeValue))
        .times(symbol.multiplier)
        .times(symbolInfo.feeRatio)
        .toString();
    },
    args,
    'getFundingFee',
    ''
  );
};

export const getEstimatedMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  volume,
  leverage,
  symbolId
) => {
  const optionPool = everlastingOptionFactory(chainId, poolAddress);
  //const pToken = pTokenOptionFactory(chainId, optionPool.pTokenAddress);
  const [parameterInfo, symbol] = await Promise.all([
    optionPool.getParameters(),
    optionPool.getSymbol(symbolId),
  ]);
  const price = await wrappedOracleFactory(
    chainId,
    symbol.oracleAddress
  ).getPrice();
  const { initialMarginRatio } = parameterInfo;
  const marginRatio = dynamicInitialMarginRatio(
    price,
    symbol.strikePrice,
    symbol.isCall,
    initialMarginRatio
  );
  //console.log(marginRatio, symbol.multiplier, price, volume)
  return bg(volume)
    .abs()
    .times(price)
    .times(symbol.multiplier)
    .times(marginRatio);
};
export const getFundingRateCache = async (chainId, poolAddress, symbolId) => {
  return fundingRateCache.get(chainId, poolAddress, symbolId);
};

export const getFundingRate = async (chainId, poolAddress, symbolId) => {
  const args = [chainId, poolAddress, symbolId];
  return catchApiError(
    async (chainId, poolAddress, symbolId) => {
      const res = await _getFundingRate(chainId, poolAddress, symbolId);
      fundingRateCache.set(chainId, poolAddress, symbolId, res);
      const curSymbolIndex = res.symbolIds.indexOf(symbolId);
      if (curSymbolIndex < 0) {
        throw new Error(
          `getEstimatedFee(): invalid symbolId(${symbolId}) for pool(${poolAddress})`
        );
      }
      return {
        premiumFunding0: bg(res.premiumFunding).toString(),
        premiumFundingPerSecond: res.premiumFundingPerSecond.toString(),
        liquidity: res.liquidity.toString(),
        volume: '-',
        tradersNetVolume: res.symbols[curSymbolIndex].tradersNetVolume,
      };
    },
    args,
    'getFundingRate',
    {
      premiumFunding0: '',
      premiumFundingPerSecond: '',
      liquidity: '',
      volume: '-',
      tradersNetVolume: '',
    }
  );
};

export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId
) => {
  const args = [chainId, poolAddress, newNetVolume, symbolId];
  return catchApiError(
    async () => {
      // let res = fundingRateCache.get(chainId, poolAddress, symbolId);
      // if (!res) {
      //   res = await _getFundingRate(chainId, poolAddress, symbolId);
      //   fundingRateCache.set(chainId, poolAddress, symbolId, res);
      // }
      // const { symbolIds, symbols, prices, totalDynamicEquity } = res;
      // const curSymbolIndex = symbolIds.indexOf(symbolId);
      // if (curSymbolIndex < 0) {
      //   throw new Error(
      //     `getEstimatedFee(): invalid symbolId(${symbolId}) for pool(${poolAddress})`
      //   );
      // }
      // let symbol = symbols[curSymbolIndex];
      // //console.log('symbol.tradersNetVolume0', symbol.tradersNetVolume)
      // //symbol.tradersNetVolume = bg(symbol.tradersNetVolume).plus(newNetVolume).toString()
      // //console.log('symbol.tradersNetVolume1', symbol.tradersNetVolume)
      // const deltaFunding1 = getdeltaFundingPerSecond(
      //   symbol,
      //   symbol.delta,
      //   prices[curSymbolIndex],
      //   totalDynamicEquity,
      //   newNetVolume
      // );

      return {
        // deltaFunding1: bg(deltaFunding1)
        //   .div(symbol.multiplier)
        //   .times(SECONDS_IN_A_DAY)
        //   .toString(),
      };
    },
    args,
    'getEstimatedFundingRate',
    {
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
        fundingRateCache.set(chainId, poolAddress, symbolId, res);
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
  return catchApiError(
    async (chainId, poolAddress, newNetVolume, symbolId) => {
      let res = fundingRateCache.get(chainId, poolAddress, symbolId);
      if (!res) {
        res = await _getFundingRate(chainId, poolAddress, symbolId);
        fundingRateCache.set(chainId, poolAddress, symbolId, res);
      }
      const { symbolIds, symbols, prices, liquidity, initialMarginRatio } = res;

      const liquidityUsedInAmount = symbols.reduce((acc, s, index) => {
        if (symbolIds[index] == symbolId) {
          return acc.plus(
            bg(s.tradersNetVolume)
              .plus(newNetVolume)
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
        liquidityUsed1: bg(liquidity).eq(0) ? '0' : liquidityUsedInAmount
          .div(liquidity)
          .times(100)
          .toString(),
      };
    },
    args,
    'getEstimatedLiquidityUsed',
    {
      liquidityUsed1: '',
    }
  );
};

export const getEstimatedTimePrice = (
  chainId,
  poolAddress,
  newNetVolume,
  symbolId
) => {
  const args = [chainId, poolAddress, newNetVolume, symbolId];
  return catchApiError(
    async (chainId, poolAddress, newNetVolume, symbolId) => {
      const optionPool = everlastingOptionFactory(chainId, poolAddress);
      await optionPool._updateConfig();
      const symbolVolatilities = await volatilitiesCache.get(
        poolAddress,
        optionPool.activeSymbols.map((s) => s.symbol)
      );
      const state = await optionPool.viewer.getPoolStates(
        poolAddress,
        [],
        symbolVolatilities
      );
      const { symbolState } = state;

      //const { liquidity } = poolState;
      const index = symbolState.findIndex((s) => s.symbolId === symbolId);
      if (index > -1) {
        const {
          tradersNetVolume,
          multiplier,
          intrinsicValue,
          timeValue,
          K,
        } = symbolState[index];
        //console.log(tradersNetVolume, multiplier, liquidity, quoteBalanceOffset, timePrice, K)
        const args = [
          bg(tradersNetVolume).times(multiplier).toNumber(),
          bg(intrinsicValue).plus(timeValue).toNumber(),
          bg(K).toNumber(),
          bg(newNetVolume).times(multiplier).toNumber(),
        ]

        const res = queryTradePMM(...args);
        //console.log('res', res)
        return bg(res).div(newNetVolume).div(multiplier).toString();
      } else {
        console.log(
          `invalid symbolId(${symbolId}) for the pool(${poolAddress})`
        );
        return '';
      }
    },
    args,
    'getEstimatedMarkPrice',
    ''
  );
};
