import {useHistory} from 'react-router-dom'
import NumberFormat from 'react-number-format';
import config from  '../../config.json'
import { DeriEnv } from '../../lib/web3js/index.js';

const chainConfig = config[DeriEnv.get()]['chainInfo'];

export default function PoolBox({pool}){
  const logoClassName = `logo ${pool.bTokenSymbol}`
  const history = useHistory();
  const mining = () => history.push(`/mining/${pool.chainId}/${pool.bTokenSymbol}/${pool.address}`)
  
  const formatApy = val => {
    if(!isNaN(val) && (+val > 0)){
      return val.toNumber();
    } else {
      return '--'
    }
  }

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
                <NumberFormat value={pool.liquidity} displayType='text' thousandSeparator={true} decimalScale={0} />
              </div>
              <div>
                <span>Symbol</span>
                {pool.symbol}
              </div>
              <div className="apy">
                <span>APY</span>
                <span>
                  <span>
                    <NumberFormat value={pool.apy} suffix='%' displayType='text' decimalScale={2} format={formatApy}/>
                  
                  </span>
                  {pool.sushiApy &&<>
                  <span>+</span>
                  <span > {pool.sushiApy}</span>
                  </>}
                </span>
                
              </div>
              <div className="pool-address">
                <span>Address</span>
                <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId]['viewUrl']}/${pool.address}`}>{pool.pool}</a>
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