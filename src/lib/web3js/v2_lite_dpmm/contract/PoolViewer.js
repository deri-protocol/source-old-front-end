import { bg, max, min } from '../../shared/utils';
import { checkSymbolId } from '../../shared/utils/derijsnext';
import { contractFactory } from '../../shared/utils/index.js';
import { getIndexInfo, SECONDS_IN_A_DAY } from '../../shared/config';
import { getOraclePriceFromCache2 } from '../../shared/utils/oracle';
import { calculateLiquidationPrice } from '../../v2/calculation';
import { perpetualPoolLiteDpmmFactory} from './factory';

export class PoolViewer {
  constructor(chainId, poolAddress) {
    this.chainId = chainId;
    this.poolAddress = poolAddress;
    this.pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
  }
  async init(isEstimatedApi) {
    await this.pool.init(isEstimatedApi);
  }

  // =================
  //  api
  // =================
  async getLiquidityInfo(accountAddress) {
    await this.init();
    const pool = this.pool;
    const lToken = pool.lToken;
    const [liquidity, lTokenBalance, lTokenTotalSupply] = await Promise.all([
      pool.getPoolLiquidity(),
      lToken.balanceOf(accountAddress),
      lToken.totalSupply(),
    ]);
    const { poolMarginRatio } = pool.parameters;
    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const poolDynamicEquity = await pool.getDynamicEquity();
    const shareValue = bg(lTokenTotalSupply).eq(0)
      ? '0'
      : bg(poolDynamicEquity).div(lTokenTotalSupply).toString();

    const value = pool.symbols.reduce((acc, s) => {
      return acc.plus(
        bg(s.tradersNetVolume).times(s.multiplier).times(s.dpmmPrice)
      );
    }, bg(0));
    const removable = bg(poolDynamicEquity).minus(
      bg(value).times(poolMarginRatio)
    );
    return {
      totalSupply: lTokenTotalSupply,
      poolLiquidity: liquidity,
      shares: lTokenBalance,
      shareValue,
      maxRemovableShares: max(
        min(
          bg(lTokenBalance),
          bg(shareValue).eq(0) ? '0' : removable.div(shareValue)
        ),
        bg(0)
      ),
    };
  }

  async getSpecification(symbolId) {
    await this.init();
    const pool = this.pool;

    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const symbolIndex = checkSymbolId(symbolId, pool.activeSymbolIds);
    const symbolInfo = pool.symbols[symbolIndex];

    const { symbol, multiplier, feeRatio } = symbolInfo;
    const parameterInfo = pool.parameters;
    return {
      symbol,
      bTokenSymbol: pool.bTokenSymbol,
      multiplier,
      feeRatio,
      fundingRateCoefficient: '',
      minPoolMarginRatio: parameterInfo.poolMarginRatio,
      minInitialMarginRatio: parameterInfo.initialMarginRatio,
      minMaintenanceMarginRatio: parameterInfo.maintenanceMarginRatio,
      minLiquidationReward: parameterInfo.minLiquidationReward,
      maxLiquidationReward: parameterInfo.maxLiquidationReward,
      liquidationCutRatio: parameterInfo.liquidationCutRatio,
      protocolFeeCollectRatio: parameterInfo.protocolFeeCollectRatio,
      indexConstituents: getIndexInfo(symbol),
    };
  }

  async getPositionInfo(accountAddress, symbolId) {
    await this.init();
    const pool = this.pool;
    const { initialMarginRatio, maintenanceMarginRatio } = pool.parameters;
    const symbolIndex = pool.activeSymbolIds.indexOf(symbolId);
    if (symbolIndex > -1) {
      const oracleAddress =
        pool.offChainOracleSymbolIds.indexOf(symbolId) > -1
          ? ''
          : pool.symbols[symbolIndex].oracleAddress;
      const [
        symbols,
        positions,
        lastTimestamp,
        margin,
        fundingPeriod,
        price,
      ] = await Promise.all([
        pool.getSymbols(),
        pool.getPositions(accountAddress),
        pool.getLastTimestamp(),
        pool.pToken.getMargin(accountAddress),
        pool.getFundingPeriod(),
        getOraclePriceFromCache2.get(
          this.chainId,
          pool.symbols[symbolIndex].symbol,
          oracleAddress
        ),
      ]);

      const symbol = symbols[symbolIndex];
      const position = positions[symbolIndex];
      // const { volume } = position
      // const { multiplier, indexPrice } = symbol
      const marginHeld = symbols.reduce((acc, s, index) => {
        return acc.plus(
          bg(s.indexPrice)
            .times(s.multiplier)
            .times(positions[index].volume)
            .times(initialMarginRatio)
            .abs()
        );
      }, bg(0));
      const marginHeldBySymbol = bg(position.volume)
        .times(symbol.multiplier)
        .times(symbol.indexPrice)
        .times(initialMarginRatio)
        .abs();

      const unrealizedPnl = symbols.reduce((acc, s, index) => {
        return acc.plus(
          bg(s.dpmmPrice)
            .times(s.multiplier)
            .times(positions[index].volume)
            .minus(positions[index].cost)
        );
      }, bg(0));
      const unrealizedPnlList = symbols.map((s, index) => {
        return [
          s.symbol,
          bg(s.dpmmPrice)
            .times(s.multiplier)
            .times(positions[index].volume)
            .minus(positions[index].cost)
            .toString(),
        ];
      });
      const totalCost = positions.reduce((acc, p) => acc.plus(p.cost), bg(0));
      const dynamicCost = symbols.reduce((acc, s, index) => {
        if (index !== parseInt(symbolId)) {
          return acc.plus(
            bg(positions[index].volume).times(s.dpmmPrice).times(s.multiplier)
          );
        } else {
          return acc;
        }
      }, bg(0));
      const fundingFee = bg(symbol.cumulativeFundingRate)
        .minus(position.lastCumulativeFundingRate)
        .plus(
          bg(symbol.dpmmPrice)
            .minus(symbol.indexPrice)
            .times(symbol.multiplier)
            .div(fundingPeriod)
            .times(bg(Math.floor(Date.now() / 1000)).minus(lastTimestamp))
        )
        .times(position.volume)
        .toString();

      //console.log(position.volume, margin, totalCost.toString(), dynamicCost.toString(), symbol.multiplier, maintenanceMarginRatio)
      return {
        price: price,
        volume: bg(position.volume).times(symbol.multiplier).toString(),
        averageEntryPrice: bg(position).eq(0)
          ? '0'
          : bg(position.cost)
              .div(position.volume)
              .div(symbol.multiplier)
              .toString(),
        margin: margin,
        marginHeld: marginHeld.toString(),
        marginHeldBySymbol: marginHeldBySymbol.toString(),
        unrealizedPnl: unrealizedPnl.toString(),
        unrealizedPnlList,
        fundingFee,
        liquidationPrice: calculateLiquidationPrice(
          position.volume,
          margin,
          totalCost,
          dynamicCost,
          symbol.multiplier,
          maintenanceMarginRatio
        ),
      };
    }
  }

  async getPositionInfos(accountAddress) {
    await this.init();
    const pool = this.pool;
    const { initialMarginRatio, maintenanceMarginRatio } = pool.parameters;
    const [
      symbols,
      positions,
      lastTimestamp,
      margin,
      fundingPeriod,
    ] = await Promise.all([
      pool.getSymbols(),
      pool.getPositions(accountAddress),
      pool.getLastTimestamp(),
      pool.pToken.getMargin(accountAddress),
      pool.getFundingPeriod(),
    ]);
    const totalCost = positions.reduce((acc, p) => acc.plus(p.cost), bg(0));

    return positions.map((p, index) => {
      const symbolIndex = index;
      const symbol = symbols[symbolIndex];
      const position = positions[symbolIndex];
      // const { volume } = position
      // const { multiplier, indexPrice } = symbol
      const marginHeld = symbols.reduce((acc, s, index) => {
        return acc.plus(
          bg(s.indexPrice)
            .times(s.multiplier)
            .times(positions[index].volume)
            .times(initialMarginRatio)
            .abs()
        );
      }, bg(0));
      const marginHeldBySymbol = bg(position.volume)
        .times(symbol.multiplier)
        .times(symbol.indexPrice)
        .times(initialMarginRatio)
        .abs();
      const unrealizedPnl = bg(symbol.dpmmPrice).times(symbol.multiplier).times(p.volume).minus(p.cost)
      const dynamicCost = symbols.reduce((acc, s, idx) => {
        if (idx !== index) {
          return acc.plus(
            bg(positions[idx].volume).times(s.dpmmPrice).times(s.multiplier)
          );
        } else {
          return acc;
        }
      }, bg(0));
      const fundingFee = bg(symbol.cumulativeFundingRate)
        .minus(position.lastCumulativeFundingRate)
        .plus(
          bg(symbol.dpmmPrice)
            .minus(symbol.indexPrice)
            .times(symbol.multiplier)
            .div(fundingPeriod)
            .times(bg(Math.floor(Date.now() / 1000)).minus(lastTimestamp))
        )
        .times(position.volume)
        .toString();
      return {
        price: symbol.indexPrice,
        volume: bg(position.volume).times(symbol.multiplier).toString(),
        averageEntryPrice: bg(position).eq(0)
          ? '0'
          : bg(position.cost)
              .div(position.volume)
              .div(symbol.multiplier)
              .toString(),
        margin: margin,
        marginHeld: marginHeld.toString(),
        marginHeldBySymbol: marginHeldBySymbol.toString(),
        unrealizedPnl: unrealizedPnl.toString(),
        fundingFee,
        liquidationPrice: calculateLiquidationPrice(
          position.volume,
          margin,
          totalCost,
          dynamicCost,
          symbol.multiplier,
          maintenanceMarginRatio
        ),
      };
    }).filter((p) => p.volume !== '0');
  }

  async getEstimatedMargin(accountAddress, volume, leverage, symbolId) {
    await this.init(true);
    const pool = this.pool;
    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const symbolIndex = checkSymbolId(symbolId, pool.activeSymbolIds);
    const symbol = pool.symbols[symbolIndex];
    return bg(volume)
      .abs()
      .times(symbol.indexPrice)
      .times(symbol.multiplier)
      .div(leverage)
      .toString();
  }

  async getEstimatedFee(volume, symbolId) {
    await this.init(true);
    const pool = this.pool;
    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const symbolIndex = checkSymbolId(symbolId, pool.activeSymbolIds);
    const symbol = pool.symbols[symbolIndex];
    return bg(volume)
      .abs()
      .times(symbol.indexPrice)
      .times(symbol.multiplier)
      .times(symbol.feeRatio)
      .toString();
  }

  async getFundingRate(symbolId) {
    await this.init();
    const pool = this.pool;
    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const symbolIndex = checkSymbolId(symbolId, pool.activeSymbolIds);
    const symbol = pool.symbols[symbolIndex];

    const liquidity = pool.stateValues.liquidity;
    return {
      funding0: symbol.funding,
      fundingPerSecond: symbol.fundingPerSecond,
      liquidity: liquidity,
      volume: '-',
      tradersNetVolume: symbol.tradersNetVolume,
    };
  }

  async getEstimatedFundingRate(newVolume, symbolId) {
    await this.init(true);
    const pool = this.pool;

    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const symbolIndex = checkSymbolId(symbolId, pool.activeSymbolIds);
    const symbol = { ...pool.symbols[symbolIndex] };
    symbol.dpmmPrice = PoolViewer.calculateDpmmPrice(
      symbol.indexPrice,
      symbol.K,
      bg(symbol.tradersNetVolume).plus(newVolume).toString(),
      symbol.multiplier
    ).toString();
    symbol.fundingPerSecond = bg(symbol.dpmmPrice)
      .minus(symbol.indexPrice)
      .times(symbol.multiplier)
      .div(pool.fundingPeriod)
      .toString();
    return {
      funding1: bg(symbol.fundingPerSecond).times(SECONDS_IN_A_DAY).toString(),
    };
  }

  async getLiquidityUsed(symbolId) {
    await this.init();
    const pool = this.pool;
    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }
    const { poolMarginRatio } = pool.parameters;
    return pool.symbols
      .reduce(
        (acc, s) =>
          acc.plus(
            bg(s.tradersNetVolume)
              .abs()
              .times(s.indexPrice)
              .times(s.multiplier)
              .times(poolMarginRatio)
          ),
        bg(0)
      )
      .div(pool.stateValues.liquidity)
      .toString();
  }

  async getEstimatedLiquidityUsed(newVolume, symbolId) {
    await this.init(true);
    const pool = this.pool;

    if (!pool.isSymbolsUpdated()) {
      await pool.getSymbols();
    }

    const { poolMarginRatio } = pool.parameters;
    const symbolIndex = checkSymbolId(symbolId, pool.activeSymbolIds);
    //console.log(pool.symbols, poolMarginRatio, pool.stateValues)
    return pool.symbols
      .reduce(
        (acc, s, index) =>
          index === symbolIndex
            ? acc.plus(
                bg(s.tradersNetVolume)
                  .plus(newVolume)
                  .abs()
                  .times(s.indexPrice)
                  .times(s.multiplier)
                  .times(poolMarginRatio)
              )
            : acc.plus(
                bg(s.tradersNetVolume)
                  .abs()
                  .times(s.indexPrice)
                  .times(s.multiplier)
                  .times(poolMarginRatio)
              ),
        bg(0)
      )
      .div(pool.stateValues.liquidity)
      .toString();
  }

  // =================
  // static method
  // =================
  static calculateK(indexPrice, liquidity, alpha) {
    return bg(indexPrice).times(alpha).div(liquidity);
  }
  static calculateDpmmPrice(indexPrice, K, tradersNetVolume, multiplier) {
    return bg(indexPrice).times(
      bg(1).plus(bg(K).times(tradersNetVolume).times(multiplier))
    );
  }
  static calculateDpmmCost(
    indexPrice,
    K,
    tradersNetVolume,
    multiplier,
    tradeVolume
  ) {
    return bg(indexPrice).times(
      bg(multiplier)
        .times(tradersNetVolume)
        .plus(bg(multiplier).times(tradeVolume))
        .pow(2)
        .minus(bg(multiplier).times(tradersNetVolume).pow(2))
        .times(K)
        .div(2)
        .plus(bg(tradeVolume).times(multiplier))
    );
  }
}

export const poolViewerFactory = contractFactory(PoolViewer);
