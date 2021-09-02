/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState, useEffect } from 'react'
import config from  '../../../config.json'
import DeriNumberFormat from '../../../utils/DeriNumberFormat';
import { DeriEnv, getUserInfoAllForAirDrop, mintAirdrop } from '../../../lib/web3js/indexV2.js';
import { useHistory ,Link} from 'react-router-dom';
import { eqInNumber } from '../../../utils/utils.js';
import TipWrapper from '../../../components/TipWrapper/TipWrapper.js';

const chainConfig = config[DeriEnv.get()]['chainInfo'];

function ListBox({group,lang,index,wallet}){
  const {pool,list} = group
  
  return (
    <div className='pool-list' key={index}>
      <div className='pool-list-header'>
        <div className='list-header-left'>
          <div className='l-h-network'>
            {pool.network && pool.network.toUpperCase()}
          </div>
          <div className='l-h-y-ad'>
            <span className='symbol'>
              <span className='symbol-label'>{lang['symbol']} : </span>
              <span className='symbol-value'>{pool.symbol}</span>  
            </span>
            <span className='add'>
              <span className='add-label'>{lang['address']} : </span>
                  {!pool.airdrop ? <a target='_blank' rel='noreferrer' href={`${chainConfig[pool.chainId] && chainConfig[pool.chainId]['viewUrl']}/address/${pool.address}`}> 
                    {pool.formatAdd}
                  </a> : '--'}
            </span>
          </div>
        </div>
        <div className='list-header-right'>
          {lang[pool.version]}
        </div>
      </div>
      <div className='pool-list-body'>
        {list.map((item,index) => <Card index={index} item={item} lang={lang} wallet={wallet} pool={pool}/>)}
      </div>
    </div>
  )
}

function Card({index,item,lang,wallet,pool}){
  const [connected, setConnected] = useState(false)
  const [text, setText] = useState('')
  const history = useHistory();

  const gotoMining = url => {
    history.push(url)
  }
  const connectWallet = () => {
    wallet.connect().then(() => {
      setConnected(true)
    })
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
    if(item && item.airdrop){
      if(!wallet.isConnected()) {
        setText(<a href='#' onClick={connectWallet}>{lang['connect-wallet']}</a>)
      } else {
        setText(<a href='#' onClick={claimAirdrop}>{lang['claim']}</a>)
      }
    } else {
      let url = `/mining/${pool.version || 'v1'}/${pool.chainId}/${item.type}/${item.symbol}/${item.bTokenSymbol}/${pool.address}`
      if(item.bTokenId){
        url = `${url}?baseTokenId=${item.bTokenId}`
      }
      if(item.symbolId){
        if(url.indexOf('?') > 0){
          url = `${url}&symbolId=${item.symbolId}`
        } else {
          url = `${url}?symbolId=${item.symbolId}`
        }
      }
      setText(     
          <Link to={url}>
            {lang['staking']}
          </Link>   
        )
    }    
    return () => {};
  }, [wallet.detail.account,connected]);

  return (
    <div className='list-item' key={index}>
      <span className='col btoken'>
        <span className={`logo ${item.bTokenSymbol}`}></span>
        <span className='base-token'>{item.bTokenSymbol}</span>
      </span>
      <span className='col'>
        <div className='col-label'>{item.airdrop ? lang['total'] : lang['pool-liq']}</div>
        <div className='col-value'><DeriNumberFormat value={item.liquidity} displayType='text' thousandSeparator={true} decimalScale={item.lpApy ? 7 : 0}/></div>
      </span>
      <span className='col'>
        <div className='col-label'>{lang['multiplier']}</div>
        <TipWrapper>
          <div className='col-value' title={lang['multiplier-tip']}><span className='underline'><DeriNumberFormat value={item.multiplier}  suffix='x' /></span></div>
        </TipWrapper>
      </span>
      <span className='col'>
        <div className='col-label'>{lang['apy']}</div>
        <div className='col-value'>
        <span>
          <TipWrapper block={false}>
            <span className={item.lpApy ? 'sushi-apy-underline' : ''} title={ item.lpApy && lang['deri-apy']}>
              {item.apy ? <DeriNumberFormat value={item.apy} suffix='%' displayType='text' allowZero={true} decimalScale={2}/> : '--'}                 
            </span>
          </TipWrapper>
          {item.lpApy &&<>
          <span> + </span>
          <TipWrapper block={false}>
            <span className={item.lpApy ? 'sushi-apy-underline' : '' } title={ item.lpApy && item.label}> <DeriNumberFormat value={item.lpApy} displayType='text' suffix='%' decimalScale={2}/></span>
          </TipWrapper>
          </>}
        </span>
        </div>
      </span>
      <span className='col'>
        <div className='col-label'>{lang['claimed-deri']}</div>
        <div className='col-value'><DeriNumberFormat value={item.claimed} decimalScale={2}/></div>
      </span>
      <span className='col'>
        <div className='col-label'>{lang['unclaimed-deri']}</div>
        <div className='col-value'><DeriNumberFormat value={item.unclaimed} decimalScale={2}/></div>
      </span>
      <span className='col'>
        <div className='col-label'>{lang['mining-pnl']}</div>
        <div className='col-value'><DeriNumberFormat value={item.pnl} decimalScale={2}/></div>
      </span>
      <span className='col'>
        <div className='staking'>{text} ></div>
      </span>
    </div>
  )
}
export default function List({optionPools,v1Pools,v2Pools,openPools,type,lang,wallet}){
  return (
    <div>
      {type === '' && <>
        {optionPools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
        {v2Pools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
        {v1Pools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
        </>
      }
      {type === 'futures' && <>
        {v2Pools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
        {v1Pools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
      </>} 
      {type === 'options' && <>
        {optionPools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
      </>}    
      {type === 'opens' && <>
        {openPools.map((pool,index) => <ListBox group={pool} lang={lang} index={index} key={index} wallet={wallet}/>)}
      </>}
    </div>

  )
}