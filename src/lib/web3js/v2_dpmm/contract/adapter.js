// this file is generated by script, don't modify it !!!
// import { processMethod } from "../../shared/utils/index.js";

import { bg, toWei, fromWei, processResult } from "../../shared/utils/index.js";
import { normalizeSymbolUnit, SECONDS_IN_A_DAY } from "../../shared/config";
// import {
//   processResult,
// } from "../../shared/utils/contract.js";
//import { range } from '../../shared/utils/lang.js'
import { ERC20Factory, offChainOracleFactory } from "../../shared/contract/factory.js";
import { lTokenFactory, perpetualPoolRouterDpmmFactory, pTokenFactory } from "./factory.js";


import { getOraclePriceFromCache2 } from '../../shared/utils/oracle';
import { calculateDpmmCost, calculateDpmmPrice, calculateK } from "../../v2_lite_dpmm/calc.js";

const range = (n) => {
  if (typeof n === 'string' && /^\d+$/.test(n) ) {
    n = parseInt(n)
  }
  return [...Array(n).keys()]
}

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
    //const prices = await this._getSymbolPrices()
    let newArgs = args.map((arg, index) =>
      toWeiArgPositions.indexOf(index.toString()) !== -1 ? toWei(arg) : arg
    );
    //newArgs.push(prices)
    return await originMethod.apply(this, newArgs);
  };
  return klass;
};


const init = (klass) => {
  klass.prototype.init = async function (isEstimatedApi = false) {
    await this._init();
    if (!this.addresses || !this.parameters) {
      [this.addresses, this.parameters, this.state, this.lengths] =
        await Promise.all([
          this.getAddresses(),
          this.getParameters(),
          this.getPoolStateValues(),
          this.getLengths(),
        ]);
      this.fundingPeriod = (3 * 24 * 3600).toString();
      const { pTokenAddress, lTokenAddress, routerAddress } = this.addresses;
      this.lToken = lTokenFactory(this.chainId, lTokenAddress);
      this.pToken = pTokenFactory(this.chainId, pTokenAddress);
      this.router = perpetualPoolRouterDpmmFactory(this.chainId, routerAddress)
    }
    if (!isEstimatedApi) {
      const lengths = await this.getLengths();
      if (
        !this.symbols ||
        !this.bTokens ||
        this.lengths.toString() !== lengths.toString()
      ) {
        this.bTokenIds = range(lengths[0]).map((i) => i.toString());
        this.activeSymbolIds = range(lengths[1]).map((i) => i.toString());
        this.bTokens = await Promise.all(
          this.bTokenIds.reduce(
            (acc, bTokenId) => [...acc, this.getBToken(bTokenId)],
            []
          )
        );
        // update bToken price
        for (let i = 0; i < this.bTokenIds.length; i++) {
          if (i === 0) {
            this.bTokens[i].price = "1";
          } else {
            this.bTokens[i].price = await offChainOracleFactory(
              this.chainId,
              this.bTokens[i].oracleAddress
            ).getPrice();
          }
          this.bTokens[i].equity = bg(this.bTokens[i].liquidity)
            .times(this.bTokens[i].price)
            .times(this.bTokens[i].discount)
            .plus(this.bTokens[i].pnl)
            .toString();
        }
        this.bTokenSymbols = await Promise.all(
          this.bTokens.reduce(
            (acc, bToken) => [
              ...acc,
              ERC20Factory(this.chainId, bToken.bTokenAddress).symbol(),
            ],
            []
          )
        );
        this.symbols = await Promise.all(
          this.activeSymbolIds.reduce(
            (acc, symbolId) => [...acc, this.getSymbol(symbolId)],
            []
          )
        );
        this.activeSymbolNames = this.symbols.map((s) => s.symbol);

        // init
        this.positions = [];
        this.userState = {};
        this.offChainOracleSymbolIds = [];
        this.offChainOracleSymbolNames = [];

        await this.getLiquidity()
      }
    }
  };
  return klass;
};
const getConfig = (klass) => {
  klass.prototype.getConfig = async function () {
    return {
      pool: this.contractAddress,
      pToken: this.addresses.pTokenAddress,
      lToken: this.addresses.lTokenAddress,
      router: this.addresses.routerAddress,
      bTokenSymbols: this.bTokenSymbols,
      bTokens: this.bTokens.map((b, index) => ({
        bTokenId: index.toString(),
        bTokenSymbol: this.bTokenSymbols[index].toUpperCase(),
        bToken: b.bTokenAddress,
      })),
      symbols: this.symbols.map((s, index) => ({
        symbolId: index.toString(),
        symbol: s.symbol,
        unit: normalizeSymbolUnit(s.symbol),
      })),
      initialBlock: this.initialBlock,
      type: "perpetual",
      version: 'v2',
      versionId: "v2_dpmm",
      chainId: this.chainId,
    };
  };
  return klass;
};

const getLiquidity = (klass) => {
  // init pool addresses, parameters, tokens and viewer
  klass.prototype.getLiquidity = async function () {
    await this._init()
    const res = this.bTokens.reduce((acc, b) => acc.plus(b.equity), bg(0)).toString()
    this.state = this.state || {}
    this.state.liquidity = res
    return res
  }
  return klass
}

export const getLastTimestamp = (klass) => {
  // init pool addresses, parameters, tokens and viewer
  klass.prototype.getLastTimestamp = async function () {
    const res = await this._call('getPoolStateValues', []);
      return res[0]
    }
  return klass
}
export const getProtocolFeeAccrued = (klass) => {
  // init pool addresses, parameters, tokens and viewer
  klass.prototype.getProtocolFeeAccrued = async function () {
    const res = await this._call('getPoolStateValues', []);
      return fromWei(res[1])
    }
  return klass
}

// getStateValues
const getStateValues = (klass) => {
  klass.prototype.getStateValues = async function () {
    const res = await this.getPoolStateValues()
    // update
    this.state= { ...this.state, ...res}
    return this.state
  }
  return klass
}

const getBTokens = (klass) => {
  klass.prototype.getBTokens = async function (bTokenId) {
    const bTokenIds = bTokenId ? [bTokenId] : this.bTokenIds
    const bTokens = await Promise.all(
      bTokenIds.reduce(
        (acc, bTokenId) => [...acc, this.getBToken(bTokenId)],
        []
      )
    );
    // update bToken price
    for (let i = 0; i < this.bTokenIds.length; i++) {
      if (i === 0) {
        bTokens[i].price = "1";
      } else {
        bTokens[i].price = await offChainOracleFactory(
          this.chainId,
          this.bTokens[i].oracleAddress
        ).getPrice();
      }
      bTokens[i].equity = bg(this.bTokens[i].liquidity)
        .times(this.bTokens[i].price)
        .times(this.bTokens[i].discount)
        .plus(this.bTokens[i].pnl)
        .toString();
    }

    // update
    if (bTokenId) {
      const bTokenIndex = this.bTokenIds.indexOf(bTokenId)
      if (bTokenIndex > -1) {
        this.bTokens[bTokenIndex] = bTokens[0]
      }
    } else {
      this.bTokens = bTokens
    }
    return bTokens
  };
  return klass
};

// getSymbols()
const getSymbols = (klass) => {
  klass.prototype.getSymbols = async function (symbolId) {
    const symbolIds = symbolId ? [symbolId] : this.activeSymbolIds
    const symbols = await Promise.all(
      symbolIds.reduce(
        (acc, symbolId) => [...acc, this.getSymbol(symbolId)],
        []
      )
    );

    const indexPrices = await Promise.all(
      symbols.map((s) => {
        const oracleAddress = this.offChainOracleSymbolIds.includes(s.symbolId)
          ? ''
          : s.oracleAddress;
        return getOraclePriceFromCache2.get(
          this.chainId,
          s.symbol,
          oracleAddress
        );
      })
    );
    symbols.forEach((s, index) => {
      s.indexPrice = indexPrices[index];
      s.tradersNetPosition = bg(s.tradersNetVolume).times(s.multiplier).toString();
      s.notional = bg(s.tradersNetPosition).abs().times(s.indexPrice).toString(),
      s.K = calculateK(s.indexPrice, this.state.liquidity, s.alpha).toString();
      s.dpmmPrice = calculateDpmmPrice(
        s.indexPrice,
        s.K,
        s.tradersNetVolume,
        s.multiplier
      );

      const pnl = calculateDpmmCost(
        s.indexPrice,
        s.K,
        s.tradersNetVolume,
        s.multiplier,
        bg(s.tradersNetVolume).negated().toString()
      )
        .negated()
        .minus(s.tradersNetCost);
      const ratePerSecond = bg(s.dpmmPrice)
        .minus(s.indexPrice)
        .times(s.multiplier)
        .div(this.fundingPeriod)
        .toString();
      const diff = bg(Math.floor(Date.now() / 1000)).minus(
        this.state.lastTimestamp
      );
      s.fundingPerSecond = ratePerSecond
      s.funding = bg(ratePerSecond).times(SECONDS_IN_A_DAY).toString()
      s.pnl = pnl.toString()
      s.undistributedPnl = bg(s.distributedUnrealizedPnl)
        .minus(pnl)
        .plus(bg(ratePerSecond).times(diff).times(s.tradersNetVolume))
        .toString();
    });

    // update
    if (symbolId) {
      const symbolIndex = this.activeSymbolIds.indexOf(symbolId)
      this.symbols[symbolIndex] = symbols[0]
    } else {
      this.symbols = symbols
    }
    
    return symbols
  };
  return klass
};

// get traders positions
const getPositions = (klass) => {
  klass.prototype.getPositions = async function (account, symbolId) {
    const symbolIds = symbolId ? [symbolId] : this.activeSymbolIds
    const positions = await Promise.all(
      symbolIds.reduce(
        (acc, symbolId) => [...acc, this.pToken.getPosition(account, symbolId)],
        []
      )
    );
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

const isBTokensUpdated = (klass) => {
  klass.prototype.isBTokensUpdated = function() {
    return Array.isArray(this.bTokens) && this.bTokens.length > 0 && this.bTokens[0].price != null
  }
  return klass
}
const isSymbolsUpdated = (klass) => {
  klass.prototype.isSymbolsUpdated = function() {
    return Array.isArray(this.symbols) && this.symbols.length > 0 && this.symbols[0].indexPrice != null
  }
  return klass
}
const isPositionsUpdated = (klass) => {
  klass.prototype.isPositionsUpdated = function() {
    return Array.isArray(this.positions) && this.positions.length > 0 && this.positions[0].fundingAccrued != null
  }
  return klass
}

const getDynamicEquity = (klass) => {
  klass.prototype['getDynamicEquity'] = async function() {
    if (!this.isSymbolsUpdated()) {
      await this.getSymbols();
    }
    //console.log(this.symbols)
    const res = bg(this.state.liquidity)
      .plus(
        this.symbols.reduce((acc, s) => acc.plus(s.undistributedPnl), bg(0))
      )
      .toString();
    this.state.dynamicEquity = res;
    return res;
  }
  return klass
}

const getTraderLiquidity = (klass) => {
  klass.prototype["getTraderLiquidity"] = async function(account) {
    return await this.lToken.balanceOf(account)
  }
  return klass
}

const getPoolRequiredMargin = (klass) => {
  klass.prototype['getPoolRequiredMargin'] = async function () {
    if (!this.isSymbolsUpdated()) {
      await this.getSymbols()
    }
    const { minPoolMarginRatio } = this.parameters;
    return this.symbols
      .reduce(
        (acc, s) =>
          acc.plus(
            bg(s.notional)
          ),
        bg(0)
      )
      .times(minPoolMarginRatio).toString()
  };
  return klass
}

const getTraderMarginStatus = (klass) => {
  klass.prototype['getTraderMarginStatus'] = async function (account) {
    if (!this.isBTokensUpdated()) {
      await this.getSymbols()
    }
    if (!this.isSymbolsUpdated()) {
      await this.getSymbols()
    }
    if (!this.isPositionsUpdated()) {
      await this.getPositions(account)
    }
    if (!this.userState.margins) {
      this.userState.margins = await this.pToken.getMargins(account);
    }

    this.userState.totapPnl = this.positions.reduce((acc, p) => acc.plus(p.traderPnl), bg(0)).toString()
    //this.userState.totalEquity = bg(this.userState.totalPnl).plus(this.userState.margins[0])
    this.userState.totalEquity = this.userState.margins.reduce(
      (acc, m, i) =>
        acc.plus(
          bg(m).times(this.bTokens[i].price).times(this.bTokens[i].discount)
        ),
      bg(this.userState.totalPnl)
    );

    this.userState.totalNotional = this.positions.reduce(
      (acc, p) => acc.plus(p.notional),
      bg(0)
    );

    return [this.userState.totalEquity, this.userState.totalNotional];
  };
  return klass
}


export const perpetualPoolDpmmAdapter = (klass) => {
    // klass = processMethod(klass, 'symbol', []);
    klass = addMethods(klass, [
        init,
        getConfig,
        getLiquidity,
        getLastTimestamp,
        getProtocolFeeAccrued,
        getStateValues,
        getBTokens,
        getSymbols,
        getPositions,
        isBTokensUpdated,
        isSymbolsUpdated,
        isPositionsUpdated,
        getDynamicEquity,
        getTraderLiquidity,
        getTraderMarginStatus,
        getPoolRequiredMargin,
    ])
    klass = overrideMethods(klass, [
      [
        processMethod,
        "getParameters",
        [
          "initialMarginRatio",
          "liquidationCutRatio",
          "maintenanceMarginRatio",
          "maxLiquidationReward",
          "minBToken0Ratio",
          "minPoolMarginRatio",
          "protocolFeeCollectRatio",
        ],
      ],
      [
        processMethod,
        "getBToken",
        ["discount", "price", "liquidity", "pnl", "cumulativePnl"],
      ],
      [
        processMethod,
        "getSymbol",
        [
          "multiplier",
          "feeRatio",
          //"fundingRateCoefficient",
          "alpha",
          "distributedUnrealizedPnl",
          //"price",
          "cumulativeFundingRate",
          "tradersNetVolume",
          "tradersNetCost",
        ],
      ],
      [processMethod, "getPoolStateValues", ["protocolFeeAccrued"]],
    ]);
    return klass
}
export const perpetualPoolRouterDpmmAdapter = (klass) => {
  // klass = processMethod(klass, 'symbol', []);
  klass = overrideMethods(klass, [
    [processTxMethod, 'addLiquidity', ['2']],
    //[processTxMethod, 'addLiquidityWithPrices', ['2']],
    [processTxMethod, 'removeLiquidity', ['2']],
    //[processTxMethod, 'removeLiquidityWithPrices', ['2']],
    [processTxMethod, 'addMargin', ['2']],
    //[processTxMethod, 'addMarginWithPrices', ['2']],
    [processTxMethod, 'removeMargin', ['2']],
    //[processTxMethod, 'removeMarginWithPrices', ['2']],
    [processTxMethod, 'trade', ['2']],
    //[processTxMethod, 'tradeWithPrices', ['2']],
  ]);
  return klass;
};

export const lTokenAdapter = (klass) => {
  // klass = processMethod(klass, 'symbol', []);
  klass = overrideMethods(klass, [
    [processMethod, 'getAsset', ['liquidity', 'pnl', 'lastCumulativePnl']],
    [processMethod, 'getAssets', ['liquidity', 'pnl', 'lastCumulativePnl']],
  ]);
  return klass;
};

export const pTokenAdapter = (klass) => {
  klass = overrideMethods(klass, [
    [processMethod, 'getMargins'],
    [
      processMethod,
      'getPosition',
      ['cost', 'volume', 'lastCumulativeFundingRate'],
    ],
    [
      processMethod,
      'getPositions',
      ['cost', 'volume', 'lastCumulativeFundingRate'],
    ],
  ]);
  return klass;
};