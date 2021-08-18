import React,{useRef,useEffect} from 'react'
import {io} from 'socket.io-client'
import { widget} from '../../../../lib/charting_library'
import { getFormatSymbol, intervalRange, calcRange } from '../../../../utils/utils';
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import chartConfig from './chart-config.json'

const supported_resolutions = ["1","5","15","30","60","240","1D","5D","1W","1M"];
const GET_KLINE_URL=`${process.env.REACT_APP_HTTP_URL}/get_kline`
const socket = io(process.env.REACT_APP_WSS_URL, {
  transports: ['websocket'],
  withCredentials: true
})


function TVChart({interval,symbol,showLoad,intl}){
  const widgetRef = useRef(null);
  const queryParamsRef = useRef(null);
  const lastQueryParamsRef = useRef(null);
  const lastDataRef = useRef(null);
  const updateKline = useRef(null)
  const datafeedRef = useRef({
    onReady: (callback) => {
      setTimeout(() => callback({supported_resolutions: supported_resolutions}),0);
    },
    getBars: (symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest) => getBars(symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest),
    resolveSymbol: (symbolName,onSymbolResolvedCallback) => resolveSymbol(symbolName,onSymbolResolvedCallback),
    subscribeBars : (symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback) => subscribeBars(symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback),
    unsubscribeBars : subscriberUID => unsubscribeBars(subscriberUID)
  });

  socket.on('connect',() => {
    socket.on('kline_update', data => {
      // && lastDataRef.current.time <= data.time && data.time_type === queryParamsRef.current.interval && data.symbol.toUpperCase() === queryParamsRef.current.formatSymbol.toUpperCase()
      if (updateKline.current) {
        updateKline.current(data)
      }
    })
  })

  const getBars = async (symbolInfo,resolution,from,to,onHistoryCallback,onErrorCallback,firstDataRequest) => {
    console.log('getBars')
    lastQueryParamsRef.current = queryParamsRef.current
    queryParamsRef.current = {symbol : symbolInfo.name.toUpperCase(),formatSymbol : getFormatSymbol(symbolInfo.name),interval : intervalRange[resolution]}
    const res = await axios.get(GET_KLINE_URL,{
      params : {
        symbol : queryParamsRef.current.formatSymbol,
        time_type: queryParamsRef.current.interval,
        from : from ,
        to : to 
      }
    });
    if(firstDataRequest && res && res.status === 200 && Array.isArray(res.data.data)){
      const klineData = res.data.data
      showLoad(false)
      onHistoryCallback(klineData)
      lastDataRef.current = klineData[klineData.length -1]
    } else {
      onHistoryCallback([],{noData: true})
    }
  }

  const subscribeBars = (symbolInfo,resolution,onRealtimeCallback,subscribeUID,onResetCacheNeededCallback) => {
    console.log('subscribeBars')
    socket.emit('get_kline_update',{symbol : getFormatSymbol(symbolInfo.name),time_type : queryParamsRef.current.interval,update : true})
    updateKline.current = onRealtimeCallback
  }

  const unsubscribeBars = subscriptUID => {
    console.log('unsubscribeBars')
    socket.emit('un_get_kline',{symbol : queryParamsRef.current.formatSymbol,time_type : queryParamsRef.current.interval})
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
    const widgetOptions = {
			symbol: symbol,
      datafeed: datafeedRef.current,
      interval: interval,
      locale: intl.locale,
      ...chartConfig
    }
    widgetRef.current  = new widget(widgetOptions);
    widgetRef.current.onChartReady(() => {
      showLoad && showLoad(false)
    })
  }



  useEffect(() => {
    if(symbol && interval){
      initialize();
    }
    return () => {
      if(widgetRef.current){
        widgetRef.current.remove();
      }
    }
  }, [symbol,interval])

  return(
    <div id='tv-container'></div>
  )

}

export default inject('intl')(observer(TVChart))