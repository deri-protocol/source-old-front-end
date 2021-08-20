import React, { useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import { inject, observer } from 'mobx-react';


function ContractInfo({wallet,trading,lang}){

  return(
    <div className="contract-box">
      <div className='contract-header'></div>
      <div className="contract-info">
        <div className="conntract-header">{lang['contract-info']}</div>
        <div className="info">
          <div className="title">{lang['base-token']}</div>
          <div className="text" dangerouslySetInnerHTML={ {__html : trading.contract.bTokenSymbolDisplay && trading.contract.bTokenSymbolDisplay.map(bToken => bToken) }}>
            
          </div>
        </div>
        <div className="info">
          <div className="title">{lang['symbol']}</div>
          <div className="text">
            { trading.contract.symbol }
          </div>
        </div>
        <div className="info">
          <div className="title">{lang['multiplier']}</div>
          <div className="text">
            { trading.contract.multiplier }
          </div>
        </div>
        <div className="info">
          <div className="title">{lang['funding-rate-coefficient']}</div>
          <div className="text">
            { trading.contract.fundingRateCoefficient }
          </div>
        </div>
        <div className="info">
          <div className="title">{lang['min-initial-margin-ratio']}</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ trading.contract.minInitialMarginRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
        <div className="info">
          <div className="title">{lang['min-maintenance-margin-ratio']}</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ trading.contract.minMaintenanceMarginRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
        <div className="info">
          <div className="title">{lang['transaction-fee']}</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ trading.contract.feeRatio * 100 } decimalScale={3} suffix='%'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('wallet','trading')(observer(ContractInfo))