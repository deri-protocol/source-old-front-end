/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import nulsimg from './img/nuls.svg'
import deriimg from './img/deri.svg'
import success from './img/success.svg'
import undone from './img/undone.svg'
import right from './img/right.svg'
import Button from '../Button/Button'
function Nuls({ wallet = {}, lang }) {
  const [actionElement, setActionElement] = useState(<Button className='btn' btnText={lang['connect-wallet']}></Button>)
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const [isApprove, setIsApprove] = useState(false);
  const [isRegsiter, setIsRegsiter] = useState(false);
  const connect = () => {
    wallet.connect()
  }

  const approve = async () => {

  }
  const claimPtoken = async () => {

  }
  const reg = async ()=>{

  }
  useEffect(() => {
    let element;
    if (hasConnectWallet()) {
      if (!isApprove) {
        element = <Button className='btn' btnText={lang['approve']} click={approve} lang={lang} />
      } else {
        if(isRegsiter){
          element = <Button className='btn' btnText={lang['claim']} click={claimPtoken} lang={lang} />
        }else{
          element = <Button className='btn' btnText={lang['register']} click={reg} lang={lang} />
        }
      }
    } else {
      element = <Button className='btn btn-danger connect' btnText={lang['connect-wallet']} click={connect} lang={lang} />
    }
    setActionElement(element)
  }, [wallet.detail, isApprove,isRegsiter])

  return (
    <div className='nuls-box'>
      <div className='title'>
        {lang['title']}<br />
        {lang['title-one']}
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
                  <img src={undone} />
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
                  <img src={undone} />
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
                  <img src={undone} />
                </div>
                <div>
                  {lang['trade']}
                </div>
              </div>
            </div>
            <div className='button'>
              {actionElement}
            </div>
          </div>

        </div>
      </div>
      <div className='rule'>
        <div className='rule-title'>

        </div>
      </div>
    </div>
  )
}

export default inject("wallet")(observer(Nuls))