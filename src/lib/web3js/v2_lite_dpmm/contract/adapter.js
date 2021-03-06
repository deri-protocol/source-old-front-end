// this file is generated by script, don't modify it !!!
import { ERC20Factory, offChainOracleFactory} from "../../shared/contract/factory.js";
import {
  toWei,
  getLiquidity,
  getProtocolFeeAccrued,
  getLastTimestamp,
  bg,
  processResult,
  deriToNatural,
  getBlockInfo,
} from "../../shared/utils/index.js";
import { normalizeSymbolUnit, SECONDS_IN_A_DAY } from "../../shared/config";
import { getSymbolPrices } from '../../shared/utils/oracle'
import { getPriceInfos } from "../utils.js";
import { lTokenLiteFactory, pTokenLiteFactory } from "./factory.js";
import { calculateK, calculateDpmmPrice, calculateDpmmCost } from "../calc";


// klass = addInstanceMethods(klass, [])
const addMethods = (klass, fns = []) => {
  if (fns.length > 0) {
    for (let i = 0; i < fns.length; i++) {
      klass = fns[i](klass);
    }
    return klass;
  } else {
    return klass;
  }
};
const overrideMethods = (klass, fns = []) => {
  if (fns.length > 0) {
    for (let i = 0; i < fns.length; i++) {
      const fn = fns[i][0]
      const args = fns[i].slice(1)
      // console.log(fn, args)
      klass = fn(klass)(...args);
    }
    return klass;
  } else {
    return klass;
  }
};

const checkOffChainOracleSymbol = async (chainId, oracleAddress, symbol) => {
  try {
    await offChainOracleFactory(chainId, oracleAddress).signer()
    return symbol
  } catch (err) {
  }
  try {
    await offChainOracleFactory(chainId, oracleAddress).signatory()
    return symbol
  } catch (err) {
  }
  return ''
};

const processMethod = (klass) => (methodName, propList = []) => {
  const originMethod = klass.prototype[methodName];
  klass.prototype[methodName] = async function (...args) {
    const res = await originMethod.apply(this, args);
    return processResult(res, propList);
  };
  return klass;
};

const processTxMethod = (klass) => (methodName, toWeiArgPositions = []) => {
  const originMethod = klass.prototype[methodName];
  klass.prototype[methodName] = async function (...args) {
    const prices = await this._getSymbolPrices()
    // console.log('prices', prices)
    let newArgs = args.map((arg, index) =>
      toWeiArgPositions.indexOf(index.toString()) !== -1 ? toWei(arg) : arg
    );
    newArgs.push(prices)
    return await originMethod.apply(this, newArgs);
  };
  return klass;
};

const init = (klass) => {
  // init pool addresses, parameters, tokens and viewer
  klass.prototype['init'] = async function (isEstimatedApi = false) {
    await this._init();
    if (!this.addresses || !this.activeSymbolIds) {
      [this.addresses, this.parameters, this.state, this.fundingPeriod] = await Promise.all([
        this.getAddresses(),
        this.getParameters(),
        this.getPoolStateValues(),
        this.getFundingPeriod(),
      ]);
      this.fundingPeriod = parseInt(this.fundingPeriod);
      // console.log(this.addresses, this.parameters)
      const { bTokenAddress, lTokenAddress, pTokenAddress } = this.addresses;
      this.bToken = ERC20Factory(this.chainId, bTokenAddress);
      this.pToken = pTokenLiteFactory(this.chainId, pTokenAddress);
      this.lToken = lTokenLiteFactory(this.chainId, lTokenAddress);

      // init tokens
      [this.bTokenSymbol ] = await Promise.all([
        this.bToken.symbol(),
      ]);
      this.symbols = []
      this.positions = []

    }
    // update symbols
    // estimated for estimated* api use to disable async call
    if (!isEstimatedApi) {
      const symbolIds = await this.pToken.getActiveSymbolIds();
      if (
        !this.activeSymbolIds ||
        this.activeSymbolIds.toString() !== symbolIds.toString()
      ) {
        this.poolLiquidity = await this.getPoolLiquidity();
        this.activeSymbolIds = symbolIds;
        this.symbols = await Promise.all(
          this.activeSymbolIds.reduce(
            (acc, symbolId) => [...acc, this.getSymbol(symbolId)],
            []
          )
        );
        this.activeSymbolNames = this.symbols.map((s) => s.symbol);
        this.offChainOracleSymbolNames = await Promise.all(
          this.symbols
            .map((s) => s.oracleAddress)
            .reduce(
              (acc, o, index) => [
                ...acc,
                checkOffChainOracleSymbol(
                  this.chainId,
                  o,
                  this.symbols[index].symbol
                ),
              ],
              []
            )
        );
        this.offChainOracleSymbolIds = this.activeSymbolIds.reduce(
          (acc, i, index) => {
            return this.offChainOracleSymbolNames[index] === ''
              ? acc
              : [...acc, i];
          },
          []
        );
        this.offChainOracleSymbolNames = this.offChainOracleSymbolNames.filter(
          (s) => s && s !== ''
        );
        // console.log(
        //   `${this.contractAddress} offchain`,
        //   this.offChainOracleSymbolNames
        // );
      }
    }
  };
  return klass;
};

// this.addresses
// this.parameters

const getConfig = (klass) => {
  klass.prototype["getConfig"] = async function () {
    return {
      pool: this.contractAddress,
      pToken: this.addresses.pTokenAddress,
      lToken: this.addresses.lTokenAddress,
      bToken: this.addresses.bTokenAddress,
      bTokenSymbol: this.bTokenSymbol,
      symbols: this.symbols.map((s, index) => ({
        symbolId: this.activeSymbolIds[index],
        symbol: s.symbol,
        unit: normalizeSymbolUnit(s.symbol),
      })),
      initialBlock: this.initialBlock,
      type: "perpetual",
      version: "v2_lite",
      versionId: "v2_lite_dpmm",
      chainId: this.chainId,
    };
  };
  return klass;
};

// getStateValues
const getStateValues = (klass) => {
  klass.prototype["getStateValues"] = async function () {
    const res = await this.getPoolStateValues()
    // update
    this.state = { ...this.state, ...res}
    return this.state
  }
  return klass
}

// getSymbol()
const getSymbols = (klass) => {
  klass.prototype["getSymbols"] = async function (symbolId) {
    const symbolIds = symbolId ? [symbolId] : this.activeSymbolIds
    const symbols = await Promise.all(
      symbolIds.reduce(
        (acc, symbolId) => [...acc, this.getSymbol(symbolId)],
        []
      )
    );

    // const indexPrices = await Promise.all(
    //   symbols.map((s) => {
    //     const oracleAddress = this.offChainOracleSymbolIds.includes(s.symbolId) ? '' : s.oracleAddress
    //     return getOraclePriceFromCache2.get(this.chainId, s.symbol, oracleAddress)
    //   })
    // )

    const indexPrices = await getSymbolPrices(
      this.chainId,
      symbols,
      this.offChainOracleSymbolIds,
      this.offChainOracleSymbolNames
    );
    //console.log('indexPrices', indexPrices);
    symbols.forEach((s, index) => {
      s.indexPrice = indexPrices[index]
      s.K = calculateK(
        s.indexPrice,
        this.state.liquidity,
        s.alpha
      ).toString();
      //console.log(s.K, s.indexPrice, s.tradersNetVolume, s.multiplier)
      s.dpmmPrice = calculateDpmmPrice(
        s.indexPrice,
        s.K,
        s.tradersNetVolume,
        s.multiplier
      ).toString();
      s.fundingPerSecond = bg(s.dpmmPrice).minus(s.indexPrice).times(s.multiplier).div(this.fundingPeriod).toString()
      //s.fundingPerSecond = bg(s.dpmmPrice).minus(s.indexPrice).div(this.fundingPeriod).toString()
      s.funding = bg(s.fundingPerSecond).times(SECONDS_IN_A_DAY).toString()
    });

    // update
    if (symbolId) {
      const symbolIndex = this.activeSymbolIds.indexOf(symbolId)
      if (symbolIndex > -1) {
        this.symbols[symbolIndex] = symbols[0]
      }
    } else {
      this.symbols = symbols
    }
    
    return symbols
  };
  return klass
};

// get traders positions
const getPositions = (klass) => {
  klass.prototype["getPositions"] = async function (account, symbolId) {
    const symbolIds = symbolId ? [symbolId] : this.activeSymbolIds
    const positions = await Promise.all(
      symbolIds.reduce(
        (acc, symbolId) => [...acc, this.pToken.getPosition(account,symbolId)],
        []
      )
    );
    await this.getLastTimestamp()

    const timeDiff = bg(Math.floor(Date.now() / 1000)).minus(
      this.state.lastTimestamp
    );
    positions.forEach((p, index) => {
      const symbol = this.symbols[index];
      p.fundingAccrued = bg(p.volume)
        .times(
          bg(symbol.cumulativeFundingRate)
            .plus(bg(timeDiff).times(this.symbols[index].fundingPerSecond))
            .minus(p.lastCumulativeFundingRate)
        )
        .toString();
      p.traderPnl = calculateDpmmCost(
        symbol.indexPrice,
        symbol.K,
        symbol.tradersNetVolume,
        symbol.multiplier,
        bg(p.volume).negated().toString()
      )
        .negated()
        .minus(p.cost).toString();

      p.notional = bg(p.volume).abs().times(symbol.indexPrice).times(symbol.multiplier).toString()
    });

    // update
    if (symbolId) {
      const symbolIndex = this.activeSymbolIds.indexOf(symbolId)
      if (symbolIndex > -1) {
        this.positions[symbolIndex] = positions[0]
      }
    } else {
      this.positions = positions
    }

    return positions
  };
  return klass
};

// check is updated
const isSymbolsUpdated = (klass) => {
  klass.prototype['isSymbolsUpdated'] = function() {
    return Array.isArray(this.symbols) && this.symbols.length > 0 && this.symbols[0].K != null
  }
  return klass
}
const isPositionsUpdated = (klass) => {
  klass.prototype['isPositionsUpdated'] = function() {
    return Array.isArray(this.positions) && this.positions.length > 0 && this.positions[0].volume != null
  }
  return klass
}

const getTraderLiquidity = (klass) => {
  klass.prototype["getTraderLiquidity"] = async function(account) {
    return await this.lToken.balanceOf(account)
  }
  return klass
}


const getDynamicEquity = (klass) => {
  klass.prototype['getDynamicEquity'] = async function() {
    if (!this.isSymbolsUpdated) {
      await this.getSymbols()
    }
    //console.log(this.symbols)
    const res = bg(this.state.liquidity)
      .plus(
        this.symbols.reduce(
          (acc, s) =>
            acc
              .plus(s.tradersNetCost)
              .minus(
                bg(s.tradersNetVolume).times(s.dpmmPrice).times(s.multiplier)
              ),
          bg(0)
        )
      )
      .toString();
    this.state.dynamicEquity = res
    return res
  }
  return klass
}

const getPoolRequiredMargin = (klass) => {
  klass.prototype['getPoolRequiredMargin'] = async function () {
    if (!this.isSymbolsUpdated) {
      await this.getSymbols()
    }
    const { poolMarginRatio } = this.parameters;
    return this.symbols
      .reduce(
        (acc, s) =>
          acc.plus(
            bg(s.tradersNetVolume).times(s.indexPrice).times(s.multiplier).abs()
          ),
        bg(0)
      )
      .times(poolMarginRatio).toString()
  };
  return klass
}

const getTraderMarginStatus = (klass) => {
  klass.prototype['getTraderMarginStatus'] = async function (account) {
    if (!this.isSymbolsUpdated) {
      await this.getSymbols()
    }
    if (!this.isPositionsUpdated) {
      await this.getPositions(account)
    }
    if (!this.margin) {
      this.margin = await this.pToken.getMargin(account)
    }
    // console.log(this.positions)
    // console.log(this.symbols)
    const { initialMarginRatio } = this.parameters;
    let dynamicMargin = bg(this.margin), requiredInitialMargin = bg(0)
    for (let i = 0; i < this.activeSymbolIds.length; i++) {
      const s = this.symbols[i];
      const p = this.positions[i];
      dynamicMargin = dynamicMargin.plus(
        bg(p.volume).times(s.dpmmPrice).times(s.multiplier).minus(p.cost)
      );
      requiredInitialMargin = requiredInitialMargin.plus(
        bg(p.volume)
          .times(s.indexPrice)
          .times(s.multiplier)
          .abs()
          .times(initialMarginRatio)
      );
    }
    return [dynamicMargin.toString(), requiredInitialMargin.toString()];
  };
  return klass
}

const formatTradeEvent = (klass) => {
  klass.prototype['formatTradeEvent'] = async function (event) {
    const info = event.returnValues;
    const tradeVolume = deriToNatural(info.tradeVolume);
    const block = await getBlockInfo(this.chainId, event.blockNumber);
    const symbolId = info.symbolId;
    const index = this.activeSymbolIds.indexOf(symbolId);
    if (index > -1) {
      const symbol = this.symbols[index];
      const tradeFee = info.tradeFee;

      const direction =
        tradeFee !== '-1'
          ? bg(tradeVolume).gt(0)
            ? 'LONG'
            : 'SHORT'
          : 'LIQUIDATION';
      const price = bg(info.tradeCost)
        .div(info.tradeVolume)
        .div(symbol.multiplier)
        .toString();
      const notional = bg(tradeVolume)
        .abs()
        .times(price)
        .times(symbol.multiplier)
        .toString();

      const res = {
        symbolId: info.symbolId,
        symbol: symbol.symbol,
        trader: info.trader,
        direction,
        volume: bg(tradeVolume).abs().toString(),
        price: price,
        indexPrice: deriToNatural(info.indexPrice).toString(),
        notional: notional,
        transactionFee:
          tradeFee === '-1' ? '0' : deriToNatural(tradeFee).toString(),
        transactionHash: event.transactionHash,
        time: block.timestamp * 1000,
        extra: {},
      };
      return res;
    } else {
      return null;
    }
  };
  return klass
};

const _getSymbolPrices = (klass) => {
  klass.prototype["_getSymbolPrices"] = async function () {
    await this.init()
    let prices = []
    if (this.offChainOracleSymbolIds.length > 0) {
        const priceInfos = await getPriceInfos(this.chainId, this.offChainOracleSymbolNames);
        prices = Object.values(priceInfos).reduce((acc, p, index) => {
        acc.push([
            this.offChainOracleSymbolIds[
            this.offChainOracleSymbolNames.indexOf(Object.keys(priceInfos)[index])
            ],
            p.timestamp,
            p.price,
            parseInt(p.v).toString(),
            p.r,
            p.s,
        ]);
        return acc;
        }, []);
    }
    return prices;
  };
  return klass;
};

export const perpetualPoolLiteAdapter = (klass) => {
  //klass = processMethod(klass, "getFundingPeriod")

  klass = addMethods(klass, [
    init,

    getConfig,
    getLiquidity,
    getLastTimestamp,
    getProtocolFeeAccrued,
    getStateValues,
    getSymbols,
    getPositions,
    getDynamicEquity,
    getPoolRequiredMargin,
    getTraderMarginStatus,
    isSymbolsUpdated,
    isPositionsUpdated,
    getTraderLiquidity,
    formatTradeEvent,
    _getSymbolPrices,
  ]);

  klass = overrideMethods(klass, [
    [
      processMethod,
      'getParameters',
      [
        'poolMarginRatio',
        'initialMarginRatio',
        'maintenanceMarginRatio',
        'minLiquidationReward',
        'maxLiquidationReward',
        'liquidationCutRatio',
        'protocolFeeCollectRatio',
      ],
    ],
    [processMethod, 'getPoolStateValues', ['liquidity', 'protocolFeeAccrued']],
    [processMethod, 'getFundingPeriod'],
    [
      processMethod,
      'getSymbol',
      [
        'multiplier',
        'feeRatio',
        'fundingRateCoefficient',
        'price',
        'alpha',
        'cumulativeFundingRate',
        'tradersNetVolume',
        'tradersNetCost',
      ],
    ],
  ]);

  klass = overrideMethods(klass, [
    [processTxMethod, 'addLiquidity', ['1']],
    [processTxMethod, 'removeLiquidity', ['1']],
    [processTxMethod, 'addMargin', ['1']],
    [processTxMethod, 'removeMargin', ['1']],
    [processTxMethod, 'trade', ['2']],
  ]);

  return klass;
};

export const lTokenLiteAdapter = (klass) => {
  return overrideMethods(klass, [
    [processMethod, 'balanceOf'],
    [processMethod, 'totalSupply'],
  ]);
};

export const pTokenLiteAdapter = (klass) => {
  return overrideMethods(klass, [
    [processMethod, 'getMargin'],
    [
      processMethod,
      'getPosition',
      ['volume', 'cost', 'lastCumulativeFundingRate'],
    ],
  ]);
};

export const perpetualPoolLiteManagerAdapter = (klass) => {
    // klass = processMethod(klass, 'symbol', []);
    return klass
}

