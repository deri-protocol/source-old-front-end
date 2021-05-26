import React, { useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import { getSpecification } from '../../lib/web3js/indexV2';
import { inject, observer } from 'mobx-react';


function ContractInfo({wallet,trading}){

  // const [contract, setContract] = useState({
  //   bSymbol : 'USDT',
  //   symbol : 'BTCUSD',
  //   multiplier : '0.0001',
  //   fundingRateCoefficient : '0.0000025',
  //   minInitialMarginRatio : 0.1,
  //   minMaintenanceMarginRatio : 0.0005,
  //   feeRatio : 0.05
  // });

  // useEffect(() => {
  //   if(trading.contract.symbol){
  //     setContract(trading.contract)
  //   }
  //   return () => {};
  // }, [trading.config]);


  // useEffect(() => {
  //   if(wallet.detail.account){
  //     trading.init(wallet)
  //   }
  // },[wallet.detail.account])
  
  return(
    <div className="contract-box">
      <div className='contract-header'></div>
      <div className="contract-info">
        <div className="conntract-header">CONTRACT INFO</div>
        <div className="info">
          <div className="title">Base Token</div>
          <div className="text">
            { trading.contract.bSymbol }
          </div>
        </div>
        <div className="info">
          <div className="title">Symbol</div>
          <div className="text">
            { trading.contract.symbol }
          </div>
        </div>
        <div className="info">
          <div className="title">Multiplier</div>
          <div className="text">
            { trading.contract.multiplier }
          </div>
        </div>
        <div className="info">
          <div className="title">Funding Rate Coefficient</div>
          <div className="text">
            { trading.contract.fundingRateCoefficient }
          </div>
        </div>
        <div className="info">
          <div className="title">Min Initial Margin Ratio</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ trading.contract.minInitialMarginRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
        <div className="info">
          <div className="title">Min Maintenance Margin Ratio</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ trading.contract.minMaintenanceMarginRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
        <div className="info">
          <div className="title">Transaction Fee</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ trading.contract.feeRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('wallet','trading')(observer(ContractInfo))