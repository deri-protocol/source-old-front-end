import React, { useState, useEffect ,useRef} from 'react'
import {widget} from '../../../../lib/charting_library'
import datafeeds from './datafeeds/index'
import classNames from 'classnames';
const defaultProps = {
  containerId : 'tv_chart_container'
}
export default function TradingViewChart({spec = {}}){
  const [loading, setLoading] = useState(true);
  const [actived, setActived] = useState('thirty');
  const [deriWidget, setDeriWidget] = useState(null);

  const activedClass = classNames('btn',actived)

  const initialize = () => {
    const widgetOptions = {
			symbol: spec.symbol,
      datafeed: datafeeds,
      interval: localStorage.getItem('localResolutions') || '1D',
      container_id: defaultProps.containerId,
      library_path: `${process.env.PUBLIC_URL}/charting_library/`,
      locale: 'en',
      disabled_features: [
        'header_widget',
        'display_market_status',
        'timeframes_toolbar',
        'left_toolbar',
        'legend_context_menu',
        'adptive_logo',
        'use_localstorage_for_settings',
        'edit_buttons_in_legend',
        'control_bar',
        'move_logo_to_main_pane',
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
        'paneProperties.background': '#212327',
        'paneProperties.vertGridProperties.color': '#212327',
        'paneProperties.horzGridProperties.color': '#212327',
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.candleStyle.wickUpColor': '#76af8e',
        'mainSeriesProperties.candleStyle.wickDownColor': '#ee5766',
      },
      timezone: 'Asia/Beijing',
    }

		const w  = new widget(widgetOptions);

		w.onChartReady(() => {
      w.activeChart().setResolution('30',() => {
        setLoading(false)
      })
    });
    return w;
  }


  const  changeTime= (time,period) => {
    setLoading(true)
    setActived(period)
    deriWidget.chart().refreshMarks()
    deriWidget.activeChart().setResolution(time,() => {
      setLoading(false)
    })    
    
  }

  useEffect(() => {
    if(spec.symbol){
      setDeriWidget(initialize())
    }
    return () => {
      if (deriWidget !== null) {
        deriWidget.remove();
      }
    };
  }, [spec.symbol]);

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