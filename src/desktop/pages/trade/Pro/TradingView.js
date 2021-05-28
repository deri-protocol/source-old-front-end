import React, { useState, useEffect,useRef } from 'react'
import TradingViewChart from "./TradingViewChart";
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';

function TradingView({version,trading}){
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
          {version.isV1 ? `${trading.config ? trading.config.symbol : 'BTCUSD'} / ${trading.config ? trading.config.bTokenSymbol : ''}  (10X)` : `${trading.config ? trading.config.symbol : 'BTCUSD'} (10X)`}
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Index Price</div>
          <div className={indexPriceClass}><DeriNumberFormat value={trading.index} decimalScale={2} /></div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'><span >Funding Rate Annual</span>  </div>
          <div className='trade-dashboard-value'> 
          <span className='funding-per' title={trading.fundingRateTip}> 
            <DeriNumberFormat value={ trading.fundingRate.fundingRate0 } decimalScale={4} suffix='%'/>
          </span>
          </div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Total Net Position</div>
          <div className='trade-dashboard-value'><DeriNumberFormat value={trading.fundingRate.tradersNetVolume}/></div>
        </div>            
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Pool Total liquidity</div>
          <div className='trade-dashboard-value'> <DeriNumberFormat allowLeadingZeros={true} value={trading.fundingRate.liquidity}  decimalScale={2}/> {trading.config && trading.config.bTokenSymbol}</div>
        </div>
      </div>
      <div className='tradingview'>
        <TradingViewChart symbol={trading.config && trading.config.symbol} />
      </div>
  </div>
  )
}

export default  inject('trading','version')(observer(TradingView))