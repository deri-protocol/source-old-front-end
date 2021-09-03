import React, { useState, useEffect,useRef } from 'react'
import dateFormat from 'dateformat'
import {createChart,CrosshairMode} from 'lightweight-charts'
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { getFormatSymbol, calcRange, intervalRange, equalIgnoreCase } from '../../../../utils/utils';
import webSocket from '../../../../model/WebSocket';


function LightChart({symbol,interval = '1',displayCandleData,mixedChart}){
  const chartRef = useRef(null)
  const lastData = useRef(null)
  const symbolRef = useRef(null)
  const candlesChartRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (symbol) => {
    const range = calcRange(interval)
    const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${symbol}&time_type=${intervalRange[interval]}&from=${range[0]}&to=${range[1]}`
    setLoading(true)
    const res = await axios.get(url)
    setLoading(false)
    return res.data && Array.isArray(res.data.data) ? res.data.data  : []
  }

  const addCandleChart = async (chart,symbol,priceScaleId) => {
    if(symbol && chart){
       const candlesChart = candlesChartRef.current = chart.addCandlestickSeries({
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
      webSocket.subscribe('get_kline_update',{symbol,time_type : intervalRange[interval]},data => {
        if (lastData.current && lastData.current.time <= data.time) {
          candlesChart.update(data)
          lastData.current = data
        }
      })
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
      webSocket.subscribe('get_kline_update',{symbol,time_type : intervalRange[interval]},data => {
        const lineSeriesData = {time : data.time,value : data.close}
        seriesChart.update(lineSeriesData)
      })
    }
  }

  const handleCrosshairMoved = param => {
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
    const symbols = []
    if(symbol){
      if(mixedChart){
        addLineSeries(chart,getFormatSymbol(symbol),'left');
        symbols.push(getFormatSymbol(symbol))
        addCandleChart(chart,getFormatSymbol(`${symbol}-MARKPRICE`),'right');
        symbols.push(getFormatSymbol(`${symbol}-MARKPRICE`))
      } else {
        addCandleChart(chart,getFormatSymbol(`${symbol}-MARKPRICE`),'right');  
        symbols.push(getFormatSymbol(`${symbol}-MARKPRICE`))
      }
      symbolRef.current = symbols
    }

    function onVisibleLogicalRangeChanged(newVisibleLogicalRange) {
      console.log(newVisibleLogicalRange)
      const barsInfo = candlesChartRef.current.barsInLogicalRange(newVisibleLogicalRange);
      // if there less than 50 bars to the left of the visible area
      console.log(barsInfo)
      if (barsInfo !== null && barsInfo.barsBefore < 50) {
          // try to load additional historical data and prepend it to the series data
      }
    }
  
    chart && chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
    
    return () => {
      if(chart){
        chart.remove()
      }
      if(symbolRef.current){
        symbolRef.current.forEach(symbol => webSocket.unsubscribe('un_get_kline',{symbol,time_type : intervalRange[interval]}))
      }
    }
  }, [symbol,interval])

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