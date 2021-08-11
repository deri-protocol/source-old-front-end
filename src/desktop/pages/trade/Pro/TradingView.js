import React, { useState, useEffect, useRef } from 'react'
import TradingViewChart from "./TradingViewChart";
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import {getIntrinsicPrice} from '../../../../lib/web3js/indexV2'
import { inject, observer } from 'mobx-react';

function TradingView({ version, trading, lang,type }) {
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const [markPriceClass, setMarkPriceClass] = useState('rise');
  const [markPrice,setMarkPrice] = useState();
  const indexPriceRef = useRef()
  const markPriceRef = useRef();

  useEffect(() => {
    if (indexPriceRef.current) {
      indexPriceRef.current > trading.index ? setIndexPriceClass('fall') : setIndexPriceClass('rise');
    }
    indexPriceRef.current = trading.index
    return () => {
    };
  }, [trading.index]);

  useEffect(() => {
    if(type.isOption){
      let mark =  getIntrinsicPrice(trading.index,trading.position.strikePrice,trading.position.isCall).plus(trading.position.timePrice).toString()
      if (markPriceRef.current > mark) {
        setMarkPriceClass('fall')
      } else {
        setMarkPriceClass('rise')
      }
      markPriceRef.current = mark
      setMarkPrice(mark)
    }
  },[trading.index])

  return (
    <div id="trading-view">
      <div className='right-top'>
        <div className='symbol-basetoken-text'>
          {(version.isV1 || version.isV2Lite) ? `${trading.config ? trading.config.symbol : 'BTCUSD'} / ${trading.config ? trading.config.bTokenSymbol : ''}  (10X)` : `${trading.config ? trading.config.symbol : 'BTCUSD'} (10X)`}
        </div>
       
        {type.isFuture && <>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{lang['index-price']}</div>
            <div className={indexPriceClass}><DeriNumberFormat value={trading.index} decimalScale={2} /></div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'><span >{lang['funding-rate-annual']}</span>  </div>
            <div className='trade-dashboard-value'>
              <span className='funding-per' title={trading.fundingRateTip}>
                <DeriNumberFormat value={trading.fundingRate.fundingRate0} decimalScale={4} suffix='%' />
              </span>
            </div>
          </div>
        </>}
        {type.isOption && <>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{trading.config?type.isOption ? trading.config.symbol.split('-')[0]:'':''}</div>
            <div >
              <span className={indexPriceClass}> <DeriNumberFormat value={trading.index} decimalScale={2} /> </span> | &nbsp;
              {lang['vol']} : <DeriNumberFormat value={trading.position.volatility} decimalScale={2} suffix='%' />
            </div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{lang['eo-mark-price']}</div>
            <div className={markPriceClass}><DeriNumberFormat value={markPrice} decimalScale={2} /></div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'><span >{lang['funding-rate-delta']}</span>  </div>
            <div className='trade-dashboard-value'>
              <span className='funding-per' title={trading.fundingRateDeltaTip}>
                <DeriNumberFormat value={trading.fundingRate.deltaFundingRate0} decimalScale={4}  />
              </span>
            </div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'><span >{lang['funding-rate-premium']}</span>  </div>
            <div className='trade-dashboard-value'>
              <span className='funding-per' title={trading.fundingRatePremiumTip}>
                <DeriNumberFormat value={trading.fundingRate.premiumFundingRate0} decimalScale={4} />
              </span>
            </div>
          </div>
        </>}
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>{lang['total-net-position']}</div>
          <div className='trade-dashboard-value'><DeriNumberFormat value={trading.fundingRate.tradersNetVolume} /></div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>{lang['pool-total-liquidity']}</div>
          <div className='trade-dashboard-value'> <DeriNumberFormat allowLeadingZeros={true} value={trading.fundingRate.liquidity} decimalScale={2} /> {trading.config && trading.config.bTokenSymbol}</div>
        </div>
      </div>
      <div className='tradingview'>
        <TradingViewChart symbol={trading.config && trading.config.symbol} lang={lang} version={version}  />
      </div>
    </div>
  )
}

export default inject('trading', 'version','type')(observer(TradingView))