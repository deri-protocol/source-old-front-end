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
function Nuls({ wallet = {}, lang }) {
  const [actionElement, setActionElement] = useState(<Button className='btn' btnText={lang['connect-wallet']}></Button>)
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const [isApprove, setIsApprove] = useState(false);
  const [isClaim, setIsClaim] = useState(false);
  const [isTrade, setIsTrade] = useState(false)
  const connect = () => {
    wallet.connect()
  }

  const approve = async () => {

  }
  const claimPtoken = async () => {

  }
  const reg = async () => {

  }
  useEffect(() => {
    let element;
    if (hasConnectWallet()) {
      if (!isApprove) {
        element = <Button className='btn' btnText={lang['register']} click={approve} lang={lang} />
      } else {
        if (isClaim) {
          element = <a href='https://app.deri.finance/#/futures/pro' className='btn' />
        } else {
          element = <Button className='btn' btnText={lang['claim']} click={claimPtoken} lang={lang} />
        }

      }
    } else {
      element = <Button className='btn btn-danger connect' btnText={lang['connect-wallet']} click={connect} lang={lang} />
    }
    setActionElement(element)
  }, [wallet.detail, isApprove, isClaim])

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
        <div className='text'>
          {lang['rules-three']}
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