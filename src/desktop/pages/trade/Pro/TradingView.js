import React, { useState, useEffect,useRef } from 'react'
import TradingViewChart from "./TradingViewChart";
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';

function TradingView({version,trading,lang}){
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const indexPriceRef = useRef()

  useEffect(() => {    
    if(indexPriceRef.current){
      indexPriceRef.current > trading.index ? setIndexPriceClass('fall') : setIndexPriceClass('rise');
    }
    indexPriceRef.current = trading.index
    return () => {      
    };
  }, [trading.index]);

  return (
    <div id="trading-view">
      <div className='right-top'>
        <div className='symbol-basetoken-text'>
          {(version.isV1 || version.isV2Lite || version.isOpen) ? `${trading.config ? trading.config.symbol : 'BTCUSD'} / ${trading.config ? trading.config.bTokenSymbol : ''}  (10X)` : `${trading.config ? trading.config.symbol : 'BTCUSD'} (10X)`}
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>{lang['index-price']}</div>
          <div className={indexPriceClass}><DeriNumberFormat value={trading.index} decimalScale={2} /></div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'><span >{lang['funding-rate-annual']}</span>  </div>
          <div className='trade-dashboard-value'> 
          <div className='hover-box'>
              <div>{trading.fundingRateTip}</div>
          </div>
          <span className='funding-per'> 
            <DeriNumberFormat value={ trading.fundingRate.fundingRate0 } decimalScale={4} suffix='%'/>
          </span>
          </div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>{lang['total-net-position']}</div>
          <div className='trade-dashboard-value'><DeriNumberFormat value={trading.fundingRate.tradersNetVolume}/></div>
        </div>            
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>{lang['pool-total-liquidity']}</div>
          <div className='trade-dashboard-value'> <DeriNumberFormat allowLeadingZeros={true} value={trading.fundingRate.liquidity}  decimalScale={2}/> {trading.config && trading.config.bTokenSymbol}</div>
        </div>
      </div>
      <div className='tradingview'>
        <TradingViewChart symbol={trading.config && trading.config.symbol} lang={lang} version={version} />
      </div>
  </div>
  )
}

export default  inject('trading','version')(observer(TradingView))