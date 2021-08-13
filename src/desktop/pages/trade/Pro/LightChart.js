import React, { useState, useEffect,useRef } from 'react'
import dateFormat from 'dateformat'

import {createChart} from 'lightweight-charts'
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { getFormatSymbol } from '../../../../utils/utils';
const secondsInRange = {
  '1' : 60,
  '5' : 300,
  '15' : 900,
  '30' : 1800,
  '60' : 3600,
  '1D' : 3600 * 24,
  '1W' : 3600 * 24 * 7
}
const intervalRange = {
  '1' : 'min',
  '5' : '5min',
  '15' : '15min',
  '30' : '30min',
  '60' : 'hour',
  '1D' : 'day',
  '1W' : 'week'
}

function LightChart({symbol,interval = '1',intl}){
  const chart = useRef(null)
  const [loading, setLoading] = useState(true);
  
  const formatDate = (time,type) => {
    switch (type) {
      case 'min':
        return dateFormat(time,'yyyy-mm-dd h:MM')
      default:
        break;
    }
  }

  const calcRange = (interval) => {
    const timestamp = new Date().getTime() /1000 ;
    let from,to;
    if(interval !== '1W') {
      to = Math.floor(timestamp / secondsInRange[interval] ) * secondsInRange[interval]
      from  = to - secondsInRange[interval] * 1440
    } else {
      to = Math.floor((timestamp - 345600) /secondsInRange[interval]) * secondsInRange[interval] + 345600
      from = to - secondsInRange[interval] * 1440
    }
    return [from,to]
   
  }

  const loadChart = async () => {
    if(symbol){
      const barSeries = chart.current.addBarSeries();
      const range = calcRange(interval)
      const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${getFormatSymbol(`${symbol}-MARKPRICE`)}&time_type=${intervalRange[interval]}&from=${range[0]}&to=${range[1]}`
      setLoading(true)
      const res = await axios.get(url)
      if(res && res.data) {
        const {data} = res
        if(data.data instanceof Array){
          barSeries.setData(data.data);
        } else {
          barSeries.setData([])
        }
        setLoading(false)
      }
    }
  }

  const initChart = () => {
    chart.current = createChart(document.querySelector('.ligth-chart-container'), { 
      localization : {
          locale: intl.locale
        },
        width: 1198,
        height: 468 
      });
    chart.current.applyOptions({
      timeScale: {
        timeVisible : true,
        borderColor : '#fff',
        tickMarkFormatter: (time, tickMarkType, locale) => {
          const current = new Date(time)
          return `${current.getHours() + 1} :${current.getMinutes()}`;
        },
      },
      priceScale: {
        borderColor: '#fff',
        mode: 1
      },
      crosshair: {
        vertLine: {
            color: '#fff',
            width: 0.5,
            visible: true,
            labelVisible: true,
        },
        horzLine: {
            color: '#fff',
            width: 0.5,
            visible: true,
            labelVisible: true,
        },
        mode: 1,
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
  }

  useEffect(() => {
    if(chart.current) {
      chart.current.remove()
      chart.current = null;
    }
    initChart();
    symbol && loadChart();
    return () => {}
  }, [symbol,interval])

  return(
    <div className='ligth-chart-container'>
      <div className='loading' style={{display : loading ? 'block' : 'none'}}>
          <div className='spinner-border' role='status'>
              <span className='sr-only'></span>
          </div>
      </div>
    </div>
  )
}
export default  inject('intl')(observer(LightChart))