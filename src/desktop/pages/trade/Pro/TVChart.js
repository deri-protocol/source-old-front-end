import React,{useRef,useEffect} from 'react'
import { widget} from '../../../../lib/charting_library'
import { getFormatSymbol, intervalRange, } from '../../../../utils/utils';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import chartConfig from './chart-config.json'
import webSocket from '../../../../model/WebSocket';

const supported_resolutions = ["1","5","15","30","60","240","1D","5D","1W","1M"];
const GET_KLINE_URL=`${process.env.REACT_APP_HTTP_URL}/get_kline`

function TVChart({interval,symbol,showLoad,intl,preload}){
  const widgetRef = useRef(null);
  const lastDataRef = useRef(null);
  const datafeedRef = useRef({
    onReady: (callback) => {
      setTimeout(() => callback({supported_resolutions: supported_resolutions}),0);
    },
    getBars: (symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest) => getBars(symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest),
    resolveSymbol: (symbolName,onSymbolResolvedCallback) => resolveSymbol(symbolName,onSymbolResolvedCallback),
    subscribeBars : (symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback) => subscribeBars(symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback),
    unsubscribeBars : subscriberUID => unsubscribeBars(subscriberUID)
  });

 

  const getBars = async (symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest) => {
    const res = await axios.get(GET_KLINE_URL,{
      params : {
        symbol : getFormatSymbol(symbolInfo.name),
        time_type: intervalRange[resolution],
        from : from ,
        to : to 
      }
    });
    if(res && res.status === 200 && Array.isArray(res.data.data)){
      const klineData = res.data.data
      showLoad(false)
      onHistoryCallback(klineData)
      lastDataRef.current = klineData[klineData.length -1]
    } else {
      onHistoryCallback([],{noData: true})
    }
  }

  const subscribeBars = (symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback) => {
    webSocket.subscribe('get_kline_update',{symbol : getFormatSymbol(symbolInfo.name),time_type : intervalRange[resolution]},data => {
      if (data && lastDataRef.current && data.time >= lastDataRef.current.time ) {
        onRealtimeCallback(data)
        lastDataRef.current = data
      }
    })
  }

  const unsubscribeBars = subscriptUID => {
    if(symbol){
      webSocket.unsubscribe('un_get_kline',{symbol : getFormatSymbol(symbol),time_type : intervalRange[interval]})
    }
  }

  const resolveSymbol = (symbol,onSymbolResolvedCallback) => {
    setTimeout(() => onSymbolResolvedCallback({
      name: symbol,
      pricescale: 100,
      ticker: symbol,
      minmov: 1,
      type: "crypto",
      has_intraday: true,
      intraday_multipliers: ["1","2","5","15","30","60","240","1D","7D","1W","1M"],
      has_weekly_and_monthly: true,
      has_no_volume: true,
      pro_name: symbol,
      has_daily: true,
      timezone : 'UTC',
      session: "24x7",
      exchange: "Deri",
      supported_resolutions : supported_resolutions
    }),0)
  }

  const initialize = () => {
    const timezone = Intl ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Etc/UTC'
    const widgetOptions = {
			symbol: symbol,
      datafeed: datafeedRef.current,
      interval: interval,
      locale: intl.locale,
      timezone : timezone,
      ...chartConfig
    }
    widgetRef.current  = new widget(widgetOptions);
    widgetRef.current.onChartReady(() => {
      showLoad && showLoad(false)
      widgetRef.current.chart().createStudy('Overlay', true, false, [symbol],null,{priceScale : 'as-series','color': '#aaa'})
      // widgetRef.current.activeChart().createStudy('Moving Average', false, true, [7],null, {'Plot.color': 'rgba(241, 156, 56, 0.7)'});    
      // widgetRef.current.chart().createStudy('Moving Average', false, true, [25],null, {'Plot.color': 'rgba(116, 252, 253, 0.7)'});    
      // widgetRef.current.chart().createStudy('Moving Average', false, true, [99],null, {'Plot.color': 'rgba(234, 61, 247, 0.7)'});    
    })
  }


  useEffect(() => {
    if(symbol && interval && preload){
      initialize();
    }
    return () => {
      if(widgetRef.current){
        widgetRef.current.remove();
      }
      unsubscribeBars();
    }
  }, [symbol,interval,preload])

  return(
    <div id='tv-container'></div>
  )

}

export default inject('intl')(observer(TVChart))