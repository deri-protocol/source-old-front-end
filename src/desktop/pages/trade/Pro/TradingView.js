import React, { useState, useEffect,useRef } from 'react'
import { getFundingRate } from "../../../../lib/web3js"
import NumberFormat from 'react-number-format'
import TradingViewChart from "./TradingViewChart";

export default function TradingView({wallet = {},spec = {},indexPrice}){
  const [fundingRate, setFundingRate] = useState({
    fundingRate0 : '-',
    tradersNetVolume: '-'
  });
  const [indexPriceClass, setIndexPriceClass] = useState('');
  const indexPriceRef = useRef()



  const loadFundingRate = async () => {
    if(wallet.chainId){
      const fundingRate = await getFundingRate(wallet.chainId,spec.pool)
      setFundingRate(fundingRate)
    }
  }


  useEffect(() => {    
    if(indexPriceRef.current){
      indexPriceRef.current > indexPrice ? setIndexPriceClass('fall') : setIndexPriceClass('rise');
    }
    indexPriceRef.current = indexPrice
    return () => {      
    };
  }, [indexPrice]);

  useEffect(() => {
    loadFundingRate();
    return () => {
    };
  }, [wallet,spec,indexPrice]);
  return (
    <div id="trading-view">
      <div className='right-top'>
        <div className='symbol-basetoken-text'>
          {spec.symbol} / {spec.bTokenSymbol} (10X)
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Index Price</div>
          <div className={indexPriceClass}><NumberFormat value={indexPrice} displayType='text'/></div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'><span >Funding Rate Annual</span>  </div>
          <div className='trade-dashboard-value'> 
          <span className='funding-per'> 
            <NumberFormat value={ fundingRate.fundingRate0 } displayType='text' decimalScale={4} suffix='%'/>
          </span>
          </div>
        </div>
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Total Net Position</div>
          <div className='trade-dashboard-value'>{fundingRate.tradersNetVolume}</div>
        </div>            
        <div className='trade-dashboard-item latest-price'>
          <div className='trade-dashboard-title'>Pool Total liquidity</div>
          <div className='trade-dashboard-value'> <NumberFormat allowLeadingZeros={true} value={fundingRate.liquidity || '--'} displayType='text' decimalScale={2}/> {spec.bTokenSymbol}</div>
        </div>
      </div>
      <div className='tradingview'>
        <TradingViewChart spec={spec} />
      </div>
  </div>
  )
}