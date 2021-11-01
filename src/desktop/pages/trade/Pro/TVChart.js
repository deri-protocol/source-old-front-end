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

function TVChart({interval,showLoad,intl,preload,config,type}){
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
    const symbol = pos > -1 ? symbolInfo.name.substring(0,pos) : symbolInfo.config.markpriceSymbolFormat || symbolInfo.name
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
    // const suffix = symbolInfo.config.version === 'v2' ? 'USD' : /^i/i.test(symbolInfo.name) ? '' : 'USDT'
    // const symbol = symbolInfo.name.indexOf(suffix) === -1 ? getFormatSymbol(`${symbolInfo.name}${suffix}`) : symbolInfo.config.markpriceSymbolFormat
    const pos = symbolInfo.name.indexOf('-INDEX');
    const symbol = pos > -1 ? symbolInfo.name.substring(0,pos) : symbolInfo.config.markpriceSymbolFormat || symbolInfo.name
    webSocket.subscribe('get_kline_update',{symbol : getFormatSymbol(symbol),time_type : intervalRange[resolution]},data => {
      if (data && lastDataRef.current && data.time >= lastDataRef.current.time ) {
        subscribes[subscribeUID] = symbol
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
    setTimeout(() => onSymbolResolvedCallback({
      name: symbol,
      ticker : symbol,
      // full_name: symbol,
      description : type.isFuture && !Version.isOpen ? `${symbol}-MARK` : symbol,
      pricescale: 100,
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
    // chartConfig.overrides = type.isFuture 
    //   ? {...chartConfig.overrides,"scalesProperties.showSymbolLabels" :  true} 
    //   : {...chartConfig.overrides,"scalesProperties.showSymbolLabels" :  false}
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
      showLoad && showLoad(false)
      if(Type.isFuture && !Version.isOpen && !Version.isV1){
        // const suffix = config.version === 'v2' ? 'USD' : /^i/i.test(config.symbol) ? '' : 'USDT'
        // const pos = suffix ? config.symbol.indexOf(suffix) : config.symbol.length
        widgetRef.current.chart().createStudy('Overlay', true, false, [`${config.symbol}-INDEX`],null,{priceScale : 'as-series','color': '#aaa'})
      }
      // widgetRef.current.activeChart().createStudy('Moving Average', false, true, [7],null, {'Plot.color': 'rgba(241, 156, 56, 0.7)'});    
      // widgetRef.current.chart().createStudy('Moving Average', false, true, [25],null, {'Plot.color': 'rgba(116, 252, 253, 0.7)'});    
      // widgetRef.current.chart().createStudy('Moving Average', false, true, [99],null, {'Plot.color': 'rgba(234, 61, 247, 0.7)'});    
    })
  }


  useEffect(() => {
    if(config && config.symbol && interval && preload){
      spec = config
      initialize();
    }
    return () => {
      if(widgetRef.current){
        widgetRef.current.remove();
      }
      unsubscribeBars();
    }
  }, [interval,preload,config,type.current])

  return(
    <div id='tv-container'></div>
  )

}

export default inject('intl','type')(observer(TVChart))