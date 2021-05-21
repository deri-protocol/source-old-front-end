import React, { useState, useEffect ,useRef} from 'react'
import {widget} from '../../../../lib/charting_library'
import datafeeds from './datafeeds/index'
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
const defaultProps = {
  containerId : 'tv_chart_container'
}
function TradingViewChart({symbol}){
  const [loading, setLoading] = useState(true);
  const [actived, setActived] = useState('one-day');
  const [deriWidget, setDeriWidget] = useState(null);
  const [currentInterval, setCurrentInterval] = useState('1D');

  const activedClass = classNames('btn',actived)

  const initialize = () => {
    const widgetOptions = {
			symbol: symbol,
      datafeed: datafeeds,
      interval: currentInterval,
      container_id: defaultProps.containerId,
      library_path: `/charting_library/`,      
      custom_css_url : `/style/tradingview-overide.css`,
      locale: 'en',
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
        "mainSeriesProperties.candleStyle.upColor": "#53B987",
        "mainSeriesProperties.candleStyle.downColor": "#EB4D5C",
        "symbolWatermarkProperties.transparency": 90,
        "mainSeriesProperties.candleStyle.wickUpColor": "#53B987",
        "mainSeriesProperties.candleStyle.wickDownColor": "#EB4D5C",
        "mainSeriesProperties.candleStyle.drawBorder": true,
        "mainSeriesProperties.candleStyle.borderUpColor" : "#53B987",
        "mainSeriesProperties.candleStyle.borderDownColor" : "#EB4D5C",
        "scalesProperties.textColor": "#AAA",
      },      
      toolbar_bg: "#212327",
      timezone: "Asia/Shanghai", 
      session: "24x7"
    }

    const w  = new widget(widgetOptions);
    document.querySelector("iframe").addEventListener("load", function(e) {
      setTimeout(() => setLoading(false),500)
    });
    return w;
  }


  const  changeTime= (time,period) => {
    setActived(period)
    setCurrentInterval(time)
    deriWidget.chart().refreshMarks()
    deriWidget.activeChart().setResolution(time)        
  }

  useEffect(() => {
    if(symbol){
      setDeriWidget(initialize())
    }
    return () => {
      if (deriWidget !== null) {
        deriWidget.remove();
      }
    };
  }, [symbol]);

  return(
    <div id='tradingview'>
      <div className={activedClass}>
          <span className='tab-btn one' onClick={() => changeTime('1','one')} >1min</span>
          <span className='tab-btn five' onClick={() => changeTime('5','five')}>5min</span>
          <span className='tab-btn fifteen' onClick={() => changeTime('15','fifteen')}>15min</span>
          <span className='tab-btn thirty' onClick={() => changeTime('30','thirty')}>30min</span>
          <span className='tab-btn sixty' onClick={() => changeTime('60','sixty')}>1hour</span>
          <span className='tab-btn one-day' onClick={() => changeTime('1D','one-day')}>1day</span>
          <span className='tab-btn one-week' onClick={() => changeTime('1W','one-week')}>1week</span>
      </div>
      <div className='loading' style={{display : loading ? 'block' : 'none'}}>
          <div className='spinner-border' role='status'>
              <span className='sr-only'></span>
          </div>
      </div>
      <div id={defaultProps.containerId}>        
      </div>
  </div>
  )
}
export default inject('trading')(observer(TradingViewChart))
