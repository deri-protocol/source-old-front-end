import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";
import './addpool.less';
import down from './img/down.svg';

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
            {lang['advanced']}
            <img src={down}></img>
          </div>
          <div>
          <button onClick={() => prop.goToStep(2)}>
            {lang['next']}
          </button>
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