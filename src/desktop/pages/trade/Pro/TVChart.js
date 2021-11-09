import React,{useRef,useEffect} from 'react'
import { widget} from '../../../../lib/charting_library'
import { getFormatSymbol, intervalRange, formatSymbolInputParam, } from '../../../../utils/utils';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import chartConfig from './chart-config.json'
import webSocket from '../../../../model/WebSocket';
import Type from '../../../../model/Type';
import Version from '../../../../model/Version';

const supported_resolutions = ["1","5","15","30","60","240","1D","5D","1W","1M"];
const GET_KLINE_URL=`${process.env.REACT_APP_HTTP_URL}/get_kline`
let spec 
const subscribes = {}

function TVChart({trading,interval,showLoad,intl,config,type}){
  const widgetRef = useRef(null);
  const lastDataRef = useRef(null);
  const datafeedRef = useRef({
    onReady: (callback) => {
      setTimeout(() => callback({supported_resolutions: supported_resolutions}),0);
    },
    getBars: (symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest) => getBars(symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest,config),
    resolveSymbol: (symbolName,onSymbolResolvedCallback) => resolveSymbol(symbolName,onSymbolResolvedCallback),
    subscribeBars : (symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback) => subscribeBars(symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback),
    unsubscribeBars : subscriberUID => unsubscribeBars(subscriberUID)
  });


  const getBars = async (symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest,config) => {
    // const suffix = symbolInfo.config.version === 'v2' ? 'USD' : /^i/i.test(symbolInfo.name) ? '' : 'USDT'
    const pos = symbolInfo.name.indexOf('-INDEX');
    const symbol = pos > -1 ? symbolInfo.name.substring(0,pos) : symbolInfo.config.markpriceSymbolFormat
    const res = await axios.get(GET_KLINE_URL,{
      params : {
        symbol : getFormatSymbol(symbol),
        time_type: intervalRange[resolution],
        from : from ,
        to : to 
      }
    });
    if(res && res.status === 200 && Array.isArray(res.data.data) && res.data.data.length > 0){
      const klineData = res.data.data
      showLoad(false)
      onHistoryCallback(klineData)
      lastDataRef.current = klineData[klineData.length -1]
    } else {
      onHistoryCallback([],{noData: true})
    } 
  }

  const subscribeBars = (symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback) => {
    const pos = symbolInfo.name.indexOf('-INDEX');
    const symbol = pos > -1 ? symbolInfo.name.substring(0,pos) : symbolInfo.config.markpriceSymbolFormat || symbolInfo.name
    webSocket.subscribe('get_kline_update',{symbol : getFormatSymbol(symbol),time_type : intervalRange[resolution]},data => {
      if (data && lastDataRef.current && data.time >= lastDataRef.current.time ) {
        subscribes[subscribeUID] = data.symbol
        onRealtimeCallback(data)
        lastDataRef.current = data
      }
    })
  }

  const unsubscribeBars = subscriptUID => {
    if(subscribes[subscriptUID]){
      webSocket.unsubscribe('un_get_kline',{symbol : subscribes[subscriptUID],time_type : intervalRange[interval]})
    }
  }
  
  const resolveSymbol = (symbol,onSymbolResolvedCallback) => {
    // const sampleData = trading.markPriceSampleForKline || 1 
    // const priceScale  = ((+sampleData) >= 1 || (+sampleData) === 0)  ? 100 : 1 * (10 ** (String(sampleData).split('').findIndex(i => !isNaN(i) && i > 0)))
    setTimeout(() => onSymbolResolvedCallback({
      name: symbol,
      ticker : symbol,
      description : `${symbol}-MARK`,
      pricescale: symbol.indexOf('-INDEX') > 0 ? 100 : 1 * (10 ** trading.priceDecimals),
      config : spec,
      type : 'index',
      minmov: 1,
      has_intraday: true,
      intraday_multipliers: ["1","2","5","15","30","60","240","1D","7D","1W","1M"],
      has_weekly_and_monthly: true,
      has_no_volume: true,
      has_daily: true,
      timezone : 'UTC',
      session: "24x7",
      supported_resolutions : supported_resolutions
    }),0)
  }

  const initialize = () => {
    const timezone = Intl ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Etc/UTC'
    const widgetOptions = {
      symbol: config.symbol,
      datafeed: datafeedRef.current,
      interval: interval,
      locale: intl.locale,
      timezone : timezone,
      ...chartConfig,
    }
    widgetRef.current  = new widget(widgetOptions);
    widgetRef.current.onChartReady(() => {
      const priceScale = Type.isFuture ? 'as-series' : 'new-left'
      widgetRef.current.chart().createStudy('Overlay', true, false, [`${config.symbol}-INDEX`],null,{priceScale : priceScale,'color': '#aaa'})
    })
  }



  useEffect(() => {
    if(config && config.symbol && interval){
      spec = config
      initialize();
      webSocket.addReconnectEvent(config.symbol,() => {
        //如果当前数据不是最新，重新加载
        if(lastDataRef.current && lastDataRef.current.time  && lastDataRef.current.time < new Date().getTime()) {
          initialize();
        }
      })
    }
    return () => {
      if(widgetRef.current){
        widgetRef.current.remove();
      }
      unsubscribeBars();
      config && webSocket.removeReconnectEvent(config.symbol)
    }
  }, [interval,config,type.current])

  return(
    <div id='tv-container'></div>
  )

}

export default inject('intl','type')(observer(TVChart))