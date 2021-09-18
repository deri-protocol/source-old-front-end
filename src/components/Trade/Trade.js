import { useState, useEffect, useRef } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';
import Button from '../Button/Button';
import { priceCache, getIntrinsicPrice, PerpetualPoolParametersCache, isUnlocked, unlock, getFundingRate, getWalletBalance, getSpecification, getEstimatedFee, getLiquidityUsed, hasWallet, getEstimatedLiquidityUsed, getEstimatedFundingRate, getEstimatedTimePrice } from '../../lib/web3js/indexV2'
import withModal from '../hoc/withModal';
import TradeConfirm from './Dialog/TradeConfirm';
import DepositMargin from './Dialog/DepositMargin'
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import { inject, observer } from 'mobx-react';
import { BalanceList } from './Dialog/BalanceList';
import SymbolSelector from './SymbolSelector';
import { bg } from "../../lib/web3js/indexV2";
import TipWrapper from '../TipWrapper/TipWrapper';



const ConfirmDialog = withModal(TradeConfirm)
const DepositDialog = withModal(DepositMargin)
const BalanceListDialog = withModal(BalanceList)


function Trade({ wallet = {}, trading, version, lang, type }) {
  const [direction, setDirection] = useState('long');
  const [markPrice, setMarkPrice] = useState();
  const [spec, setSpec] = useState({});
  const [fundingRateAfter, setFundingRateAfter] = useState('');
  const [markPriceAfter, setMarkPriceAfter] = useState('');
  const [transFee, setTransFee] = useState('');
  const [liqUsedPair, setLiqUsedPair] = useState({});
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const [markPriceClass, setMarkPriceClass] = useState('rise');
  const [slideFreeze, setSlideFreeze] = useState(true);
  const [inputing, setInputing] = useState(false);
  const [isOptionInput, setIsOptionInput] = useState(false);
  const [stopCalculate, setStopCalculate] = useState(false)
  const indexPriceRef = useRef();
  const markPriceRef = useRef();
  const directionClazz = classNames('checked-long', 'check-long-short', ' long-short', { 'checked-short': direction === 'short' })
  const volumeClazz = classNames('contrant-input', { 'inputFamliy': trading.volume !== '' })



  //是否有链接钱包
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

  const directionChange = direction => {
    trading.setVolume('')
    setDirection(direction)
  }

  const switchDirection = () => {
    if (direction === 'long') {
      setDirection('short')
    } else {
      setDirection('long')
    }
  }

  const onSlide = (value, needSwitchDirection) => {
    trading.setSlideMargin(value);
    setInputing(false)
    needSwitchDirection && switchDirection();
  }


  const makeLongOrShort = (volume) => {
    if (volume >= 0) {
      setDirection('long')
    } else {
      setDirection('short')
    }
  }


  //交易费用
  const loadTransactionFee = async () => {
    if (hasConnectWallet() && trading.config && trading.volumeDisplay) {
      let volume = volumeMu(trading.volumeDisplay)
      const transFee = await getEstimatedFee(wallet.detail.chainId, trading.config.pool, Math.abs(volume), trading.config.symbolId);
      if (!isNaN(transFee)) {
        setTransFee((+transFee).toFixed(2));
      }
    }
  }

  const volumeMu = (volume) => {
    return type.isOption ? bg(volume).div(bg(trading.contract.multiplier)).toString() : volume
  }

  //计算流动性的变化
  const calcLiquidityUsed = async () => {
    if (hasConnectWallet() && trading.config && trading.volumeDisplay && type.isFuture) {
      const { detail } = wallet
      const volume = direction === 'long' ? trading.volumeDisplay : -trading.volumeDisplay
      const curLiqUsed = await getLiquidityUsed(detail.chainId, trading.config.pool, trading.config.symbolId)
      const afterLiqUsed = await getEstimatedLiquidityUsed(detail.chainId, trading.config.pool, volume, trading.config.symbolId)
      if (curLiqUsed && afterLiqUsed) {
        setLiqUsedPair({ curLiqUsed: curLiqUsed.liquidityUsed0, afterLiqUsed: afterLiqUsed.liquidityUsed1 })
      }
    }
  }

  //计算funding rate的变化
  const calcFundingRateAfter = async () => {
    if (hasConnectWallet() && trading.config && trading.volumeDisplay) {
      let num = volumeMu(trading.volumeDisplay)
      const volume = (direction === 'long' ? num : -num)
      const fundingAfter = await getEstimatedFundingRate(wallet.detail.chainId, trading.config.pool, volume, trading.config.symbolId);
      if (fundingAfter) {
        let funding = type.isOption ? fundingAfter.deltaFunding1  : fundingAfter.fundingRate1
        setFundingRateAfter(funding);
      }
    }
  }

  //计算markPrice
  const calcMarkPriceAfter = async () => {
    if (hasConnectWallet() && trading.config && trading.volumeDisplay) {
      let num = volumeMu(trading.volumeDisplay)
      const volume = (direction === 'long' ? num : -num)
      const markPriceAfter = await getEstimatedTimePrice(wallet.detail.chainId, trading.config.pool, volume, trading.config.symbolId);
      if (markPriceAfter) {
        // let markP = getIntrinsicPrice(trading.index, trading.position.strikePrice, trading.position.isCall).plus(markPriceAfter).toString()
        setMarkPriceAfter(markPriceAfter);
      }
    }
  }


  //处理输入相关方法
  const onFocus = event => {
    const target = event.target;
    target.setAttribute('class', 'contrant-input inputFamliy')
  }


  const onKeyPress = evt => {
    if(type.isOption){
      if (evt.which !== 46 && (evt.which < 48 || evt.which > 57)) {
        evt.preventDefault();
      }
    }else if(type.isFuture){
      if(evt.which < 48 || evt.which > 57) {
        evt.preventDefault();
      }
    }
    
  }

  const volumeChange = event => {
    let { value } = event.target
    if (value === '0' && type.isFuture) {
      value = ''
    }
    trading.setVolume(value)
    setInputing(true)
  }


  const onBlur = event => {
    const target = event.target;
    if(type.isOption){
      let index = trading.contract.multiplier.indexOf('.')
      let num = trading.contract.multiplier.slice(index);
      let length = num.length 
      let value = target.value
      if(target.value.indexOf(".") !== -1){
        value = target.value.substring(0,target.value.indexOf(".") + length)
        value = value === '0' ? '' : value
        if(+value === 0){
          setIsOptionInput(true)
        }else{
          setIsOptionInput(false)
        }
      }
      // let reg = new RegExp(`([0-9]+\.[0-9]{${length}})[0-9]*`) 
      // if(target.value.indexOf(".") === 0){
      //   value = 0 + value
      // }
      trading.setVolume(value)
    }
    if (target.value === '') {
      target.setAttribute('class', 'contrant-input')
    }
  }

  //完成交易
  const afterTrade = () => {
    trading.setVolume('')
    trading.refresh();
    wallet.refresh();
  }

  useEffect(() => {
    if (trading.position && trading.position.volume) {
      makeLongOrShort((+trading.position.volume))
    }
    return () => { };
  }, [trading.position.volume]);

  useEffect(() => {
    if (!stopCalculate && trading.volumeDisplay !== '') {
      trading.pause();
      calcFundingRateAfter();
      if (type.isOption) {
        calcMarkPriceAfter();
      }
      calcLiquidityUsed();
      loadTransactionFee();
    } else if (wallet.detail.account) {
      trading.resume()
    }

    return () => { };
  }, [trading.volumeDisplay, stopCalculate]);


  useEffect(() => {
    if (indexPriceRef.current > trading.index) {
      setIndexPriceClass('fall')
    } else {
      setIndexPriceClass('rise')
    }
    indexPriceRef.current = trading.index
    return () => {
    };
  }, [trading.index]);

  useEffect(() => {
    if (type.isOption) {
      let mark = trading.position.markPrice
      if (markPriceRef.current > mark) {
        setMarkPriceClass('fall')
      } else {
        setMarkPriceClass('rise')
      }
      markPriceRef.current = mark
      setMarkPrice(mark)
    }
  }, [trading.index,trading.position])

  useEffect(() => {
    if (trading.config) {
      setSpec(trading.config)
    }
    return () => { 
      // setMarkPriceAfter('')
      // setFundingRateAfter('');
    };
  }, [trading.config]);

  useEffect(() => {
    if (trading.margin) {
      trading.direction && setDirection(trading.direction)
    }
    return () => { };
  }, [trading.margin]);

  useEffect(() => {
    if (trading.index && wallet.isConnected() && wallet.supportChain) {
      setSlideFreeze(false)
    }
    return () => { };
  }, [wallet.detail.account, trading.index]);

  useEffect(() => {
    //不作用于键盘输入，只作用于slider
    if (!inputing) {
      if (trading.position.volume > 0) {
        if (trading.volume < 0) {
          setDirection('short')
        } else {
          setDirection('long')
        }
      } else if (trading.position.volume < 0) {
        if (trading.volume > 0) {
          setDirection('short')
        } else {
          setDirection('long')
        }
      }
    }
    return () => { };
  }, [trading.volume, inputing]);


  useEffect(() => {
    trading.setUserSelectedDirection(direction)
    return () => { };
  }, [direction]);



  return (
    <div className='trade-info'>
      <div className='trade-peration'>
        <div className='check-baseToken'>
          <SymbolSelector setSpec={setSpec} spec={trading.config} isOption={type.isOption} />
          <div className={type.isOption ? 'price-fundingRate pc options' : 'price-fundingRate pc'}>
            {type.isFuture && <>
              <div className='index-prcie'>
                {lang['index-price']}: <span className={indexPriceClass}>&nbsp; <DeriNumberFormat value={trading.index} decimalScale={2} /></span>
              </div>
            </>}
            {type.isOption && <>
              <div className='mark-price'>
                {lang['eo-mark-price']} : <span className={markPriceClass}>&nbsp; <DeriNumberFormat value={markPrice} decimalScale={4} /></span>
              </div>
              <div className='index-prcie'>
                {trading.config ? type.isOption ? trading.config.symbol.split('-')[0] : '' : ''} : <span className='option-vol'>&nbsp; <span> <DeriNumberFormat value={trading.index} decimalScale={2} /></span><span className='vol'> | </span>{lang['vol']} : <DeriNumberFormat value={trading.position.volatility} decimalScale={2} suffix='%' /></span>
              </div>
            </>}
            <div className='funding-rate'>
              
              {type.isOption && <>
                <span>{lang['funding-rate']} : &nbsp;</span>
                <TipWrapper block={false} tip={trading.optionFundingRateTip}>
                  <span className='funding-per' tip={trading.optionFundingRateTip || ''}><DeriNumberFormat value={trading.fundingRate.premiumFunding0} decimalScale={4}  /></span>
                </TipWrapper>
              </>}
              {type.isFuture && <>
                <span>{lang['funding-rate-annual']} : &nbsp;</span>
                <TipWrapper block={false} tip={trading.fundingRateTip}>
                  <span className='funding-per' tip={trading.fundingRateTip || ''}><DeriNumberFormat value={trading.fundingRate.fundingRate0} decimalScale={4} suffix='%' /></span>
                </TipWrapper>
              </>}
            </div>
          </div>
          <div className={type.isOption ? 'price-fundingRate mobile options' : 'price-fundingRate mobile'}>
            {type.isFuture && <>
              <div className='index-prcie'>
                {lang['index']}: <span className={indexPriceClass}>&nbsp; <DeriNumberFormat value={trading.index} decimalScale={2} /></span>
              </div>
            </>}
            {type.isOption && <>
              <div className='mark-price'>
                {lang['eo-mark-price']} : <span className={markPriceClass}>&nbsp; <DeriNumberFormat value={markPrice} decimalScale={2} /></span>
              </div>
              <div className='index-prcie'>
                {trading.config ? type.isOption ? trading.config.symbol.split('-')[0] : '' : ''}: <span className={indexPriceClass}>&nbsp; <DeriNumberFormat value={trading.index} decimalScale={2} /></span>
              </div>
              <div className='index-prcie'>
                {lang['vol']}: <DeriNumberFormat value={trading.position.volatility} decimalScale={2} />
              </div>
              
            </>}
            <div className='funding-rate'>
              {type.isOption && <>
                <span>{lang['funding-rate']} : &nbsp;</span>
                <TipWrapper block={false}>
                  <span className='funding-per' tip={trading.optionFundingRateTip || ''}><DeriNumberFormat value={trading.fundingRate.premiumFunding0} decimalScale={4}  /></span>
                </TipWrapper>
              </>}
              {type.isFuture && <>
                <span>{lang['funding-rate-annual']} : &nbsp;</span>
                <TipWrapper block={false}>
                  <span className='funding-per' tip={trading.fundingRateTip || ''}><DeriNumberFormat value={trading.fundingRate.fundingRate0} decimalScale={4} suffix='%' /></span>
                </TipWrapper>
              </>}
            </div>
          </div>
        </div>
        <div className={directionClazz}>
          <div className='check-long' onClick={() => directionChange('long')}>{lang['long-buy']}</div>
          <div className='check-short' onClick={() => directionChange('short')}>{lang['short-sell']}</div>
        </div>
        <div className='the-input'>
          <div className='left'>
            <div className='current-position'>
              <span>{lang['current-position']}</span>
              <span className='position-text'>
              <DeriNumberFormat value={trading.position.volume} allowZero={true} />
              </span>
            </div>
            {type.isFuture && <>
              <div className='contrant'>
                <input
                  type='number'
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyPress={onKeyPress}
                  disabled={!trading.index || Math.abs(trading.position.margin) === 0}
                  onChange={event => volumeChange(event)}
                  value={trading.volumeDisplay}
                  className={volumeClazz}
                  placeholder={lang['contract-volume']}
                />
                <div className='title-volume' >
                  {lang['contract-volume']}
                </div>
              </div>
            </>}
            {type.isOption && <>
              <div className='contrant option-input'>
                <input
                  type='number'
                  step={trading.contract.multiplier}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  onKeyPress={onKeyPress}
                  disabled={!trading.index || Math.abs(trading.position.margin) === 0}
                  onChange={event => volumeChange(event)}
                  value={trading.volumeDisplay}
                  className={volumeClazz}
                  placeholder={lang['option-input']}
                />
                <div className='option-unit' >
                  {trading.config && trading.config.unit}
                </div>
              </div>
              {isOptionInput && <>
                <div className='min-quantity'>
                {lang['option-input-min-quantity']}
                &nbsp; {trading.contract.multiplier} &nbsp;
                {trading.config && trading.config.unit}
              </div>
              </>}
            </>}
            {(!!trading.volumeDisplay && type.isFuture) && <div className='btc'><DeriNumberFormat value={trading.amount.exchanged} allowNegative={false} decimalScale={4} prefix='= ' suffix={` ${spec.unit}`} /></div>}
          </div>
          <div className='right-info'>
            <div className={`contrant-info ${version.current}`}>
              <div className='balance-contract'>
                {/* v1 */}
                {(version.isV1) && <>
                  <span className='balance-contract-text pc v1'>
                    {lang['balance-in-contract']}<br />
                  ({lang['dynamic-balance']})
                </span>
                  <span className='balance-contract-text mobile v1'>
                    {lang['balance-in-contract']}<br />
                  ({lang['dynamic-balance']})
                </span>
                </>}
                {/* v2 */}
                {(version.isV2 || version.isV2Lite || type.isOption || version.isOpen) && <TipWrapper block={false}>
                  <span className='balance-contract-text pc' tip={lang['dynamic-effective-balance-title']}>
                    {lang['dynamic-effective-balance']}
                  </span>
                  <span className='balance-contract-text mobile' tip={lang['dynamic-effective-balance-title']}>
                    {lang['dynamic-effective-balance']}
                  </span>
                </TipWrapper>}
                <span className={`balance-contract-num ${version.current}`}>
                  <DeriNumberFormat value={trading.amount.dynBalance} allowZero={true} decimalScale={2} />
                </span>
              </div>
              {(version.isV1) && <div className='box-margin'>
                <span>{lang['margin']}</span>
                <span className='margin'>
                  <DeriNumberFormat value={trading.amount.margin} allowZero={true} decimalScale={2} />
                </span>
              </div>}
              {(version.isV2 || version.isV2Lite || type.isOption || version.isOpen) && <TipWrapper block={false} >
                <div className='box-margin'>{lang['margin']}</div>
                <div className='box-margin'>
                  <span className='total-held' tip={lang['total-held-title']}>&nbsp;- {lang['total-held']}</span>
                  <span className='margin' ><DeriNumberFormat value={trading.amount.margin} allowZero={true} decimalScale={2} /></span>
                </div>
                <div className='margin-held-pos'>
                  <span className='pos-held' tip={lang['for-this-pos-title']}>&nbsp;- {lang['for-this-pos']} </span>
                  <span className='margin' ><DeriNumberFormat value={trading.amount.currentSymbolMarginHeld} allowZero={true} decimalScale={2} /></span>
                </div>
              </TipWrapper>
              }
              <TipWrapper block={true}>
                <div className='available-balance'>
                    <span className='pc' tip={lang['available-balance-title']} > {lang['available-balance']} </span>
                    <span className='mobile' tip={lang['available-balance-title']}>{lang['available-balance']}</span>
                    <span className='available-balance-num'>
                      <DeriNumberFormat value={trading.amount.available} allowZero={true} decimalScale={2} />
                    </span>
                </div>
              </TipWrapper>
            </div>
          </div>
        </div>
        <div className='slider mt-13'>
          <Slider max={trading.amount.dynBalance} onValueChange={onSlide} start={trading.amount.margin} freeze={slideFreeze} currentSymbolMarginHeld={trading.position.marginHeldBySymbol} originMarginHeld={trading.position.marginHeld} setStopCalculate={(value) => setStopCalculate(value)} />
        </div>
        <div className='title-margin'>{lang['margin']}</div>
        <div className='enterInfo'>
          {!!trading.volumeDisplay && <>
            {type.isFuture && <>
              <div className='text-info'>
                <div className='title-enter pool'>{lang['pool-liquidity']}</div>
                <div className='text-enter poolL'>
                  <DeriNumberFormat value={trading.fundingRate.liquidity} decimalScale={2} suffix={` ${spec.bTokenSymbol}`} />
                </div>
              </div>
              <div className='text-info'>
                <div className='title-enter'>{lang['liquidity-used']}</div>
                <div className='text-enter'>
                  <DeriNumberFormat value={liqUsedPair.curLiqUsed} suffix='%' decimalScale={2} /> -> <DeriNumberFormat value={liqUsedPair.afterLiqUsed} decimalScale={2} suffix='%' />
                </div>
              </div>
              <div className='text-info'>
                <div className='title-enter'>{lang['funding-rate-impact']}</div>
                <div className='text-enter'>
                  <DeriNumberFormat value={trading.fundingRate.fundingRate0} suffix='%' decimalScale={4} /> -> <DeriNumberFormat value={fundingRateAfter} decimalScale={4} suffix='%' />
                </div>
              </div>
            </>}
            {type.isOption && <>
              <div className='text-info'>
                <div className='title-enter pool'>{lang['mark-price']}</div>
                <div className='text-enter poolL'>
                  <DeriNumberFormat value={markPrice} decimalScale={4} />
                </div>
              </div>
              <div className='text-info'>
                <div className='title-enter pool'>{lang['trade-price']}</div>
                <div className='text-enter poolL'>
                  <DeriNumberFormat value={markPriceAfter} decimalScale={4} />
                </div>
              </div>
              <div className='text-info'>
                <div className='title-enter pool'>{lang['pool-liquidity']}</div>
                <div className='text-enter poolL'>
                  <DeriNumberFormat value={trading.fundingRate.liquidity} thousandSeparator={true} decimalScale={2} suffix={` ${trading.config.bTokenSymbol}`} />
                </div>
              </div>
              
            </>}
            <div className='text-info'>
              <div className='title-enter'>{lang['transaction-fee']}</div>
              <div className='text-enter'>
                <DeriNumberFormat value={transFee} allowZero={true} decimalScale={2} suffix={` ${trading.config.bTokenSymbol}`} />
              </div>
             
            </div>
          </>}
        </div>
        <Operator hasConnectWallet={hasConnectWallet}
          transFee={transFee}
          wallet={wallet}
          spec={trading.config}
          indexPrice={trading.index}
          available={trading.amount.available}
          volume={trading.volumeDisplay}
          direction={direction}
          leverage={trading.amount.leverage}
          afterTrade={afterTrade}
          position={trading.position}
          trading={trading}
          // symbolId={trading.config.symbolId}
          // bTokenId={trading.config.bTokenId}
          version={version}
          lang={lang}
          type={type}
          markPriceAfter={markPriceAfter}
        />
      </div>
      {/* <Loading modalIsOpen={loaded} overlay={{background : 'none'}}/> */}
    </div>
  )
}


function Operator({ hasConnectWallet, wallet, spec, volume, available,
  baseToken, leverage, indexPrice, position, transFee, afterTrade, direction, trading, version, lang, type, markPriceAfter }) {
  const [isApprove, setIsApprove] = useState(true);
  const [emptyVolume, setEmptyVolume] = useState(true);
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [depositIsOpen, setDeposiIsOpen] = useState(false);
  const [balance, setBalance] = useState('');


  const connect = () => {
    wallet.connect()
  }

  const approve = async () => {
    const res = await wallet.approve(spec.pool, spec.bTokenId)
    if (res.success) {
      setIsApprove(true);
      loadApprove();
    } else {
      setIsApprove(false)
      alert(lang['approve-failed'])
    }
  }


  const afterDeposit = async () => {
    trading.refresh();
    setDeposiIsOpen(false);
  }

  const afterDepositAndWithdraw = () => {
    trading.refresh();
    setDeposiIsOpen(false);
  }


  //load Approve status
  const loadApprove = async () => {
    if (hasConnectWallet() && spec) {
      const result = await wallet.isApproved(spec.pool, spec.bTokenId)
      setIsApprove(result);
    }
  }

  const loadBalance = async () => {
    if (wallet.isConnected() && spec) {
      const balance = await getWalletBalance(wallet.detail.chainId, spec.pool, wallet.detail.account, spec.bTokenId).catch(e => console.error('getWalletBalance was error,maybe network is Wrong'))
      if (balance) {
        setBalance(balance)
      }
    }
  }

  useEffect(() => {
    if (hasConnectWallet() && spec) {
      loadBalance();
    }
    return () => { };
  }, [wallet.detail.account, spec, available]);


  useEffect(() => {
    setEmptyVolume(!volume)
    return () => { };
  }, [volume]);


  useEffect(() => {
    if (spec) {
      loadApprove();
    }
    return () => { };
  }, [wallet.detail.isApproved, spec]);


  let actionElement = (<>
    <ConfirmDialog wallet={wallet}
      className='trading-dialog'
      spec={spec}
      modalIsOpen={confirmIsOpen}
      onClose={() => setConfirmIsOpen(false)}
      leverage={leverage}
      baseToken={baseToken}
      volume={volume}
      position={position.volume}
      indexPrice={indexPrice}
      transFee={transFee}
      afterTrade={afterTrade}
      direction={direction}
      lang={lang}
      markPriceAfter={markPriceAfter}
      trading={trading}
    />
    <button className='short-submit' onClick={() => setConfirmIsOpen(true)}>{lang['trade']}</button>
  </>)

  if (hasConnectWallet()) {
    if (!isApprove) {
      actionElement = <Button className='approve' btnText={lang['approve']} click={approve} lang={lang} />
    } else if (!available || (+available) <= 0) {
      actionElement = (<>
        {(version.isV2 && !type.isOption)
          ?
          <BalanceListDialog
            wallet={wallet}
            modalIsOpen={depositIsOpen}
            onClose={afterDepositAndWithdraw}
            spec={spec}
            afterDepositAndWithdraw={afterDepositAndWithdraw}
            position={trading.position}
            overlay={{ background: '#1b1c22', top: 80 }}
            className='balance-list-dialog'
            lang={lang}
          />
          :
          <DepositDialog
            wallet={wallet}
            modalIsOpen={depositIsOpen}
            onClose={() => setDeposiIsOpen(false)}
            spec={spec}
            balance={balance}
            afterDeposit={afterDeposit}
            className='trading-dialog'
            lang={lang}
          />}
        <div className="noMargin-text">{((+trading.position.margin) === 0 || !trading.position.margin) ? lang['no-margin-tip'] : lang['not-enough-margin-tip']}</div>
        <button className='short-submit' onClick={() => setDeposiIsOpen(true)}>{lang['deposit']}</button>
      </>)
    } else if (emptyVolume) {
      actionElement = <button className='btn btn-danger short-submit' >{lang['enter-volume']}</button>
    }
  } else {
    actionElement = <Button className='btn btn-danger connect' btnText={lang['connect-wallet']} click={connect} lang={lang} />
  }
  return (
    <div className='submit-btn'>
      {actionElement}
    </div>
  )
}

export default inject('wallet', 'trading', 'version','type')(observer(Trade))