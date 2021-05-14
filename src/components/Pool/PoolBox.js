import {useHistory} from 'react-router-dom'
import NumberFormat from 'react-number-format';
import config from  '../../config.json'
import { DeriEnv } from '../../lib/web3js/indexV2.js';
import DeriNumberFormat from '../../utils/DeriNumberFormat';

const chainConfig = config[DeriEnv.get()]['chainInfo'];

export default function PoolBox({pool}){
  const logoClassName = `logo ${pool.bTokenSymbol}`
  const history = useHistory();
  const mining = () => history.push(`/mining/${pool.chainId}/${pool.symbol}/${pool.bTokenSymbol}/${pool.address}`)
  
  return(
    <div className="pool" >
      <div className="pool-header">
        <div className="network">
          {pool.network.toUpperCase()}
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
                <DeriNumberFormat value={pool.liquidity} displayType='text' thousandSeparator={true} decimalScale={0}/>
              </div>
              <div>
                <span>Symbol</span>
                {pool.symbol}
              </div>
              <div className="apy">
                <span>APY</span>
                <span>
                  <span>
                    <DeriNumberFormat value={pool.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2}/>                  
                  </span>
                  {pool.sushiApy &&<>
                  <span>+</span>
                  <span > <DeriNumberFormat value={pool.sushiApy} displayType='text' suffix='%' decimalScale={2}/>}</span>
                  </>}
                </span>
                
              </div>
              <div className="pool-address">
                <span>Address</span>
                <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId]['viewUrl']}/address/${pool.address}`}>{pool.pool}</a>
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