

function getEverlastingTimePriceAndDelta(S, K, V, T) {
    let u = Math.sqrt(8 / V / V / T + 1)
    let timePrice, delta
    if (S > K) {
        timePrice = K * Math.pow(S/K, (1 - u) / 2) / u
        delta = (1 - u) * timePrice / S / 2
    } else if (S === K) {
        timePrice = K / u
        delta = 0
    } else {
        timePrice = K * Math.pow(S/K, (1 + u) / 2) / u
        delta = (1 + u) * timePrice / S / 2
    }
    return [timePrice, delta]
}

function getDynamicInitialMarginRatio(spot, strike, isCall, initialMarginRatio, minInitialMarginRatio) {
    if ((isCall && spot >= strike) || (!isCall && strike >= spot)) {
        return initialMarginRatio
    } else {
        let otmRatio = (isCall ? strike - spot : spot - strike) / strike
        return Math.max((1 - otmRatio * 3) * initialMarginRatio, minInitialMarginRatio)
    }
}

function canLiquidateWithPrice(pool, symbol, trader, position, newPrice) {
    let newIntrinsicPrice = symbol.isCall ? Math.max(newPrice - symbol.strikePrice, 0) : Math.max(symbol.strikePrice - newPrice, 0)
    let [newTimePrice, newDelta] = getEverlastingTimePriceAndDelta(newPrice, symbol.strikePrice, symbol.oracleVolatility, pool.premiumFundingPeriod)
    if (newIntrinsicPrice > 0) {
        newDelta += symbol.isCall ? 1 : -1
    }
    let newPnl = position.volume * (newIntrinsicPrice + newTimePrice) * symbol.multiplier - position.cost
    let newDynamicMarginRatio = getDynamicInitialMarginRatio(newPrice, symbol.strikePrice, symbol.isCall, pool.initialMarginRatio, 0.01)

    let newDynamicMargin = trader.dynamicMargin - position.pnl + newPnl
    let newInitialMargin = trader.initialMargin - Math.abs(position.volume * symbol.oraclePrice * symbol.multiplier * symbol.dynamicMarginRatio) + Math.abs(position.volume * newPrice * symbol.multiplier * newDynamicMarginRatio)
    let newMaintenanceMargin = newInitialMargin * pool.maintenanceMarginRatio / pool.initialMarginRatio

    return newMaintenanceMargin > newDynamicMargin
}

export const findLiquidationPrice = (pool, symbol, trader, position) => {
    if (position.volume === 0) return null
    if (trader.maintenanceMargin > trader.dynamicMargin) return symbol.oraclePrice
    let price1, price2
    let l1, l2
    if ((symbol.isCall && position.volume > 0) || (!symbol.isCall && position.volume < 0)) {
        price1 = symbol.oraclePrice / 10
        price2 = symbol.oraclePrice
        l1 = canLiquidateWithPrice(pool, symbol, trader, position, price1)
        l2 = false
    } else {
        price1 = symbol.oraclePrice
        price2 = symbol.oraclePrice * 10
        l1 = false
        l2 = canLiquidateWithPrice(pool, symbol, trader, position, price2)
    }
    while (true) {
        if (l1 && l2) return (price1 + price2) / 2
        if (!l1 && !l2) return null
        if (price2 - price1 < symbol.oraclePrice / 1000) return (price1 + price2) / 2
        let price = (price1 + price2) / 2
        let l = canLiquidateWithPrice(pool, symbol, trader, position, price)
        if (l === l1) price1 = price
        else if (l === l2) price2 = price
    }
    //return (price1 + price2) / 2
}
