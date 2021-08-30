import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";
import './addpool.less';
import down from './img/down.svg';
import up from './img/up.svg';

function AddPool({ wallet = {}, lang }) {
  return (
    <div className='add-pool'>
      <div className='Step-box'>
        <StepWizard
          initialStep={1}
        >
          <Step1 lang={lang} wallet={wallet} />
          <Step2 lang={lang} wallet={wallet} />
          <Step3 lang={lang} wallet={wallet} />
        </StepWizard>
      </div>
    </div>
  )
}

const Step1 = props => {
  const prop = { ...props }
  const { lang, wallet } = { ...prop }
  const [selectAdvanced,setSelectAdvanced] = useState(false)
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const connect = () => {
    wallet.connect()
  }
  const [btnText,setBtnText] = useState(
    <button Onclick={connect}>
      {lang['connect-wallet']}
    </button>
  )

  useEffect(()=>{
    let elem ;
    if(hasConnectWallet()){
      elem = <button onClick={() => prop.goToStep(2)}>
        {lang['next']}
      </button>
    }else{
       elem = <button OnClick={connect}>
       {lang['connect-wallet']}
     </button>
    }
    setBtnText(elem)
  },[wallet.detail])
  return (
    <div className='step1'>
      <div className='header'>
        <span>{lang['add-pool']}</span>
        <span>{lang['bsc']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          {lang['base-token-addresses']}
          <div>
            <input
              className='base-token-address'
            >
            </input>
          </div>
          <div className='advanced'>
          <span className='select-advanced' onClick={() => setSelectAdvanced(!selectAdvanced)} >
            {lang['advanced']}
            {selectAdvanced ? <img src={up}  /> :<img src={down} />} 
          </span>
          </div>

          {selectAdvanced && <>
            <div className='margin-rewards'>

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

const Step2 = props => {
  const prop = { ...props }
  const { lang, wallet } = { ...prop }
  return (
    <div className='step2'>
      <div className='header'>
        <span>{lang['add-pool']}</span>
        <span>{lang['bsc']}</span>
      </div>
      <div className='context'>
        <div>
          {lang['base-token-addresses']}2

          <div>
          <button onClick={() => prop.goToStep(3)}>
            {lang['next']}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Step3 = props => {
  const prop = { ...props }
  const { lang, wallet } = { ...prop }
  return (
    <div className='step3'>
      <div className='header'>
        <span>{lang['confirm']}</span>
      </div>
      <div className='context'>
        <div>
          {lang['base-token-addresses']}3

          <div>
          <button onClick={() => prop.goToStep(1)}>
            {lang['next']}
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}


export default inject('wallet', 'trading')(observer(AddPool))