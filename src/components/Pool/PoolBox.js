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

function PoolBox({wallet,version,pool,lang}){
  const [buttonElement, setButtonElement] = useState('');
  const logoClassName = `logo ${pool.bTokenSymbol}`
  const history = useHistory();

  const gotoMining = url => {
    history.push(url)
  }
  const connectWallet = () => {
    wallet.connect()
  }
  const claimAirdrop = async () =>{
    let info =  await getUserInfoAllForAirDrop(wallet.detail.account)
    if(!info.valid){
      alert(lang['no-deri-to-claim']);
      return;
    }
    if(!eqInNumber(wallet.detail.chainId,info.chainId)){
      alert(lang['please-switch-to-BSC-to-claim-deri'])
      return;
    }
    let res = await mintAirdrop(info.chainId,wallet.detail.account)
    if(!res.success){
      alert(lang['claim-failed'])
    }
  }

  useEffect(() => {
    if(pool && pool.airdrop){
      if(!wallet.isConnected()) {
        setButtonElement(<Button btnText={lang['connect-wallet']} click={connectWallet}></Button>)
      } else {
        setButtonElement(<Button btnText={lang['claim']} click={claimAirdrop}></Button>)
      }
    } else {
      let url = `/mining/${pool.version || 'v1'}/${pool.chainId}/${pool.type}/${pool.symbol}/${pool.bTokenSymbol}/${pool.address}`
      if(pool.bTokenId){
        url = `${url}?baseTokenId=${pool.bTokenId}`
      }
      if(pool.symbolId){
        if(url.indexOf('?') > 0){
          url = `${url}&symbolId=${pool.symbolId}`
        } else {
          url = `${url}?symbolId=${pool.symbolId}`
        }
      }
      setButtonElement(        
          <button onClick={() => gotoMining(url)}>
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
        <div className='pool-label'>{version.isV2 && pool.version === 'v1' && <img src={v1LabelImg} alt='v1'/>}{version.isV2 && pool.version === 'v2' && <img src={v2LabelImg} alt='v2'/>}</div>
      </div>
      <div className="pool-info">
        <div className="info-center">
          <div className="top-info">
            <div className={logoClassName} ></div>
            <div className="pool-detail">
              <div className="base-token">{pool.bTokenSymbol}</div>
              <div>
                <span>{pool.airdrop ? lang['total'] : lang['pool-liq']}</span>
                <DeriNumberFormat value={pool.liquidity} displayType='text' thousandSeparator={true} decimalScale={pool.lpApy ? 7 : 0}/>
              </div>
              <div>
                <span>{lang['symbol']}</span>
                {pool.symbol}
              </div>
              <div className="apy">
                <span>{lang['apy']}</span>
                <span>
                  <span className={pool.lpApy ? 'sushi-apy-underline' : ''} title={ pool.lpApy && lang['deri-apy']}>
                    {pool.apy ? <DeriNumberFormat value={pool.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2}/> : '--'}                 
                  </span>
                  {pool.lpApy &&<>
                  <span> + </span>
                  <span className={pool.lpApy ? 'sushi-apy-underline' : '' } title={ pool.lpApy && pool.label}> <DeriNumberFormat value={pool.lpApy} displayType='text' suffix='%' decimalScale={2}/></span>
                  </>}
                </span>
                
              </div>
              <div className="pool-address">
                <span>{lang['address']}</span>
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