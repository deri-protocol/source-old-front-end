export default function ContractInfo(){
  return(
    <div className="contract-box">
      <div className="contract-info">
        <div className="conntract-header">CONTRACT INFO</div>
        <div className="info">
          <div className="title">Base Token</div>
          <div className="text">
            {/* { baseToken } */}
          </div>
        </div>
        <div className="info">
          <div className="title">Symbol</div>
          <div className="text">
            {/* { symbol } */}
          </div>
        </div>
        <div className="info">
          <div className="title">Multiplier</div>
          <div className="text">
            {/* { Multiplier } */}
          </div>
        </div>
        <div className="info">
          <div className="title">Funding Rate Coefficient</div>
          <div className="text">
            {/* { FundingRateCoefficient } */}
          </div>
        </div>
        <div className="info">
          <div className="title">Min Initial Margin Ratio</div>
          <div className="text">
            {/* { MinInitialMarginRatio } */}
          </div>
        </div>
        <div className="info">
          <div className="title">Min Maintenance Margin Ratio</div>
          <div className="text">
            {/* { MinMaintenanceMarginRatio } */}
          </div>
        </div>
        <div className="info">
          <div className="title">Transaction Fee</div>
          <div className="text">
            {/* { TransactionFee } */}
          </div>
        </div>
      </div>
    </div>
  )
}