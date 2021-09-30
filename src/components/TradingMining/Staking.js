import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button';
import DeriNumberFormat from '../../utils/DeriNumberFormat'


function Staking({ wallet, lang }) {
  const [poolTotalScored, setPoolTotalScored] = useState(10000)
  const [yourScored, setYourScored] = useState(100)
  const [poolTotalStaked, setPoolTotalStaked] = useState(10)
  const [yourStaked, setYourStaked] = useState(10)

  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

  const connect =  ()=>{
    wallet.connect()
  }

  const addStake = async ()=>{

  }

  const removeStake = async ()=>{
    
  }

  return (
    <div>
      <div className='staking-title'>
        {lang['staking']}
      </div>
      <div className='staking-provide'>
        {lang['provide-pledged']}
      </div>
      <div className='staking-info'>
        <div className='staking-scored'>
          <div className='staking-total'>
            <div className='staking-info-title'>
              {lang['pool-total-scored']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={poolTotalScored} decimalScale={0} />
            </div>
          </div>
          <div className='staking-your'>
            <div className='staking-info-title'>
              {lang['your-scored']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={yourScored} decimalScale={0} />
            </div>
          </div>
        </div>
        <div className='staking-staked'>
          <div className='staking-total'>
            <div className='staking-info-title'>
              {lang['pool-total-staked']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={poolTotalStaked} decimalScale={0} />
            </div>
          </div>
          <div className='staking-your'>
            <div className='staking-info-title'>
              {lang['your-staked']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={yourStaked} decimalScale={0} />
            </div>
          </div>
        </div>
      </div>
      <div className='staking-button'>
        <div className='staking-button-title'>
          <div>
            {lang['take-introduction-or-calculation-method']}
            <br></br>
            adasd
          </div>
        </div>
        <div className='staking-add-remove'>

          {hasConnectWallet() && <>
            <Button className='btn' click={addStake} lang={lang} btnText={lang['add-stake']} />
            <Button className='btn' click={removeStake} lang={lang} btnText={lang['remove-stake']} />
          </>}

          {!hasConnectWallet() && <>
            <Button className='btn' click={connect} lang={lang} btnText={lang['connect-wallet']} />
            
          </>}

        </div>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Staking))

