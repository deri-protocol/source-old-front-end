import React, { useState, useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import config from  '../../config.json'
import { DeriEnv, getUserInfoAllForAirDrop, connectWallet, mintAirdrop, isUnlocked, unlock } from '../../lib/web3js/indexV2';
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button.js';
import { eqInNumber } from '../../utils/utils.js';
import v2LabelImg from '../../assets/img/v2-label.png'
import v1LabelImg from '../../assets/img/v1-label.png'
const chainConfig = config[DeriEnv.get()]['chainInfo'];

function PoolBox({wallet,version,pool}){
  const [buttonElement, setButtonElement] = useState('');
  const logoClassName = `logo ${pool.bTokenSymbol}`
  const history = useHistory();

  const airdrop = () => {
    const res = getUserInfoAllForAirDrop(pool.pool)
    if(res){
      const {chainId,valid} = res;
      if(!valid){
        alert('No DERI to claim')
        return;
      }
      if(!eqInNumber(wallet.detail.chainId,chainId)) {
        alert('Please switch to BSC to claim DERI')
        return;
      }
      mintAirdrop(chainId,wallet.detail.account)
    }
  }

  const gotoMining = url => {
    history.push(url)
  }
  const connectWallet = () => {
    wallet.connect()
  }
  

  useEffect(() => {
    if(pool && pool.airdrop){
      if(!wallet.isConnected()) {
        setButtonElement(<Button btnText='Connect Wallet' click={connectWallet}></Button>)
      } else {
        setButtonElement(<Button btnText='CLAIM' click={airdrop}></Button>)
      }
    } else {
      setButtonElement(        
          <button onClick={() => gotoMining(`/mining/${pool.chainId}/${pool.type}/${pool.symbol}/${pool.bTokenSymbol}/${pool.address}`)}>
            STAKING
          </button>
        )
    }    
    return () => {};
  }, [pool]);

  return(
    <div className="pool" >
      <div className="pool-header">
        <div className="network">
          {pool.network && pool.network.toUpperCase()}
        </div>
        {version.isV2 && <div className='pool-label'><img src={pool.version === 'v2' ? v2LabelImg : v1LabelImg} alt={pool.version || 'v1'}/></div> }
      </div>
      <div className="pool-info">
        <div className="info-center">
          <div className="top-info">
            <div className={logoClassName} ></div>
            <div className="pool-detail">
              <div className="base-token">{pool.bTokenSymbol}</div>
              <div>
                <span>{pool.airdrop ? 'Total' : 'Pool Liq'}</span>
                <DeriNumberFormat value={pool.liquidity} displayType='text' thousandSeparator={true} decimalScale={pool.sushiApy ? 7 : 0}/>
              </div>
              <div>
                <span>Symbol</span>
                {pool.symbol}
              </div>
              <div className="apy">
                <span>APY</span>
                <span>
                  <span className={pool.sushiApy ? 'sushi-apy-underline' : ''} title={ pool.sushiApy && 'DERI-APY'}>
                    {pool.apy ? <DeriNumberFormat value={pool.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2}/> : '--'}                 
                  </span>
                  {pool.sushiApy &&<>
                  <span> + </span>
                  <span className={pool.sushiApy ? 'sushi-apy-underline' : '' } title={ pool.sushiApy && 'SUSHI-APY'}> <DeriNumberFormat value={pool.sushiApy} displayType='text' suffix='%' decimalScale={2}/></span>
                  </>}
                </span>
                
              </div>
              <div className="pool-address">
                <span>Address</span>
                {!pool.airdrop ? <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId]['viewUrl']}/address/${pool.address || pool.pool}`}> 
                  {pool.pool}
                </a> : '--'}
              </div>
            </div>
          </div>
          <div className="bottom-btn">
            {buttonElement}
          </div>
        </div>
      </div>
    </div>
  )
}
export default  inject('wallet','version')(observer(PoolBox))