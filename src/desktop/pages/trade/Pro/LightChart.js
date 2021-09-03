import React, { useState, useEffect,useRef } from 'react'
import dateFormat from 'dateformat'
import {io} from 'socket.io-client'
import {createChart,CrosshairMode} from 'lightweight-charts'
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { getFormatSymbol, calcRange, intervalRange, equalIgnoreCase } from '../../../../utils/utils';


const socket = io(process.env.REACT_APP_WSS_URL, {
  transports: ['websocket'],
  withCredentials: true
})


function LightChart({symbol,interval = '1',displayCandleData,mixedChart}){
  const chartRef = useRef(null)
  const lastData = useRef(null)
  const queryParams = useRef(null);
  const lastQueryParam = useRef(null);
  const [loading, setLoading] = useState(true);
  const connectStatusRef = useRef()

  const onConnect = () => {
    socket.on('connect', () => {
      if(connectStatusRef.current && queryParams.current){
        console.log( `kline for :${queryParams.current.symbol} - ${queryParams.current.interval} reconnect`)
        socket.emit('get_kline_update', {'symbol': queryParams.current.symbol, 'time_type': queryParams.current.interval,updated : true})
      }
      connectStatusRef.current = true
    })
  }

  const unsubscribeMessage = (symbol,interval) => {
    socket.emit('un_get_kline',{symbol : symbol,'time_type' : interval})
  }

  const subscribeMessage = (symbol,interval,onMessage) => {
    if(socket.connected){
      socket.on('kline_update', data => {
        if (lastData.current && lastData.current.time <= data.time && data.time_type === interval && equalIgnoreCase(data.symbol,symbol)) {
          if(onMessage){
            onMessage(data)
          }
          lastData.current = data
        }
      })
      socket.emit('get_kline_update', {'symbol': symbol, 'time_type': interval,updated : true})
    }
  }

  const loadData = async (symbol) => {
    const range = calcRange(interval)
    lastQueryParam.current = queryParams.current
    queryParams.current = {symbol : symbol,interval : intervalRange[interval]}
    const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${queryParams.current.symbol}&time_type=${queryParams.current.interval}&from=${range[0]}&to=${range[1]}`
    setLoading(true)
    const res = await axios.get(url)
    setLoading(false)
    return res.data && Array.isArray(res.data.data) ? res.data.data  : []
  }

  const addCandleChart = async (chart,symbol,priceScaleId) => {
    if(symbol && chart){
       const candlesChart = chart.addCandlestickSeries({
        priceScaleId : priceScaleId,
        upColor: "#4bffb5",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        borderUpColor: "#4bffb5",
        wickDownColor: "#ff4976",
        wickUpColor: "#4bffb5"
      });
      const data = await loadData(symbol)
      if(data && Array.isArray(data) && data.length > 0 ){
        candlesChart.setData(data)
        lastData.current = data[data.length-1]
      } 
      displayCandleData({data : lastData.current})
      subscribeMessage(symbol,queryParams.current.interval,data => {
        candlesChart.update(data)
      });
    }
      
  }

  const addLineSeries = async (chart,symbol,priceScaleId) =>{
    if(chart && symbol){
      chart.applyOptions({
        leftPriceScale: {
          title : symbol,
          visible: true,
          borderColor: 'rgba(197, 203, 206, 1)',
        }
      })
      const seriesChart = chart.addLineSeries({
        priceScaleId: priceScaleId,
        topColor: "#569bda",
        bottomColor: "#569bda",
        lineColor: "#569bda",
        lineWidth: 2
      })
      const data = await loadData(symbol)
      const seriesData = data.map(d => ({time : d.time,value : d.close}));
      seriesChart.setData(seriesData)
      subscribeMessage(symbol,queryParams.current.interval,data => {
        const lineSeriesData = {time : data.time,value : data.close}
        seriesChart.update(lineSeriesData)
      });
    }
  }



  const handleCrosshairMoved = (param) => {
    if (!param.point) {
        return;
    }
    if(typeof displayCandleData === 'function'){
      param.seriesPrices.forEach(item => {
        if(item.open && item.close && item.high && item.low){
          const data = {time : param.time ,data : item}
          displayCandleData(data);
        }
      })
    }
  }

  const initChart = () => {
    if(chartRef.current && symbol && interval){
      const chart = createChart(chartRef.current, { 
        localization : {
          timeFormatter : businessDayOrTimestamp => {
            return dateFormat(businessDayOrTimestamp,'yyyy-mm-dd HH:MM')
          },
        },
        width: '1198',
        height: 478,
        timeScale: {
          rightOffset : 3,
          timeVisible : true,
          borderColor : '#fff',
          tickMarkFormatter: (time, tickMarkType, locale) => {
            const format = (interval === '1W' || interval === '1D') ? 'yyyy-mm-dd' : 'HH:MM'
            return dateFormat(time,format)
          },
        },
        priceScale: {
          borderColor: '#fff',
          mode: 1
        },

        rightPriceScale: {
          visible: true,
          borderColor: 'rgba(197, 203, 206, 1)',
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
      chart.subscribeCrosshairMove(handleCrosshairMoved);
      return chart;
    }
  }
    

  useEffect(() => {
    const chart = initChart()
    if(symbol){
      if(mixedChart){
        addLineSeries(chart,getFormatSymbol(symbol),'left');
        addCandleChart(chart,getFormatSymbol(`${symbol}-MARKPRICE`),'right');
      } else {
        addCandleChart(chart,getFormatSymbol(`${symbol}-MARKPRICE`),'right');  
      }
    }
    
    return () => {
      if(lastQueryParam.current){
        socket.emit('un_get_kline',{symbol : lastQueryParam.current.symbol,'time_type' : lastQueryParam.current.interval})
      }
      if(queryParams.current){
        socket.emit('un_get_kline',{symbol : queryParams.current.symbol,'time_type' : queryParams.current.interval})
      }
      connectStatusRef.current = null
      if(chart){
        chart.remove()
      }
    }
  }, [symbol,interval])

  useEffect(() => {
    onConnect();
  }, [])

  return(
    <div className='ligth-chart-container' id='ligth-chart-container' ref={chartRef}>
      <div className='loading' style={{display : loading ? 'block' : 'none'}}>
          <div className='spinner-border' role='status'>
              <span className='sr-only'></span>
          </div>
      </div>
    </div>
  )
}
export default  inject('intl')(observer(LightChart))