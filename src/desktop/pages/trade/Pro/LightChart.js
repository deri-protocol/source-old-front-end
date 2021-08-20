import React, { useState, useEffect,useRef } from 'react'
import dateFormat from 'dateformat'
import {io} from 'socket.io-client'
import {createChart,CrosshairMode} from 'lightweight-charts'
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { getFormatSymbol, calcRange, intervalRange } from '../../../../utils/utils';


const socket = io(process.env.REACT_APP_WSS_URL, {
  transports: ['websocket'],
  withCredentials: true
})


function LightChart({symbol,interval = '1',intl,displayCandleData}){
  const chart = useRef(null)
  const candleSeries = useRef(null);
  const lastData = useRef(null)
  const queryParams = useRef(null);
  const lastQueryParam = useRef(null);
  const [loading, setLoading] = useState(true);
  const connectStatusRef = useRef()

  const connectWs = () => {
    socket.on('connect', data => {
      if(connectStatusRef.current && queryParams.current){
        console.log( `kline for :${queryParams.current.symbol} - ${queryParams.current.interval} reconnect`)
        socket.emit('get_kline_update', {'symbol': queryParams.current.symbol, 'time_type': queryParams.current.interval,updated : true})
      }
      connectStatusRef.current = true
    })
  }

  const initWs = () => {
    if(connectStatusRef.current) {
      if(lastQueryParam.current){
        socket.emit('un_get_kline',{symbol : lastQueryParam.current.symbol,'time_type' : lastQueryParam.current.interval})
      }
      socket.emit('get_kline_update', {'symbol': queryParams.current.symbol, 'time_type': queryParams.current.interval,updated : true})
    }
    socket.on('kline_update', data => {
      let obj = {}
      if (lastData.current.time <= data.time && data.time_type === queryParams.current.interval && data.symbol.toUpperCase() === queryParams.current.symbol.toUpperCase()) {
        obj.time = data.time
        obj.low = Number(data.low)
        obj.high = Number(data.high)
        obj.open = Number(data.open)
        obj.close = Number(data.close)
        obj.volume = Number(data.volume)
        candleSeries.current.update(obj)
        lastData.current = obj
        displayCandleData && displayCandleData({data : obj})
      }
    })
  }

  const loadChart = async () => {
    if(symbol){
      candleSeries.current = chart.current.addCandlestickSeries({
        upColor: "#4bffb5",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        borderUpColor: "#4bffb5",
        wickDownColor: "#838ca1",
        wickUpColor: "#838ca1"
      });
      const range = calcRange(interval)
      lastQueryParam.current = queryParams.current
      queryParams.current = {symbol : getFormatSymbol(`${symbol}-MARKPRICE`),interval : intervalRange[interval]}
      const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${queryParams.current.symbol}&time_type=${queryParams.current.interval}&from=${range[0]}&to=${range[1]}`
      setLoading(true)
      const res = await axios.get(url)
      if(res && res.data) {
        const {data} = res
        if(data.data instanceof Array){
          const d = data.data
          candleSeries.current.setData(d);
          lastData.current = d[d.length-1]
        } else {
          candleSeries.current.setData([])
        }
        setLoading(false)
        displayCandleData && displayCandleData({data : lastData.current})
        initWs()
      }
    }
  }

  const handleCrosshairMoved = (param) => {
    if (!param.point) {
        return;
    }
    if(typeof displayCandleData === 'function'){
      const data = {time : param.time ,data : param.seriesPrices.values().next().value}
      displayCandleData(data);
    }
  }

  const initChart = () => {
    chart.current = createChart('ligth-chart-container', { 
      localization : {
        timeFormatter : businessDayOrTimestamp => {
          return dateFormat(businessDayOrTimestamp,'yyyy-mm-dd HH:MM')
        },
      },
      width: 1198,
      height: 468,
      timeScale: {
        rightOffset : 3,
        timeVisible : true,
        borderColor : '#fff',
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const format = (interval === '1W' || interval === '1D') ? 'yyyy-mm-dd HH:MM' : 'HH:MM'
          return dateFormat(time,format)
        },
      },
      priceScale: {
        borderColor: '#fff',
        mode: 1
      },
      crosshair: {
        mode: CrosshairMode.Normal,    
        vertLine: {
          color: '#fff',
          labelBackgroundColor : '#569bda'
        },
        horzLine: {
          color: '#fff',
          labelBackgroundColor : '#569bda'
        },
      },
      grid: {
        vertLines: {
            visible: false,
        },
        horzLines: {
            visible: false,
        },
      },
      layout: {
        backgroundColor: '#212327',
        textColor: '#aaa',
        fontSize: 12
      },
    });
  
    chart.current.subscribeCrosshairMove(handleCrosshairMoved);
  }

  useEffect(() => {
    if(chart.current) {
      chart.current.remove()
      chart.current = null;
    }
    if(candleSeries.current){
      candleSeries.current = null;
    }
    initChart();
    symbol && loadChart();
    return () => {
      chart.current.unsubscribeCrosshairMove(handleCrosshairMoved)
      if(lastQueryParam.current){
        socket.emit('un_get_kline',{symbol : lastQueryParam.current.symbol,'time_type' : lastQueryParam.current.interval})
      }
      if(queryParams.current){
        socket.emit('un_get_kline',{symbol : queryParams.current.symbol,'time_type' : queryParams.current.interval})
      }
    }
  }, [symbol,interval])

  useEffect(() => {
    connectWs();
    return () => {}
  }, [])

  return(
    <div className='ligth-chart-container' id='ligth-chart-container'>
      <div className='loading' style={{display : loading ? 'block' : 'none'}}>
          <div className='spinner-border' role='status'>
              <span className='sr-only'></span>
          </div>
      </div>
    </div>
  )
}
export default  inject('intl')(observer(LightChart))