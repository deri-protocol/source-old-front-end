import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { inject, observer } from 'mobx-react';


function ContractInfo({ wallet, trading, lang, type }) {

  return (
    <div className="contract-box">
      <div className='contract-header'></div>
      <div className="contract-info">
        <div className="conntract-header">{lang['contract-info']}</div>
        <div className="info">
          <div className="title">{lang['base-token']}</div>
          <div className="text" dangerouslySetInnerHTML={{ __html: trading.contract.bTokenSymbolDisplay && trading.contract.bTokenSymbolDisplay.map(bToken => bToken) }}>

          </div>
        </div>
        <div className="info">
          <div className="title">{lang['symbol']}</div>
          <div className="text">
            {trading.contract.symbol}
          </div>
        </div>

        {type.isFuture && <>
          <div className="info">
            <div className="title">{lang['multiplier']}</div>
            <div className="text">
              {trading.contract.multiplier}
            </div>
          </div>
          <div className="info">
            <div className="title">{lang['funding-rate-coefficient']}</div>
            <div className="text">
              {trading.contract.fundingRateCoefficient}
            </div>
          </div>
          <div className="info">
            <div className="title">{lang['min-initial-margin-ratio']}</div>
            <div className="text">
              <NumberFormat displayType='text' value={trading.contract.minInitialMarginRatio * 100} decimalScale={2} suffix='%' />
            </div>
          </div>
          <div className="info">
            <div className="title">{lang['min-maintenance-margin-ratio']}</div>
            <div className="text">
              <NumberFormat displayType='text' value={trading.contract.minMaintenanceMarginRatio * 100} decimalScale={2} suffix='%' />
            </div>
          </div>
        </>}
        {type.isOption && <>
          <div className="info">
            <div className="title">{lang['underlier']}</div>
            <div className="text">
              {trading.contract.underlier}
            </div>
          </div>
          <div className="info">
            <div className="title">{lang['strike']}</div>
            <div className="text">
              {trading.contract.strike}
            </div>
          </div>
          <div className="info">
            <div className="title">{lang['option-type']}</div>
            <div className="text">
              {trading.contract.optionType === 'C' ? `${lang['call']}`:`${lang['put']}`}
            </div>
          </div>
          <div className="info">
            <div className="title"> <span>{lang['min-trade-volume']} ( {lang['notional']} )</span> </div>
            <div className="text">
              {trading.contract.multiplier} {trading.config ? trading.config.unit:''}
            </div>
          </div>
          {/* <div className="info">
            <div className="title ">{lang['delta-funding-coefficient']}</div>
            <div className="text">
              {trading.contract.deltaFundingCoefficient}
            </div>
          </div> */}
          <div className="info">
            <div className="title"> <span title={trading.initialMarginRatioTip} className='margin-per'>{lang['initial-margin-ratio']}</span> </div>
            <div className="text">
              <NumberFormat displayType='text' value={trading.contract.initialMarginRatio * 100} decimalScale={2} suffix='%' />
            </div>
          </div>
          <div className="info">
            <div className="title"> <span title={trading.maintenanceMarginRatioTip} className='margin-per'> {lang['maintenance-margin-ratio']}</span> </div>
            <div className="text">
              <NumberFormat displayType='text' value={trading.contract.maintenanceMarginRatio * 100} decimalScale={2} suffix='%' />
            </div>
          </div>
        </>}
        <div className="info">
          
          {type.isFuture && <>
            <div className="title">{lang['transaction-fee']}</div>
          </>}
          {type.isOption && <>
            <div className="title">
              <span className="margin-per" title={trading.TransactionFeeTip}>{lang['transaction-fee']}</span>  
            </div>
          </>}
          <div className="text">
            <NumberFormat displayType='text' value={trading.contract.feeRatio * 100} decimalScale={3} suffix='%' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('wallet', 'trading', 'type')(observer(ContractInfo))