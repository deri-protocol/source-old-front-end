import React, { useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import { getSpecification } from '../../lib/web3js';


export default function ContractInfo({wallet,spec ={}}){
  const [contract, setContract] = useState({}); 

  useEffect(() => { 
    const setSpec = async () => {           
      if(spec.pool){
        const contractInfo = await getSpecification(wallet.chainId,spec.pool,wallet.account) 
        setContract(contractInfo)  
      }
    }
    setSpec();
    return setSpec;
  }, [spec.pool]);
  
  return(
    <div className="contract-box">
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