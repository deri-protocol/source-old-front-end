/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";
import { useParams } from "react-router-dom";
import classNames from 'classnames';
import Button from '../../../components/Button/Button';
import { bg, addSymbol, getPoolOpenOracleList, DeriEnv, getPoolAllSymbolNames } from '../../../lib/web3js/indexV2'
import useQuery from '../../../hooks/useQuery'
import down from './img/down.svg';
import up from './img/up.svg';
import warn from './img/warn.svg';
import symbolArrowIcon from '../../../assets/img/symbol-arrow.svg'
import TipWrapper from '../../../components/TipWrapper/TipWrapper';
import './addsymbol.less'

function AddSymbol({ wallet = {}, lang }) {
  const [multiplier, setMultiplier] = useState('1')
  const [fundingRateCoefficient, setFundingRateCoefficient] = useState('0.000004')
  const [transactionFeeRatio, setTransactionFeeRatio] = useState('0.1')
  const [symbolId, setSymbolId] = useState(0)
  const [oracleConfig, setOracleConfig] = useState(
    DeriEnv.get() === 'dev' ?
      {
        symbol: "BTCUSD",
        address: "0x78Db6d02EE87260a5D825B31616B5C29f927E430",
        chainId: '96'
      }
      : {
        symbol: "BTCUSD",
        address: "0x5632A70669411D4de43d405E1880018ff85daaD3",
        chainId: '56'
      }
  )



  const [parameters, setParameters] = useState([]);
  const { version, chainId, symbol, baseToken, address, type } = useParams();
  const query = useQuery();
  const props = { version, chainId, symbol, baseToken, address, wallet, type, lang }
  if (query.has('baseTokenId')) {
    props['baseTokenId'] = query.get('baseTokenId')
  }
  if (query.has('symbolId')) {
    props['symbolId'] = query.get('symbolId')
  }
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const getPoolALLSymbolId = async () => {
    let res = await getPoolAllSymbolNames(wallet.detail.chainId, address)
    let id = res.length
    setSymbolId(id)
  }

  useEffect(() => {
    if (hasConnectWallet()) {
      getPoolALLSymbolId();
    }
  }, [wallet, wallet.detail, address])

  const StepChange = (name, value) => {
    if (name === 'multiplier') {
      setMultiplier(value)
    }
    if (name === 'fundingRateCoefficient') {
      setFundingRateCoefficient(value)
    }
    if (name === 'transactionFeeRatio') {
      setTransactionFeeRatio(value)
    }
    if (name === 'oracleConfig') {
      setOracleConfig(value)
    }
  }

  useEffect(() => {
    let arr = [symbolId, oracleConfig.symbol, oracleConfig.address, multiplier, fundingRateCoefficient, bg(transactionFeeRatio).div(bg(100)).toString()]
    setParameters(arr)
  }, [multiplier, fundingRateCoefficient, transactionFeeRatio, oracleConfig, symbolId])

  useEffect(() => {
  }, [wallet, wallet.detail])
  return (
    <div className='add-symbol'>
      <div className='Step-box'>
        <StepWizard
          initialStep={1}
        >
          <Step1 lang={lang} wallet={wallet} props={props} OnChange={StepChange} />
          <Step2 lang={lang} wallet={wallet} props={props} parameters={parameters} />
        </StepWizard>
      </div>
    </div>
  )
}

function Step1({ goToStep, lang, wallet, props, OnChange }) {
  const [multiplier, setMultiplier] = useState('1')
  const [fundingRateCoefficient, setFundingRateCoefficient] = useState('0.000004')
  const [transactionFeeRatio, setTransactionFeeRatio] = useState('0.1')
  const [selectAdvanced, setSelectAdvanced] = useState(true)
  const [dropdown, setDropdown] = useState(false);
  const [oracleConfigs, setOracleConfigs] = useState([])
  const [oracleConfig, setOracleConfig] = useState(DeriEnv.get() === 'dev' ?
    {
      symbol: "BTCUSD",
      symbolId: 0,
      address: "0x78Db6d02EE87260a5D825B31616B5C29f927E430",
      chainId: '96'
    }
    : {
      symbol: "BTCUSD",
      symbolId: 0,
      address: "0x5632A70669411D4de43d405E1880018ff85daaD3",
      chainId: '56'
    })
  const selectClass = classNames('dropdown-menu', { 'show': dropdown })
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
    if (oracleConfigs.length > 0) {
      event.preventDefault();
      setDropdown(!dropdown)
    }
  }
  const onSelect = (select) => {
    const selected = oracleConfigs.find(config => config.address === select.address && select.chainId === config.chainId)
    if (selected) {
      setOracleConfig(selected)
      setDropdown(false)
    }
  }

  const nextStep = () => {
    OnChange('multiplier', multiplier)
    OnChange('fundingRateCoefficient', fundingRateCoefficient)
    OnChange('transactionFeeRatio', transactionFeeRatio)
    OnChange('oracleConfig', oracleConfig)
    goToStep(2)
  }

  const multiplierValue = (event) => {
    let { value } = event.target
    setMultiplier(value)
  }

  const fundingRateCoefficientValue = (event) => {
    let { value } = event.target
    setFundingRateCoefficient(value)
  }

  const transactionFeeRatioValue = (event) => {
    let { value } = event.target
    setTransactionFeeRatio(value)
  }

  const oracleList = async () => {
    let res = await getPoolOpenOracleList(wallet.detail.chainId)
    setOracleConfig(res[0])
    setOracleConfigs(res)
  }

  useEffect(() => {
    if (hasConnectWallet()) {
      oracleList()
    }
  }, [wallet.detail.chainId])

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
  }, [wallet, wallet.detail, wallet.detail.account, oracleConfig, multiplier, fundingRateCoefficient, transactionFeeRatio])
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
                <SymbolDisplay spec={oracleConfig} />
                <span className='check-base-down'><img src={symbolArrowIcon} alt='' /></span>
              </button>
              <div className={selectClass}>
                {oracleConfigs.map((config, index) => {
                  return (
                    <div className='dropdown-item' key={index} onClick={(e) => onSelect(config)}>
                      <SymbolDisplay spec={config} />
                    </div>
                  )
                })}
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
              {oracleConfig ? oracleConfig.symbol : ''}
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
                      <TipWrapper block={false}>
                        <span className='hover-title' title={lang['multiplier-hover']}>
                          {lang['multiplier']}
                        </span>
                      </TipWrapper>
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={multiplier}
                        onChange={event => multiplierValue(event)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      <TipWrapper block={false}>
                        <span className='hover-title' title={lang['funding-rate-coefficient-hover']}>
                          {lang['funding-rate-coefficient']}
                        </span>
                      </TipWrapper>
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={fundingRateCoefficient}
                        onChange={event => fundingRateCoefficientValue(event)}
                      />
                    </div>
                  </div>
                  <div>
                    <div className='text'>
                      <TipWrapper block={false}>
                        <span className='hover-title' title={lang['transaction-fee-ratio-hover']}>
                          {lang['transaction-fee-ratio']}
                        </span>
                      </TipWrapper>
                    </div>
                    <div className='input-value'>
                      <input
                        type='number'
                        value={transactionFeeRatio}
                        onChange={event => transactionFeeRatioValue(event)}
                      />  %
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

function Step2({ goToStep, lang, wallet, props, parameters }) {
  const add = async () => {
    let res = await addSymbol(wallet.detail.chainId, props.address, wallet.detail.account, parameters)
    if (res.success) {
      alert(lang['success'])
    } else {
      alert(lang['fail'])
    }
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
            {parameters[1]}
          </div>

          <span className='symbol-title'> {lang['symbol-name']}</span>
          <div className='symbol-name'>
            {parameters[1]}
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
                    {parameters[3]}
                  </div>
                </div>
                <div>
                  <div className='text'>
                    {lang['funding-rate-coefficient']}
                  </div>
                  <div className='input-value'>
                    {parameters[4]}
                  </div>
                </div>
                <div>
                  <div className='text'>
                    {lang['transaction-fee-ratio']}
                  </div>
                  <div className='input-value'>
                    {parameters[5] * 100}  %
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
              <Button click={add} btnText={lang['ok']} lang={lang} >
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SymbolDisplay({ spec }) {
  if (spec) {
    return (
      `${spec.symbol}`
    )
  }
  return ''

}

export default inject('wallet')(observer(AddSymbol))