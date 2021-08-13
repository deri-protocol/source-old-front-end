import React, { useState, useEffect,useRef } from 'react'
import dateFormat from 'dateformat'

import {createChart} from 'lightweight-charts'
import axios from 'axios';
import { inject, observer } from 'mobx-react';
import { getFormatSymbol } from '../../../../utils/utils';

function LightChart({symbol,interval = 'min',intl}){
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

  const loadChart = async () => {
    if(symbol){
      const barSeries = chart.current.addBarSeries();
      const timestamp = new Date().getTime();
      const to = Math.floor(timestamp / 60 /1000) * 60
      const from  = to - 60 * 1140
      const url = `${process.env.REACT_APP_HTTP_URL}/get_kline?symbol=${getFormatSymbol(`${symbol}-MARKPRICE`)}&time_type=${interval}&from=${from}&to=${to}`
      setLoading(true)
      const res = await axios.get(url)
      if(res && res.data) {
        const {data} = res
        barSeries.setData(data.data);
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