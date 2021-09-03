/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";
import Button from '../../../components/Button/Button';
import {bg,createPool} from '../../../lib/web3js/indexV2'
import './addpool.less';
import down from './img/down.svg';
import up from './img/up.svg';

function AddPool({ wallet = {}, lang }) {
  const [baseTokenAddress, setBaseTokenAddress] = useState('')
  const [baseTokenAddressOther, setBaseTokenAddressOther] = useState('')
  const [initialMargin, setInitialMargin] = useState(10)
  const [maintenanceMargin, setMaintenanceMargin] = useState(5)
  const [poolMargin, setPoolMargin] = useState(100)
  const [cutRatio, setCutRatio] = useState(50)
  const [maxReward, setMaxReward] = useState(1000)
  const [minReward, setMinReward] = useState(0)
  const [params, setParams] = useState([])
  const StepChange = (name, value) => {
    if (name === 'baseTokenAddress') {
      setBaseTokenAddress(value)
    }
    if (name === 'initialMargin') {
      setInitialMargin(value)
    }
    if (name === 'baseTokenAddressOther') {
      setBaseTokenAddressOther(value)
    }
    if (name === 'maintenanceMargin') {
      setMaintenanceMargin(value)
    }
    if (name === 'poolMargin') {
      setPoolMargin(value)
    }
    if (name === 'cutRatio') {
      setCutRatio(value)
    }
    if (name === 'maxReward') {
      setMaxReward(value)
    }
    if (name === 'minReward') {
      setMinReward(value)
    }

  }
  useEffect(() => {
  }, [wallet, wallet.detail])
  useEffect(() => {
    let arr = [initialMargin, baseTokenAddress, baseTokenAddressOther, maintenanceMargin, poolMargin, cutRatio, maxReward, minReward]
    setParams(arr)
  }, [initialMargin, baseTokenAddress, baseTokenAddressOther, maintenanceMargin, poolMargin, cutRatio, maxReward, minReward])
  return (
    <div className='add-pool'>
      <div className='Step-box'>
        <StepWizard
          initialStep={1}
        >
          <Step1 lang={lang} wallet={wallet} OnChange={StepChange} />
          <Step2 lang={lang} wallet={wallet} OnChange={StepChange} />
          <Step3 lang={lang} wallet={wallet} params={params} />
        </StepWizard>
      </div>
    </div>
  )
}

function Step1({ goToStep, lang, wallet, OnChange }) {
  const [selectAdvanced, setSelectAdvanced] = useState(false)
  const [baseTokenAddress, setBaseTokenAddress] = useState('')
  const [initialMargin, setInitialMargin] = useState(10)
  const [maintenanceMargin, setMaintenanceMargin] = useState(5)
  const [poolMargin, setPoolMargin] = useState(100)
  const [cutRatio, setCutRatio] = useState(50)
  const [maxReward, setMaxReward] = useState(1000)
  const [minReward, setMinReward] = useState(0)
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
    if(baseTokenAddress.length !== 42 || baseTokenAddress.indexOf('0x') !== 0){
      alert(lang['please-enter-a-correct-address']) 
      return;
    }
    if(initialMargin === '' || maintenanceMargin === '' || poolMargin === '' || cutRatio === '' || maxReward === '' || minReward === ''){
      alert(lang['please-fill-in-the-data-completely']) 
      return;
    }
    OnChange('baseTokenAddress', baseTokenAddress)
    OnChange('initialMargin', initialMargin)
    OnChange('maintenanceMargin', maintenanceMargin)
    OnChange('poolMargin', poolMargin)
    OnChange('cutRatio', cutRatio)
    OnChange('maxReward', maxReward)
    OnChange('minReward', minReward)
    goToStep(2)
  }
  const addressValue = (event) => {
    let { value } = event.target
    setBaseTokenAddress(value)
  }

  const initialMarginValue = (event) => {
    let { value } = event.target
    setInitialMargin(value)
  }

  const maintenanceMarginValue = (event) => {
    let { value } = event.target
    setMaintenanceMargin(value)
  }

  const poolMarginValue = (event) => {
    let { value } = event.target
    setPoolMargin(value)
  }

  const cutRatioValue = (event) => {
    let { value } = event.target
    setCutRatio(value)
  }

  const maxRewardValue = (event) => {
    let { value } = event.target
    setMaxReward(value)
  }

  const minRewardValue = (event) => {
    let { value } = event.target
    setMinReward(value)
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
  }, [wallet, wallet.detail, wallet.detail.account, minReward, maxReward, cutRatio, baseTokenAddress, initialMargin, maintenanceMargin, poolMargin])
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
              value={baseTokenAddress}
              onChange={event => addressValue(event)}
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
                      <input
                        type='number'
                        value={initialMargin}
                        onChange={event => initialMarginValue(event)}
                      /> %
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['maintenance-margin']}
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={maintenanceMargin}
                        onChange={event => maintenanceMarginValue(event)}
                      /> %
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      {lang['pool-margin']}
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={poolMargin}
                        onChange={event => poolMarginValue(event)}
                      /> %
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
                      <input
                        type='number'
                        value={cutRatio}
                        onChange={event => cutRatioValue(event)}
                      /> %
                    </div>
                  </div>
                  <div className='no-fix'>
                    <div className='text'>
                      {lang['max-reward']}
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={maxReward}
                        onChange={event => maxRewardValue(event)}
                      />
                    </div>
                  </div>
                  <div className='no-fix'>
                    <div className='text'>
                      {lang['min-reward']}
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={minReward}
                        onChange={event => minRewardValue(event)}
                      />
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

function Step2({ goToStep, lang, wallet, OnChange }) {
  const [baseTokenAddressOther, setBaseTokenAddressOther] = useState('')

  const baseTokenAddressOtherValue = (event) => {
    let { value } = event.target
    setBaseTokenAddressOther(value)
  }
  const nextStep = () => {
    if(baseTokenAddressOther.length !== 42 || baseTokenAddressOther.indexOf('0x') !== 0){
      alert(lang['please-enter-a-correct-address']) 
      return;
    }
    OnChange('baseTokenAddressOther', baseTokenAddressOther)
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
              value={baseTokenAddressOther}
              onChange={event => baseTokenAddressOtherValue(event)}
            />
          </div>
          <div>
            {lang['for-example']}
          </div>
          <div className='next-button'>
            <button onClick={() => { goToStep(1) }}>
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

function Step3({ goToStep, lang, wallet, params }) {
  const [paramsArr,setParamsArr] = useState([])
  const [baseTokenAddress,setBaseTokenAddress] = useState('')
  const [baseTokenAddressOther,setBaseTokenAddressOther] = useState('')
  useEffect(()=>{
    let [initialMargin, baseTokenAddress, baseTokenAddressOther, maintenanceMargin, poolMargin, cutRatio, maxReward, minReward] = [...params]
    let oneArr = [ bg(poolMargin).div(bg(100)).toString(),bg(initialMargin).div(bg(100)).toString(), bg(maintenanceMargin).div(bg(100)).toString() , minReward,maxReward, bg(cutRatio).div(bg(100)).toString(),0]
    setBaseTokenAddress(baseTokenAddress)
    setBaseTokenAddressOther(baseTokenAddressOther)
    setParamsArr(oneArr)
  },[params])
  const add = async () => {

    let res = await createPool(wallet.detail.chainId,wallet.detail.account,paramsArr,baseTokenAddress,baseTokenAddressOther)
    console.log(res)
    if(res.success){
      alert(lang['success'])
    }else{
      alert(lang['fail'])
    }
  }
  return (
    <div className='step3'>
      <div className='header'>
        <span>{lang['confirm']}</span>
      </div>
      <div className='context'>
        <div className='box'>
          <span className='base-title'> {lang['base-token-addresses']}</span>
          <div className='address-token'>
            {params[1]}
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
                    {params[0]} %
                    </div>
                </div>
                <div>
                  <div className='text'>
                    {lang['maintenance-margin']}
                  </div>
                  <div className='input-value'>
                    {params[3]} %
                    </div>
                </div>
                <div>
                  <div className='text'>
                    {lang['pool-margin']}
                  </div>
                  <div className='input-value'>
                    {params[4]} %
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
                    {params[5]} %
                    </div>
                </div>
                <div className='no-fix'>
                  <div className='text'>
                    {lang['max-reward']}
                  </div>
                  <div className='input-value'>
                    {params[6]}
                  </div>
                </div>
                <div className='no-fix'>
                  <div className='text'>
                    {lang['min-reward']}
                  </div>
                  <div className='input-value'>
                    {params[7]}
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
              <Button click={add} btnText={lang['ok']} lang={lang}>
                
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default inject('wallet', 'trading')(observer(AddPool))