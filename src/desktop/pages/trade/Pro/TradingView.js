import React, { useState, useEffect, useRef } from 'react'
import Chart from "./Chart";
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { bg, DeriEnv } from '../../../../lib/web3js/indexV2'
import { inject, observer } from 'mobx-react';
import TipWrapper from '../../../../components/TipWrapper/TipWrapper';

function TradingView({ version, trading, lang, type }) {
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const [markPriceClass, setMarkPriceClass] = useState('rise');
  const [markPrice, setMarkPrice] = useState();
  const [rate,setRate] = useState('')
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
      let mark = trading.position.markPrice
      if (markPriceRef.current > mark) {
        setMarkPriceClass('fall trade-dashboard-value')
      } else {
        setMarkPriceClass('rise trade-dashboard-value')
      }
      markPriceRef.current = mark
      setMarkPrice(mark)
  }, [trading.index, trading.position])

  useEffect(()=>{
    if(trading.fundingRate.funding0 && trading.position.markPrice){
      let num =  bg(trading.fundingRate.funding0).div(bg(trading.position.markPrice) ).times(bg(100)).toString()
      setRate(num)
    }
  },[trading.fundingRate,trading.position])

  return (
    <div id="trading-view">
      <div className='right-top'>
        <div className='symbol-basetoken-text'>
          {type.isOption ? `${trading.config ? trading.config.symbol : ''}` : (version.isV1 || version.isV2Lite || version.isOpen) ? `${trading.config ? trading.config.symbol : 'BTCUSD'} / ${trading.config ? trading.config.bTokenSymbol : ''}  (10X)` : `${trading.config ? trading.config.symbol : 'BTCUSD'} (10X)`}
        </div>
        {type.isFuture && <>
          {!version.isOpen && <>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{lang['mark-price']}</div>
            <div className={markPriceClass}><DeriNumberFormat value={markPrice} decimalScale={2} /></div>
          </div>
          </>}
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{lang['index-price']}</div>
            <div className={indexPriceClass}><DeriNumberFormat value={trading.index} decimalScale={2} /></div>
          </div>
          
          <div className='trade-dashboard-item latest-price'>
            {(version.isOpen || version.isV1) && <>
              <div className='trade-dashboard-title'><span >{lang['funding-rate-annual']}</span>  </div>
              <div className='trade-dashboard-value'>
                <TipWrapper block={false}>
                  <span className='funding-per' tip={trading.fundingRateTip || ''}>
                    <DeriNumberFormat value={trading.fundingRate.fundingRate0} decimalScale={4} suffix='%' />
                  </span>
                </TipWrapper>
              </div>
            </>}
            {!version.isOpen && <>
              <div className='trade-dashboard-title'><span >{lang['funding-rate']}</span>  </div>
              <div className='trade-dashboard-value'>
                <TipWrapper block={false}>
                  <span className='funding-per' tip={trading.dpmmFundingRateTip || ''}>
                    <DeriNumberFormat value={trading.fundingRate.funding0} decimalScale={4}  />
                  </span>
                </TipWrapper>
                <TipWrapper block={false}>
                &nbsp;  <span className='funding-per' tip={trading.rateTip || ''}>
                    (<DeriNumberFormat value={rate} decimalScale={4} suffix='%'  />)
                  </span>
                </TipWrapper>
              </div>
            </>}
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{lang['total-net-position']}</div>
            <div className='trade-dashboard-value'>
              <TipWrapper block={false}>
                <span className='funding-per' tip={trading.TotalNetPositionTip || ''}>
                  <DeriNumberFormat value={trading.fundingRate.tradersNetVolume} />
                </span>
              </TipWrapper>
            </div>
          </div>
        </>}
        {type.isOption && <>
          <div className='trade-dashboard-item latest-price option-price-weight'>
            <div className='trade-dashboard-title'>{lang['eo-mark-price']}</div>
            <div className={markPriceClass}><DeriNumberFormat value={markPrice} decimalScale={4} /></div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title option-symbol'>{trading.config ? type.isOption ? trading.config.symbol.split('-')[0] : '' : ''}</div>
            <div className='trade-dashboard-value'>
              <span > <DeriNumberFormat value={trading.index} decimalScale={2} /> </span><span className='vol'> | </span>
              {lang['vol']} : <DeriNumberFormat value={trading.position.volatility} decimalScale={2} suffix='%' />
            </div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'><span >{lang['funding-rate']}</span>  </div>
            <div className='trade-dashboard-value'>
              <TipWrapper block={false}>
                <span className='funding-per' tip={trading.optionFundingRateTip || ''}>
                  <DeriNumberFormat value={trading.fundingRate.premiumFunding0} decimalScale={4} />
                </span>
              </TipWrapper>
            </div>
          </div>
          <div className='trade-dashboard-item latest-price'>
            <div className='trade-dashboard-title'>{lang['total-net-position']}</div>
            <div className='trade-dashboard-value'><DeriNumberFormat value={bg(trading.fundingRate.tradersNetVolume).times(trading.contract.multiplier).toString()} decimalScale={4} /></div>
          </div>
        </>}
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>{lang['pool-total-liquidity']}</div>
          <div className='trade-dashboard-value'> <DeriNumberFormat allowLeadingZeros={true} thousandSeparator={true} value={trading.fundingRate.liquidity} decimalScale={2} /> {trading.config && trading.config.bTokenSymbol}</div>
        </div>
      </div>
      <div className='tradingview'>
        <Chart symbol={trading.config && trading.config.symbol} lang={lang} version={version} />
      </div>
    </div>
  )
}

export default inject('trading', 'version', 'type')(observer(TradingView))