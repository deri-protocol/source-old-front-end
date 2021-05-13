import React, { useState, useEffect,useRef } from 'react'
import { getFundingRate } from "../../../../lib/web3js"
import NumberFormat from 'react-number-format'
import TradingViewChart from "./TradingViewChart";
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';

export default function TradingView({wallet = {},spec = {},indexPrice}){
  const [fundingRate, setFundingRate] = useState({
    fundingRate0 : '-',
    tradersNetVolume: '-'
  });
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const indexPriceRef = useRef()



  const loadFundingRate = async () => {
    if(wallet.isConnected()){
      const fundingRate = await getFundingRate(wallet.detail.chainId,spec.pool)
      setFundingRate(fundingRate)
    }
  }


  useEffect(() => {    
    if(indexPriceRef.current){
      indexPriceRef.current > indexPrice.index ? setIndexPriceClass('fall') : setIndexPriceClass('rise');
    }
    indexPriceRef.current = indexPrice.index
    return () => {      
    };
  }, [indexPrice.index]);

  useEffect(() => {
    loadFundingRate();
    return () => {
    };
  }, [wallet.detail.account,spec,indexPrice.index]);
  return (
    <div id="trading-view">
      <div className='right-top'>
        <div className='symbol-basetoken-text'>
          {spec.symbol} / {spec.bTokenSymbol} (10X)
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Index Price</div>
          <div className={indexPriceClass}><DeriNumberFormat value={indexPrice.index}/></div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'><span >Funding Rate Annual</span>  </div>
          <div className='trade-dashboard-value'> 
          <span className='funding-per'> 
            <DeriNumberFormat value={ fundingRate.fundingRate0 } decimalScale={4} suffix='%'/>
          </span>
          </div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Total Net Position</div>
          <div className='trade-dashboard-value'><DeriNumberFormat value={fundingRate.tradersNetVolume}/></div>
        </div>            
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Pool Total liquidity</div>
          <div className='trade-dashboard-value'> <DeriNumberFormat allowLeadingZeros={true} value={fundingRate.liquidity}  decimalScale={2}/> {spec.bTokenSymbol}</div>
        </div>
      </div>
      <div className='tradingview'>
        <TradingViewChart spec={spec} />
      </div>
  </div>
  )
}