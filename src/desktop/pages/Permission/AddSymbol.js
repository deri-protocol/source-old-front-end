/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";
import { useParams } from "react-router-dom";
import classNames from 'classnames';
import useQuery from '../../../hooks/useQuery'
import down from './img/down.svg';
import up from './img/up.svg';
import warn from './img/warn.svg';
import symbolArrowIcon from '../../../assets/img/symbol-arrow.svg'
import './addsymbol.less'

function AddSymbol({ wallet = {}, lang }) {
  const { version, chainId, symbol, baseToken, address, type } = useParams();
  const query = useQuery();
  const props = { version, chainId, symbol, baseToken, address, wallet, type, lang }
  if (query.has('baseTokenId')) {
    props['baseTokenId'] = query.get('baseTokenId')
  }
  if (query.has('symbolId')) {
    props['symbolId'] = query.get('symbolId')
  }
  const StepChange = (name, value) => {

  }
  useEffect(() => {
  }, [wallet, wallet.detail])
  return (
    <div className='add-symbol'>
      <div className='Step-box'>
        <StepWizard
          initialStep={2}
        >
          <Step1 lang={lang} wallet={wallet} props={props} OnChange={StepChange} />
          <Step2 lang={lang} wallet={wallet} props={props} OnChange={StepChange} />
        </StepWizard>
      </div>
    </div>
  )
}

function Step1({ goToStep, lang, wallet, props, OnChange }) {
  const [selectAdvanced, setSelectAdvanced] = useState(true)
  const [dropdown, setDropdown] = useState(false);  
  const selectClass = classNames('dropdown-menu',{'show' : dropdown})
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const connect = () => {
    wallet.connect()
  }
  const [btnText, setBtnText] = useState(
    <button OnClick={connect}>
      {lang['connect-wallet']}
    </button>
  )

  const onDropdown = (event) => {
    
  }

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
        <span>{lang['add-symbol']}</span>
        <span>{props.baseToken} @ {lang['bsc']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          <span className='base-title'> {lang['oracle']}</span>
          <div className='select-oracle'>
            <div className='radio'>
            </div>
            <span>{lang['choose-from-exsting-ones']}</span>
          </div>
          <div className='select-symbol'>
            <div className='btn-group check-baseToken-btn'>
              <button
                type='button'
                onClick={onDropdown}
                className='btn chec'>
                <span className='check-base-down'><img src={symbolArrowIcon} alt='' /></span>
              </button>
              <div className={selectClass}>

              </div>
            </div>
          </div>
          <div className='warn'>
            <img src={warn} />
            <span>
              {lang['please-contact-the-team']}
            </span>
          </div>
          <div className='symbol-name'>
            <div className='symbol-title'>
              {lang['symbol-name']}
            </div>
            <div className='symbol-value'>

            </div>
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
                  {lang['parameters']}
                </div>
                <div className='parameters'>
                  <div>
                    <div className='text'>
                      {lang['multiplier']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> 
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['funding-rate-coefficient']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> 
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['transaction-fee-ratio']}
                    </div>
                    <div className='input-value'>
                      <input type='number' /> %
                    </div>
                  </div>
                </div>
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

function Step2({ goToStep, lang, wallet, props, OnChange }) {
  const add = () => {

  }
  return (
    <div className='step2'>
      <div className='header'>
        <span>{lang['confirm']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          <span className='oracle-title'> {lang['oracle']}</span>
          <div className='oracle-name'>
          </div>

          <span className='symbol-title'> {lang['symbol-name']}</span>
          <div className='symbol-name'>

          </div>


          <div className='margin-rewards'>
            <div className='margin-ratio-parameters'>
              <div className='title'>
                {lang['parameters']}
              </div>
              <div className='parameters'>
                <div>
                  <div className='text'>
                    {lang['multiplier']}
                  </div>
                  <div className='input-value'>
                    </div>
                </div>
                <div>
                  <div className='text'>
                    {lang['funding-rate-coefficient']}
                  </div>
                  <div className='input-value'>
                  </div>
                </div>
                <div>
                  <div className='text'>
                    {lang['transaction-fee-ratio']}
                  </div>
                  <div className='input-value'>
                    %
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className='next-button'>
            <div className='next-button'>
              <button onClick={() => { goToStep(1) }}>
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


export default inject('wallet')(observer(AddSymbol))