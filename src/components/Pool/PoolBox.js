import {useHistory} from 'react-router-dom'

export default function PoolBox({pool}){
  const logoClassName = `logo ${pool.bTokenSymbol}`
  const history = useHistory();
  const mining = () => history.push(`/mining/${pool.chainId}/${pool.bTokenSymbol}/${pool.address}`)
  
  return(
    <div className="pool" >
      <div className="pool-header">
        <div className="network">
          {pool.network}
        </div>
      </div>
      <div className="pool-info">
        <div className="info-center">
          <div className="top-info">
            <div className={logoClassName} ></div>
            <div className="pool-detail">
              <div className="base-token">{pool.bTokenSymbol}</div>
              <div>
                <span>Pool Liq</span>
                {pool.liquidity}
              </div>
              <div className="apy">
                <span>APY</span>
                <span>
                  <span>
                  {pool.apy}
                  </span>
                  {pool.sushiApy &&<>
                  <span>+</span>
                  <span > {pool.sushiApy}</span>
                  </>}
                </span>
                
              </div>
              <div className="pool-address">
                <span>Address</span>
                {pool.pool}
              </div>
            </div>
          </div>
          <div className="bottom-btn">
              <button onClick={mining}>
                STAKING
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}