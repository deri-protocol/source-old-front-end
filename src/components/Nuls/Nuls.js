/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import nulsimg from './img/nuls.svg'
import deriimg from './img/deri.svg'
import success from './img/success.svg'
import undone from './img/undone.svg'
import right from './img/right.svg'
import Button from '../Button/Button'
import {
  isPTokenAirdropped,
  isUserPTokenLiteExist,
  totalAirdropCount,
  isBTokenUnlocked,
  hasRequiredBalance,
  getTradeHistory,
  openConfigListCache,
  unlockBToken,
  DeriEnv,
  airdropPTokenLite
} from "../../lib/web3js/indexV2";
function Nuls({ wallet = {}, lang }) {
  const [actionElement, setActionElement] = useState(<Button className='btn' btnText={lang['connect-wallet']}></Button>)
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const [isApprove, setIsApprove] = useState(false);
  const [isClaim, setIsClaim] = useState(false);
  const [isTrade, setIsTrade] = useState(false);
  const [isBalance,setIsBalacne] = useState(false);
  const [isThanFiveHundred,setIsThanFiveHundred] = useState(false)

  const [isHasPToken,setIsHasPToken] = useState(false)
  const config = DeriEnv.get() === 'dev' ? {
    poolAddress:'0xb18e2815c005a99BE77c8719c79ec2451A59aDAD'
  } : {
    poolAddress :'0xB8b79fd4BCB7dc0Ef352F258b4f9eC53306439fd'
  }
  const connect = () => {
    wallet.connect()
  }

  const getTotalAirdropCount = async ()=>{
    let res = await totalAirdropCount(wallet.detail.chainId)
    if(+res >= 500){
      setIsThanFiveHundred(true)
    }
  }

  const approve = async () => {
    let res = await unlockBToken(wallet.detail.chainId,config.poolAddress,wallet.detail.account)
    if(res.success){
      setIsApprove(true)
    }
  }

  const getHasPToken = async ()=>{
    let res = await isUserPTokenLiteExist(wallet.detail.chainId,config.poolAddress,wallet.detail.account)
    setIsHasPToken(res)
  }

  const claimPtoken = async () => {
    if(!isBalance){
      alert(lang['less-nuls'])
      return
    }
    if(isHasPToken){
      alert(lang['use-a-new-address'])
      return
    }

    let res = await airdropPTokenLite(wallet.detail.chainId,wallet.detail.account)
    if(res.success){
      setIsClaim(true)
    }else{
      alert(lang['faild'])
    }

  }

  const getBalance = async ()=>{
    let res = await hasRequiredBalance(wallet.detail.chainId,config.poolAddress,wallet.detail.account)
    setIsBalacne(res)
  }

  const getIsApprove = async ()=>{
    let res = await isBTokenUnlocked(wallet.detail.chainId,config.poolAddress,wallet.detail.account)
    setIsApprove(res)
  }

  const getIsClaim = async ()=>{
    let res = await isPTokenAirdropped(wallet.detail.chainId,wallet.detail.account)
    setIsClaim(res)
  }

  const getIsTrade = async () =>{
    await openConfigListCache.update()
    let res = await getTradeHistory(wallet.detail.chainId,config.poolAddress,wallet.detail.account,'0')
    if(res.length > 0){
      setIsTrade(true)
    }
  }

  useEffect(()=>{
    if(hasConnectWallet()){
      getIsApprove()
      getIsClaim()
      getBalance()
      getHasPToken()
      getIsTrade()
      getTotalAirdropCount()
    }
  },[wallet.detail])

  useEffect(() => {
    let element;
    if (hasConnectWallet()) {
      if (!isApprove) {
        element = <Button className='btn' btnText={lang['register']} click={approve} lang={lang} />
      } else {
        if (isClaim || isThanFiveHundred) {
          element = <a href='https://app.deri.finance/#/futures/pro' className='btn'>
            {lang['trade']}
          </a>
        } else {
          element = <Button className='btn' btnText={lang['claim']} click={claimPtoken} lang={lang} />
        }

      }
    } else {
      element = <Button className='btn btn-danger connect' btnText={lang['connect-wallet']} click={connect} lang={lang} />
    }
    setActionElement(element)
  }, [wallet.detail, isApprove, isClaim,isBalance,isHasPToken,isThanFiveHundred])

  return (
    <div className='nuls-box'>
      <div className='title'>
        <div>
          {lang['title']}
        </div>
        <div className='time'>
          {lang['in-celebration-of-the']}
        </div>
      </div>
      <div className='logo'>
        <img className='nuls-img' src={nulsimg} />
        <img src={deriimg} />
      </div>
      <div className='user-rasks'>
        <div className='header'>
          {lang['user-tasks']}
        </div>
        <div className='content'>
          <div className='content-text'>
            <div className='step'>
              <div className='step-img'>
                <div>
                  {isApprove ? <img src={success} /> : <img src={undone} />}
                </div>
                <div>
                  {lang['register']}
                </div>
              </div>
              <div className='step-img'>
                <div>
                  <img src={right} />
                </div>

              </div>
              <div className='step-img'>
                <div>
                  {isClaim ? <img src={success} /> : <img src={undone} />}
                </div>
                <div>
                  {lang['claim']}
                </div>
              </div>
              <div className='step-img'>
                <div>
                  <img src={right} />
                </div>

              </div>
              <div className='step-img'>
                <div>
                  {isTrade ? <img src={success} /> : <img src={undone} />}
                </div>
                <div>
                  {lang['trade']}
                </div>
              </div>
            </div>
            <div className='button'>
              {actionElement}
            </div>
            {isThanFiveHundred ? <div className='exceed'>{lang['exceed-participants']}</div>:''}
          </div>

        </div>
      </div>
      <div className='h2'>
        {lang['title-one']}
        <span className='title-num'>
          {lang['title-num']}
        </span>
        <span className='in-deri'>
          {lang['title-two']}
        </span>
        <div className='text'>
          {lang['title-three']}
        </div>
      </div>
      <div className='rules'>
        <div className='rules-title'>
          {lang['rules']}
        </div>
        <div className='text'>
          {lang['rules-one']}
        </div>
        
        <div className='text'>
          {lang['rules-two']}
        </div>
        <div className='text-n'>
          {lang['rules-two-one']}
        </div>
        <div className='text-n'>
          {lang['rules-two-two']}
        </div>
        <div className='text-n'>
          {lang['rules-two-three']}
        </div>
        <div className='text-n'>
          {lang['rules-two-four']}
        </div>
        <div className='text'>
          {lang['rules-three']}
        </div>
        <div className='text-n'>
          {lang['rules-two-one']}
        </div>
        <div className='text-n'>
          {lang['rules-two-two']}
        </div>
        <div className='text-n'>
          {lang['rules-two-three']}
        </div>
        <div className='text-n'>
          {lang['rules-two-four']}
        </div>
        <div className='rules-title'>
          {lang['how-to-participate']}
        </div>
        <div className='text'>
          {lang['step-one']}
        </div>
        <div className='text'>
          {lang['step-two']}
        </div>
        <div className='text'>
          {lang['step-three']}
          <a href='https://docs.deri.finance/guides/trading'>
            {lang['step-three-a']}
          </a>
        </div>
        <div className='rules-title'>
          {lang['notes']}
        </div>
        <div className='text'>
          {lang['notes-one']}
        </div>
        <div className='text'>
          {lang['notes-two']}
        </div>
        <div className='text'>
          {lang['notes-three']}
        </div>
        <div className='text'>
          {lang['notes-four']}
        </div>
      </div>
    </div>
  )
}

export default inject("wallet")(observer(Nuls))