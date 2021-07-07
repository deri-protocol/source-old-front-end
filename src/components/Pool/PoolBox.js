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

function PoolBox({wallet,group = {},lang}){
  const [buttonElement, setButtonElement] = useState('');
  const {pool,list} = group
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
        setButtonElement(<Button btnText={lang['connect-wallet']} click={connectWallet} lang={lang}></Button>)
      } else {
        setButtonElement(<Button btnText={lang['claim']} click={claimAirdrop} lang={lang}></Button>)
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
            {lang['staking']}
          </button>
        )
    }    
    return () => {};
  }, [wallet.detail.chainId]);

  return(
    <div className="pool" >
      <div className="pool-header">
        <div className='left'>
          <div className="network">
            {pool.network && pool.network.toUpperCase()}
          </div>
          <div className='pool-desc'>
            <div>
                <span>{lang['symbol']}</span>
                <span>{pool.symbol}</span>  
            </div>
            <div>
              <span>{lang['address']}</span>
                {!pool.airdrop ? <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId] && chainConfig[pool.chainId]['viewUrl']}/address/${pool.address || pool.pool}`}> 
                  {pool.pool}
                </a> : '--'}
            </div>
          </div>
        </div>
        <div className='pool-label'>{pool.version === 'v1' && <img src={v1LabelImg} alt='v1'/>}{ pool.version === 'v2' && <img src={v2LabelImg} alt='v2'/>}</div>
      </div>
      <div className="pool-info">
        {list.map(card =>(
          <div className="info-center">
          <div className="top-info">
            <div className={`logo ${card.bTokenSymbol}`} ></div>
            <div className="pool-detail">
              <div className="base-token">{card.bTokenSymbol}</div>
              <div>
                <span className='title'>{card.airdrop ? lang['total'] : lang['pool-liq']}</span>
                <DeriNumberFormat value={card.liquidity} displayType='text' thousandSeparator={true} decimalScale={card.lpApy ? 7 : 0}/>
              </div>
              <div>
                
              </div>
              <div className="apy">
                <span>{lang['apy']}</span>
                <span>
                  <span className={card.lpApy ? 'sushi-apy-underline' : ''} title={ card.lpApy && lang['deri-apy']}>
                    {card.apy ? <DeriNumberFormat value={card.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2}/> : '--'}                 
                  </span>
                  {card.lpApy &&<>
                  <span> + </span>
                  <span className={card.lpApy ? 'sushi-apy-underline' : '' } title={ card.lpApy && card.label}> <DeriNumberFormat value={card.lpApy} displayType='text' suffix='%' decimalScale={2}/></span>
                  </>}
                </span>
                
              </div>
            </div>
          </div>
          <div className="bottom-btn">
            {buttonElement}
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}
export default  inject('wallet','version')(observer(PoolBox))