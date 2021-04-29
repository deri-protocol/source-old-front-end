// import stream from './stream'
import historyProvider from './historyProvider'
const supportedResolutions = ["1", "5", "15", "30", "60", "240", "1D", "5D", "1W", "1M"]

const config = {
    supported_resolutions: supportedResolutions
};
export default {
    onReady: cb => {
        // console.log('=====onReady running')	
        setTimeout(() => cb(config), 0)

    },
    bars: {},
    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        // console.log('====Search Symbols running')
    },
    resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        // expects a symbolInfo object in response
        // console.log('======resolveSymbol running')
        // console.log('resolveSymbol:',{symbolName})
        // var split_data = symbolName.split(/[:/]/)
        // console.log({split_data})
        // console.log('symbolName: ', symbolName)
        const symbol_stub = {
            name: symbolName,
            pricescale: 100,//保留小数，如：2位小数传100，3位传1000
            ticker: symbolName,
            description: "",
            minmov: 1,
            type: "crypto",
            has_intraday: true,
            intraday_multipliers: ['1', '2', '5', '15', '30', '60', '240', '1D', '7D', '1W', '1M'],//所有的周期
            has_weekly_and_monthly: true,//是否有周线和月线
            data_status: 'streaming',
            has_no_volume: true,//是否将成交量独立出来
            pro_name: symbolName,
            has_daily: true,
            regular_session: "24x7"
        }
        // console.log('symbol_stub: ', symbol_stub)

        // if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
        // 	symbol_stub.pricescale = 100
        // }
        setTimeout(function () {
            onSymbolResolvedCallback(symbol_stub)
            // console.log('Resolving that symbol....', symbol_stub)
        }, 0)

        // onResolveErrorCallback('Not feeling it today')

    },
    getBars: function (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        if (from > 0 && to > 0) {
            const localResolutions = localStorage.getItem('localResolutions') || resolution
            // setInterval(()=>{
                historyProvider.getBars(symbolInfo, localResolutions, from, to, firstDataRequest)
                .then(bars => {
                    const len = bars.length
                    // window.bars = bars;
                    if (len) {
                        if (to*1000 > bars[len -1].time) {
                            onHistoryCallback(bars, {noData: false})
                            // onResetCacheNeededCallback()
                        } else {
                            onHistoryCallback([], {noData: true})
                            // onResetCacheNeededCallback()
                        }
                    } else {
                        onHistoryCallback(bars, {noData: true})
                        // onResetCacheNeededCallback()
                    }
                }).catch(err => {
                    // console.log({err})
                    onErrorCallback(err)
                })
                // },5000)
            

        }

        // onHistoryCallback(bars,{ noData: false});
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
        
        // console.log('=====subscribeBars runnning')
        //  stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
    },
    unsubscribeBars: subscriberUID => {
        // console.log('=====unsubscribeBars running')

        //  stream.unsubscribeBars(subscriberUID)
    },
    calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
        //optional
        // console.log('=====calculateHistoryDepth running')
        // while optional, this makes sure we request 24 hours of minute data at a time
        // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
        // switch (true) {
        //     case resolution.indexOf('D') > 0:
        //         return { resolutionBack: 'W', intervalBack: '1' }
        //     case resolution.indexOf('W') > 0:
        //         return { resolutionBack: 'D', intervalBack: '1' }
        //     case resolution.indexOf('M') > 0:
        //         return { resolution: 'D', resolutionBack: 'M', intervalBack: '1' }
        //     default:
        //         return { resolutionBack: 'D', intervalBack: '1' }
        // }
        // return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
    },
    getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        //optional
        // console.log('=====getMarks running')
    },
    getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        //optional
        // console.log('=====getTimeScaleMarks running')
    },
    getServerTime: cb => {
        // console.log('=====getServerTime running')
    }
}
