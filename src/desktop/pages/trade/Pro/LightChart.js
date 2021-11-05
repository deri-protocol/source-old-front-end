import React, { useState, useEffect,useRef,useCallback } from 'react'
import dateFormat from 'dateformat'
import {createChart,CrosshairMode} from 'lightweight-charts'
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { getFormatSymbol, calcRange, intervalRange, equalIgnoreCase, stripSymbol, secondsInRange } from '../../../../utils/utils';
import webSocket from '../../../../model/WebSocket';
import classNames from 'classnames';


function LightChart({interval = '1',displayCandleData,mixedChart,lang,showLoad,preload,trading}){
  const containerRef = useRef(null);
  const chartRef = useRef(null)
  const firstData = useRef(null)
  const symbolRef = useRef(null)
  const candlesChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const lineSeriesHistoryRef = useRef([]);
  const candlesSeriesHistoryRef = useRef([]);
  const [scrolling, setScrolling] = useState(false)

  const scrollClassName = classNames('scroll-mask',{
    show : scrolling
  })


  const loadData = async (symbol,from,to,hiddenLoading) => {
    const range = from && to ? [from,to] : calcRange(interval)
    const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${symbol}&time_type=${intervalRange[interval]}&from=${range[0]}&to=${range[1]}`
    !hiddenLoading && showLoad(true)
    const res = await axios.get(url)
    showLoad(false)
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
        wickUpColor: "#4bffb5",
        priceFormat: {        
            // precision: 4,
            // minMove : '0.0001',
            // formatter: price => '$' + price.toFixed(4),
        }
      });
      const data = await loadData(symbol)
      if(data && Array.isArray(data) && data.length > 0 ){
        candlesChart.setData(data)
        firstData.current = data[0]
        candlesSeriesHistoryRef.current = data
      } 
      displayCandleData({data : data[data.length-1]})
      webSocket.subscribe('get_kline_update',{symbol,time_type : intervalRange[interval]},data => {
        if (!candlesSeriesHistoryRef.current.some(his => his.time === data.time)){
          candlesChart.update(data)
          candlesSeriesHistoryRef.current = [...candlesSeriesHistoryRef.current,data]
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
      const seriesChart = lineChartRef.current = chart.addLineSeries({
        priceScaleId: priceScaleId,
        topColor: "#569bda",
        bottomColor: "#569bda",
        lineColor: "#569bda",
        lineWidth: 2
      })
      const data = await loadData(symbol)
      const seriesData = data.map(d => ({time : d.time,value : d.close}));
      seriesChart.setData(seriesData)
      lineSeriesHistoryRef.current = seriesData
      webSocket.subscribe('get_kline_update',{symbol,time_type : intervalRange[interval]},data => {
        // if(!lineSeriesHistoryRef.current.some(his => his.time === data.time )){
          const lineSeriesData = {time : data.time,value : data.close}
          seriesChart.update(lineSeriesData)
        // }
      })
    }
  }

  const handleCrosshairMoved = param => {
    if (!param.point) {
        return;
    }
    if(typeof displayCandleData === 'function'){
      param.seriesPrices.forEach(item => {
        if(item && item.open && item.close && item.high && item.low){
          const data = {time : param.time ,data : item}
          displayCandleData(data);
        }
      })
    }
  }

  const switchSeriesChart = (series,priceScaleId) => {
    series.applyOptions({
      visible: !series.options().visible,
    });
    if(containerRef.current){
      const chart = containerRef.current
      chart.applyOptions({
        [`${priceScaleId}PriceScale`] : {visible : !chart.options()[`${priceScaleId}PriceScale`].visible}
      })
    }
  }

  const initChart = (symbol) => {
    if(chartRef.current &&   symbol && interval){
      const chart = createChart(chartRef.current, { 
        localization : {
          timeFormatter : businessDayOrTimestamp => {
            return dateFormat(businessDayOrTimestamp,'yyyy-mm-dd HH:MM')
          },
        },
        width: '1198',
        height: 478,
        timezone: Intl ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Etc/UTC',
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
    const symbols = []
    let chart ;
    if(trading.config && preload){
      const {symbol} = trading.config
      chart = containerRef.current = initChart(symbol)
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
    let timer = null;
    const onVisibleLogicalRangeChanged = () => {
      if(timer == null && !scrolling){
        timer = setTimeout(async () => {
          const logicalRange = chart.timeScale().getVisibleLogicalRange();
          const barsInfo = candlesChartRef.current && candlesChartRef.current.barsInLogicalRange(logicalRange);
          if (barsInfo !== null && barsInfo.barsBefore < -10) {
            setScrolling(true)
            const to = Math.floor((candlesSeriesHistoryRef.current[0].time - 1 * secondsInRange[interval]) / 1000,0)
            const from = to - (Math.abs(Math.floor(barsInfo.barsBefore,0)) -1) * secondsInRange[interval]
            const symbol = getFormatSymbol(`${trading.config.symbol}-MARKPRICE`)
            const markPriceData = await loadData(symbol,from,to,true)
            let history ;
            if(candlesSeriesHistoryRef.current && candlesChartRef.current && markPriceData.length > 0) {
              history = [...markPriceData,...candlesSeriesHistoryRef.current];
              candlesChartRef.current.setData(history);
              candlesSeriesHistoryRef.current = history;
            }
            if(mixedChart && markPriceData.length > 0){
              const indexPriceData = await loadData(getFormatSymbol(`${trading.config.symbol}`),from,to,true)
              if(lineSeriesHistoryRef.current && lineChartRef.current && indexPriceData.length > 0){
                const seriesData = indexPriceData.map(d => ({time : d.time,value : d.close}));
                history = [...seriesData,...lineSeriesHistoryRef.current];
                lineChartRef.current.setData(history)
                lineSeriesHistoryRef.current = history;
              }
            }
            setScrolling(false)
          }
          timer = null;
        },500)
      }
    }
  
    chart && chart.timeScale().subscribeVisibleLogicalRangeChange(onVisibleLogicalRangeChanged);
    
    return () => {
      if(symbolRef.current){
        symbolRef.current.forEach(symbol => webSocket.unsubscribe('un_get_kline',{symbol,time_type : intervalRange[interval]}))
      }
      if(chart){
        candlesChartRef.current &&  chart.removeSeries(candlesChartRef.current)
        lineChartRef.current && chart.removeSeries(lineChartRef.current)
        chart.remove();
      }
      candlesChartRef.current = null;
      lineChartRef.current = null
    }
  }, [interval,preload,trading.config])

  return(
    <div className='ligth-chart-container' id='ligth-chart-container' ref={chartRef}>
      <div className={scrollClassName} ></div>
      {mixedChart && <div className='legend'>
        <div onClick={() => switchSeriesChart(candlesChartRef.current,'right')} ><span className='legend-option-left'> </span><span className='legend-option-right'> </span>{lang['option']}</div>
        <div onClick={() => switchSeriesChart(lineChartRef.current,'left')} ><span  className='legend-index'></span>{trading.config && stripSymbol(`${trading.config.symbol}`)}</div>
      </div>}
    </div>
  )
}
export default  inject('intl','trading')(observer(LightChart))