/* eslint-disable import/no-anonymous-default-export */
// import stream from './stream'
import historyProvider from "./historyProvider";
const supportedResolutions = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "240",
  "1D",
  "5D",
  "1W",
  "1M",
];

const config = {
  supported_resolutions: supportedResolutions,
};
export default {
  onReady: (cb) => {
    setTimeout(() => cb(config), 0);
  },
  bars: {},
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {},
  resolveSymbol: (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback
  ) => {
    const symbol_stub = {
      name: symbolName,
      pricescale: 100, //保留小数，如：2位小数传100，3位传1000
      ticker: symbolName,
      description: "",
      minmov: 1,
      type: "crypto",
      has_intraday: true,
      intraday_multipliers: [
        "1",
        "2",
        "5",
        "15",
        "30",
        "60",
        "240",
        "1D",
        "7D",
        "1W",
        "1M",
      ], //所有的周期
      has_weekly_and_monthly: true, //是否有周线和月线
      data_status: "streaming",
      has_no_volume: true, //是否将成交量独立出来
      pro_name: symbolName,
      has_daily: true,
      regular_session: "24x7",
    };
    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub);
    }, 0);
  },
  getBars: function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    if (from > 0 && to > 0) {
      const localResolutions =
        localStorage.getItem("localResolutions") || resolution;
      // setInterval(()=>{
      historyProvider
        .getBars(symbolInfo, localResolutions, from, to, firstDataRequest)
        .then((bars) => {
          const len = bars.length;
          // window.bars = bars;
          if (len) {
            if (to * 1000 > bars[len - 1].time) {
              onHistoryCallback(bars, { noData: false });
            } else {
              onHistoryCallback([], { noData: true });
            }
          } else {
            onHistoryCallback(bars, { noData: true });
          }
        })
        .catch((err) => {
          onErrorCallback(err);
        });
    }
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {},
  unsubscribeBars: (subscriberUID) => {},
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},
  getTimeScaleMarks: (
    symbolInfo,
    startDate,
    endDate,
    onDataCallback,
    resolution
  ) => {},
  getServerTime: (cb) => {},
};
