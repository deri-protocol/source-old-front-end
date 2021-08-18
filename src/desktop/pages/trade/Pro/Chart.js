import React, { useState, useEffect ,useRef} from 'react'
import datafeeds from './datafeeds/index'
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import Type from '../../../../model/Type';
import LightChart from './LightChart';
import { stripSymbol } from '../../../../utils/utils';
import TVChart from './TVChart';

function Chart({symbol,lang,intl,version}){
  const [loading, setLoading] = useState(true);
  const [actived, setActived] = useState('one');
  const [chartType, setChartType] = useState('')
  const [currentInterval, setCurrentInterval] = useState('1');
  const [candleDataDisplay, setCandleDataDisplay] = useState('')

  const activedClass = classNames('btn',actived)
  const switchClass = classNames('switcher',chartType)


  const changeTime= (time,period) => {
    setActived(period)
    setCurrentInterval(time) 
  }

  const switchChart = (type) => {
    setChartType(type)
  }

  const displayCandleData = candle => {
    if(candle && candle.data){
      const {data} = candle
      const riseOrDown = data.close - data.open > 0 ? 'rise' : 'down'
      setCandleDataDisplay(
        <>
          <span>O</span><span className={riseOrDown}>{data.open.toFixed(2)}</span>
          <span>H</span> <span className={riseOrDown}> {data.high.toFixed(2)}</span>
          <span>L</span><span className={riseOrDown}>{data.low.toFixed(2)}</span>
          <span>C</span><span className={riseOrDown}>{data.close.toFixed(2)}</span>
        </>
      )
    }
  }

  useEffect(() => {
    if(Type.isOption){
      setChartType('mark-price')
    } else {
      setChartType('index-price')
    }
    return () => {};
  }, []);

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
            <span className='candle-data' style={{display : chartType === 'mark-price' ? 'inline-block' : 'none'}}>
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
      <div style={{display : chartType === 'index-price' ? 'block' : 'none'}}>
        <TVChart symbol={symbol} interval={currentInterval} showLoad={isShow => setLoading(isShow)}/>
      </div>
      {Type.isOption && <div id='lightweight-chart' style={{display : chartType === 'mark-price' ? 'block' : 'none'}}>
        <LightChart symbol={symbol} interval={currentInterval} displayCandleData={displayCandleData} showLoad={isShow => setLoading(isShow)}/>
      </div>}
  </div>
  )
}
export default inject('intl','trading')(observer(Chart))
