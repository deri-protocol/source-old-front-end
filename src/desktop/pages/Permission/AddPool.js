import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";
import './addpool.less';
import down from './img/down.svg';
import up from './img/up.svg';
import { set } from 'mobx';

function AddPool({ wallet = {}, lang }) {
  useEffect(() => {
  }, [wallet, wallet.detail])
  return (
    <div className='add-pool'>
      <div className='Step-box'>
        <StepWizard
          initialStep={3}
        >
          <Step1 lang={lang} wallet={wallet} />
          <Step2 lang={lang} wallet={wallet} />
          <Step3 lang={lang} wallet={wallet} />
        </StepWizard>
      </div>
    </div>
  )
}

function Step1({ goToStep, lang, wallet }) {
  const [selectAdvanced, setSelectAdvanced] = useState(true)
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const connect = () => {
    wallet.connect()
  }
  const [btnText, setBtnText] = useState(
    <button OnClick={connect}>
      {lang['connect-wallet']}
    </button>
  )

  const nextStep = () => {
    // if(){

    // }
    goToStep(2)
  }


  useEffect(() => {
    let elem;
    if (hasConnectWallet()) {
      elem = <button onClick={nextStep}>
        {lang['next']}
      </button>
    } else {
      elem = <button onClick={connect}>
        {lang['connect-wallet']}
      </button>
    }
    setBtnText(elem)
  }, [wallet, wallet.detail, wallet.detail.account])
  return (
    <div className='step1'>
      <div className='header'>
        <span>{lang['add-pool']}</span>
        <span>{lang['bsc']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          <span className='base-title'> {lang['base-token-addresses']}</span>
          <div>
            <input
              className='base-token-address'
            >
            </input>
          </div>
          <div className='advanced'>
            <span className='select-advanced' onClick={() => setSelectAdvanced(!selectAdvanced)} >
              {lang['advanced']}
              {selectAdvanced ? <img src={up} /> : <img src={down} />}
            </span>
          </div>

          {selectAdvanced && <>
            <div className='margin-rewards'>
              <div className='margin-ratio-parameters'>
                <div className='title'>
                  {lang['margin-ratio-parameters']}
                </div>
                <div className='parameters'>
                  <div>
                    <div className='text'>
                      {lang['initial-margin']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> %
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['maintenance-margin']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> %
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['pool-margin']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> %
                    </div>
                  </div>
                </div>
              </div>
              <div className='rewards-for-liquidates'>
                <div className='title'>
                  {lang['rewards-for-liquidates']}
                </div>
                <div className='parameters'>
                  <div>
                    <div className='text'>
                      {lang['cut-ratio']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> %
                    </div>
                  </div>
                  <div className='no-fix'>
                    <div className='text'>
                      {lang['max-reward']}
                    </div>
                    <div className='input-value'>
                      <input type='number' />
                    </div>
                  </div>
                  <div className='no-fix'>
                    <div className='text'>
                      {lang['min-reward']}
                    </div>
                    <div className='input-value'>
                      <input type='number' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='protocol-collect-ratio'>
                {lang['protocol-fee-collect-ratio']}
              &nbsp; &nbsp;  20%
            </div>
            </div>
          </>}

          <div className='next-button'>
            {btnText}
          </div>
        </div>
      </div>
    </div>
  )
}

function Step2({ goToStep, lang, wallet }) {
  const nextStep = ()=>{
    goToStep(3)
  }
  return (
    <div className='step2'>
      <div className='header'>
        <span>{lang['add-pool']}</span>
        <span>{lang['bsc']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          <div>{lang['the-protocol-requires']}</div>
          <div>{lang['please-provide-the-address']}:</div>
          <div className='address-input'>
            <input 
            />
          </div>
          <div>
            {lang['for-example']}
          </div>
          <div className='next-button'>
              <button onClick={()=>{goToStep(1)}}>
                {lang['cancel']}
              </button>
              <button onClick={nextStep}>
                {lang['send']}
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Step3({ goToStep, lang, wallet }) {
  const add = ()=>{
    
  }
  return (
    <div className='step3'>
      <div className='header'>
        <span>{lang['confirm']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          <span className='base-title'> {lang['base-token-addresses']}</span>
          <div>
            
          </div>
         

            <div className='margin-rewards'>
              <div className='margin-ratio-parameters'>
                <div className='title'>
                  {lang['margin-ratio-parameters']}
                </div>
                <div className='parameters'>
                  <div>
                    <div className='text'>
                      {lang['initial-margin']}
                    </div>
                    <div className='input-value'>
                       %
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['maintenance-margin']}
                    </div>
                    <div className='input-value'>
                       %
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['pool-margin']}
                    </div>
                    <div className='input-value'>
                       %
                    </div>
                  </div>
                </div>
              </div>
              <div className='rewards-for-liquidates'>
                <div className='title'>
                  {lang['rewards-for-liquidates']}
                </div>
                <div className='parameters'>
                  <div>
                    <div className='text'>
                      {lang['cut-ratio']}
                    </div>
                    <div className='input-value'>
                       %
                    </div>
                  </div>
                  <div className='no-fix'>
                    <div className='text'>
                      {lang['max-reward']}
                    </div>
                    <div className='input-value'>
                      
                    </div>
                  </div>
                  <div className='no-fix'>
                    <div className='text'>
                      {lang['min-reward']}
                    </div>
                    <div className='input-value'>
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
          <div className='next-button'>
          <div className='next-button'>
              <button onClick={()=>{goToStep(1)}}>
                {lang['cancel']}
              </button>
              <button onClick={add}>
                {lang['ok']}
              </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default inject('wallet', 'trading')(observer(AddPool))