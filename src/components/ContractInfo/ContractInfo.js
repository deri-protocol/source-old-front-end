import React, { useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import { getSpecification } from '../../lib/web3js';


export default function ContractInfo({wallet,spec ={}}){
  const [contract, setContract] = useState({
    bSymbol : 'USDT',
    symbol : 'BTCUSD',
    multiplier : '0.0001',
    fundingRateCoefficient : '0.0000025',
    minInitialMarginRatio : 0.1,
    minMaintenanceMarginRatio : 0.0005,
    feeRatio : 0.05
  }); 

  useEffect(() => { 
    const setSpec = async () => {           
      if(spec.pool && wallet.isConnected()){
        const contractInfo = await getSpecification(wallet.detail.chainId,spec.pool,wallet.detail.account) 
        setContract(contractInfo)  
      }
    }
    wallet && setSpec();
    return () => {};
  }, [spec,wallet]);
  
  return(
    <div className="contract-box">
      <div className='contract-header'></div>
      <div className="contract-info">
        <div className="conntract-header">CONTRACT INFO</div>
        <div className="info">
          <div className="title">Base Token</div>
          <div className="text">
            { contract.bSymbol }
          </div>
        </div>
        <div className="info">
          <div className="title">Symbol</div>
          <div className="text">
            { contract.symbol }
          </div>
        </div>
        <div className="info">
          <div className="title">Multiplier</div>
          <div className="text">
            { contract.multiplier }
          </div>
        </div>
        <div className="info">
          <div className="title">Funding Rate Coefficient</div>
          <div className="text">
            { contract.fundingRateCoefficient }
          </div>
        </div>
        <div className="info">
          <div className="title">Min Initial Margin Ratio</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ contract.minInitialMarginRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
        <div className="info">
          <div className="title">Min Maintenance Margin Ratio</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ contract.minMaintenanceMarginRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
        <div className="info">
          <div className="title">Transaction Fee</div>
          <div className="text">
            <NumberFormat displayType='text' value ={ contract.feeRatio * 100 } decimalScale={2} suffix='%'/>
          </div>
        </div>
      </div>
    </div>
  )
}