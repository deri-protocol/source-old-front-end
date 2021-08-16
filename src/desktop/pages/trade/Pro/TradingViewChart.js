import React, { useState, useEffect ,useRef} from 'react'
import {widget} from '../../../../lib/charting_library'
import datafeeds from './datafeeds/index'
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import Type from '../../../../model/Type';
import LightChart from './LightChart';
import { stripSymbol } from '../../../../utils/utils';
const defaultProps = {
  containerId : 'tv_chart_container'
}
function TradingViewChart({symbol,lang,intl,version}){
  const [loading, setLoading] = useState(true);
  const [actived, setActived] = useState('one');
  const [deriWidget, setDeriWidget] = useState(null);
  const [chartType, setChartType] = useState('')
  const [currentInterval, setCurrentInterval] = useState('1');
  const [candleDataDisplay, setCandleDataDisplay] = useState('')

  const activedClass = classNames('btn',actived)
  const switchClass = classNames('switcher',chartType)


  const initialize = () => {
    const widgetOptions = {
			symbol: symbol,
      datafeed: datafeeds,
      interval: currentInterval,
      container_id: defaultProps.containerId ,
      library_path: `/charting_library/`,      
      custom_css_url : `/style/tradingview-overide.css`,
      locale: intl.locale,
      disabled_features: [
        "header_widget",
        "timeframes_toolbar",
        "go_to_date",
      ],
      enabled_features: [
        'show_logo_on_all_charts'
      ],
      charts_storage_url: 'https://saveload.tradingview.com',
      charts_storage_api_version: '1.14',
      client_id: 'tradingview.com',
      user_id: 'public_user_id',
      fullscreen: false,
      autosize: true,
      overrides: {        
        "paneProperties.background": "#212327",
        "paneProperties.vertGridProperties.color": "#212327",
        "paneProperties.horzGridProperties.color": "#212327",
        "scalesProperties.textColor" : "#aaa" ,
        "mainSeriesProperties.candleStyle.upColor": "#4bffb5",
        "mainSeriesProperties.candleStyle.downColor": "#d75442",
        "mainSeriesProperties.candleStyle.borderColor": "#378658",
        "mainSeriesProperties.candleStyle.borderUpColor": "#4bffb5",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ff4976",
        "mainSeriesProperties.candleStyle.wickUpColor": '#838ca1',
        "mainSeriesProperties.candleStyle.wickDownColor": '#838ca1',
      },      
      studies_overrides: {
        "compare.plot.color": "rgb(86, 155, 218)",
      },
      toolbar_bg: "#212327",
      timezone: "Asia/Shanghai", 
      session: "24x7"
    }

    const w  = new widget(widgetOptions);
    w.onChartReady(() => {
      setTimeout(() => setLoading(false),500)
    })
    return w;
  }


  const  changeTime= (time,period) => {
    setActived(period)
    setCurrentInterval(time)
    deriWidget.activeChart().setResolution(time,() => {
      deriWidget.chart().refreshMarks()
    })        
  }

  const switchChart = (type) => {
    setChartType(type)
  }

  const displayCandleData = candle => {
    if(candle && candle.data){
      const {data} = candle
      setCandleDataDisplay(
        `O: ${data.open.toFixed(2)} H: ${data.high.toFixed(2)} L: ${data.low.toFixed(2)} C: ${data.close.toFixed(2)}`
      )
    }
  }

  useEffect(() => {
    if(symbol){
      setDeriWidget(initialize())
    }
    if(Type.isOption){
      setChartType('mark-price')
    } else {
      setChartType('index-price')
    }
    return () => {
      if (deriWidget !== null) {
        deriWidget.remove();
      }
    };
  }, [symbol,version.current]);

  return(
    <div id='tradingview'>
      {Type.isOption &&<div className={switchClass}>
        <span className='mark-price-c' onClick={() => switchChart('mark-price')}>Option Mark Price</span>
        <span className='index-price-c' onClick={() => switchChart('index-price')}>{stripSymbol(symbol) || 'index'} Price</span>
      </div>}
      <div className={activedClass}>
          <span className='candle-data-area'>
            <span className='symbol-value' style={{display : chartType === 'mark-price' ? 'inline-block' : 'none'}}>
              {candleDataDisplay && symbol}
            </span>
            <span className='candle-data'style={{display : chartType === 'mark-price' ? 'inline-block' : 'none'}}>
              {candleDataDisplay}
            </span>
          </span>
          <span className='interval'>
            <span className='tab-btn one' onClick={() => changeTime('1','one')} >1{lang['min']}</span>
            <span className='tab-btn five' onClick={() => changeTime('5','five')}>5{lang['min']}</span>
            <span className='tab-btn fifteen' onClick={() => changeTime('15','fifteen')}>15{lang['min']}</span>
            <span className='tab-btn thirty' onClick={() => changeTime('30','thirty')}>30{lang['min']}</span>
            <span className='tab-btn sixty' onClick={() => changeTime('60','sixty')}>1{lang['hour']}</span>
            <span className='tab-btn one-day' onClick={() => changeTime('1D','one-day')}>1{lang['day']}</span>
            <span className='tab-btn one-week' onClick={() => changeTime('1W','one-week')}>1{lang['week']}</span>
          </span>
      </div>
      <div className='loading' style={{display : loading ? 'block' : 'none'}}>
          <div className='spinner-border' role='status'>
              <span className='sr-only'></span>
          </div>
      </div>
      <div id={defaultProps.containerId} style={{display : chartType === 'index-price' ? 'block' : 'none'}}></div>
      {Type.isOption && <div id='lightweight-chart' style={{display : chartType === 'mark-price' ? 'block' : 'none'}}>
        <LightChart symbol={symbol} interval={currentInterval} displayCandleData={displayCandleData} />
      </div>}
  </div>
  )
}
export default inject('intl','trading')(observer(TradingViewChart))
