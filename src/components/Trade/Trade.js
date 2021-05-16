import { useState,useEffect,useRef } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';
import Button from '../Button/Button';
import {priceCache,PerpetualPoolParametersCache, isUnlocked,unlock,  getFundingRate,  getWalletBalance,  getSpecification, getEstimatedFee, getLiquidityUsed, hasWallet, getEstimatedLiquidityUsed, getEstimatedFundingRate} from '../../lib/web3js/indexV2'
import withModal from '../hoc/withModal';
import TradeConfirm from './Dialog/TradeConfirm';
import DepositMargin from './Dialog/DepositMargin'
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import { inject, Observer, observer } from 'mobx-react';




function Trade({wallet = {},spec = {}, specs = [],onSpecChange,indexPrice,position,trading}){
  const [direction, setDirection] = useState('long');
  const [contractInfo, setContractInfo] = useState(null);
  const [dropdown, setDropdown] = useState(false);  
  const [margin, setMargin] = useState('');  
  const [fundingRate, setFundingRate] = useState('');
  const [fundingRateTip, setFundingRateTip] = useState('');
  const [fundingRateAfter, setFundingRateAfter] = useState('');
  const [transFee, setTransFee] = useState('');
  const [poolLiquidity, setPoolLiquidity] = useState('');
  const [liqUsedPair, setLiqUsedPair] = useState({});
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const indexPriceRef = useRef();
  

  //交易信息
  const [tradeInfo, setTradeInfo] = useState({});
  //控制状态
  const [volume, setVolume] = useState('');  

  const directionClazz = classNames('checked-long','check-long-short',' long-short',{' checked-short' : direction === 'short'})
  const selectClass = classNames('dropdown-menu',{'show' : dropdown})
  const volumeClazz = classNames('contrant-input',{'inputFamliy' : trading.volume !== ''})

  //是否有 spec
  const hasSpec = () => spec && spec.pool

  //是否有链接钱包
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

  const directionChange = direction => {
    setVolume('')
    setDirection(direction)
  }

  const onDropdown = (event) => {
    if(specs.length > 0){
      event.stopPropagation();
      setDropdown(!dropdown)    
    }
  }

  //切换交易标的
  const onSelect = select => {
    // setVolume('')
    // position.pause();
    // indexPrice.pause();
    const selected = specs.find(config => config.symbol === select.symbol )
    if(selected){
      trading.switch(selected.symbol);
    }
  }

  const onSlide = value => {    
    trading.setMargin(value);
  }

  //refresh cache
  const refreshCache = () => {
    if(hasConnectWallet() && hasSpec()){
      const {chainId,account} = wallet.detail;
      const address = spec.pool
      priceCache.clear();
      priceCache.update(chainId,address);
      PerpetualPoolParametersCache.update(chainId,address,account);
    }
  }


  //资金费率
  const loadFundingRate = async () => {
    if(hasConnectWallet() && hasSpec()){    
      const res = await getFundingRate(wallet.detail.chainId,spec.pool)
      if(res){
        setFundingRate(res.fundingRate0)
        const tip = `Funding  Rate (per block) = ${res.fundingRatePerBlock}` +
        `\n(1 Long contract pays 1 short contract ${res.fundingRatePerBlock} ${spec.bTokenSymbol} per block)`
        setFundingRateTip(tip);
        setPoolLiquidity(res.liquidity)
      }
    }
  }


  //价值合同信息
  const loadContractInfo = async () => {
    if(hasConnectWallet() && hasSpec()){
      const contractInfo = await getSpecification(wallet.detail.chainId,spec.pool,wallet.detail.account);      
      setContractInfo(contractInfo)      
    }
  }

  //交易费用
  const loadTransactionFee = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const transFee = await getEstimatedFee(wallet.detail.chainId,spec.pool,Math.abs(trading.volume));
      setTransFee(transFee);
    }
  }

  //计算流动性的变化
  const calcLiquidityUsed = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const {detail} = wallet
      const curLiqUsed = await getLiquidityUsed(detail.chainId,spec.pool)
      const afterLiqUsed = await getEstimatedLiquidityUsed(detail.chainId,spec.pool,trading.volume)
      if(curLiqUsed && afterLiqUsed){
        setLiqUsedPair({curLiqUsed : curLiqUsed.liquidityUsed0,afterLiqUsed : afterLiqUsed.liquidityUsed1})
      }
    }
  }

  //计算funding rate的变化
  const calcFundingRateAfter = async () => {
    if(hasConnectWallet() && hasSpec()){
      const fundingRateAfter = await getEstimatedFundingRate(wallet.detail.chainId,spec.pool,trading.volume);
      if(fundingRateAfter){
        setFundingRateAfter(fundingRateAfter.fundingRate1);
      }
    }
  }


  //处理输入相关方法
  const onFocus = event => {
    const target =event.target;
    target.setAttribute('class','contrant-input inputFamliy')
  }

  const onBlur = event => {
    const target =event.target;
    if(target.value === '') {
      target.setAttribute('class','contrant-input')
    }    
  }

  const onKeyUp = event => {
    return event.target.value !== '' && /^\d*\.?\d*$/.test(event.target.value)
  }

  const volumeChange = event => {
    let {value} = event.target
    if(value === '0'){
      value = ''
    } else if(value !== ''){
      value = direction === 'long' ? value : -value
    }
    // setVolume(value);
    // trading.pause();
    trading.setVolume(value)
  }

  //完成交易
  const afterTrade = () => {
    setVolume('')
    position.load(wallet,spec);
    wallet.loadWalletBalance(wallet.detail.chainId,wallet.detail.account)
  }


  const initialzie = () => {    
    refreshCache(); //refresh cache
    loadFundingRate(); // funding rate changed
    loadContractInfo(); //contract info change    
  }

  //计算交易相关数据（dynamic balance、margin、available balance)
  const calcTradeInfo = () => {
    const info = position.info
    if(contractInfo && contractInfo.symbol === spec.symbol && info.volume && indexPrice.index) {
      const currentPosition = (+volume) + (+info.volume)
      const contractValue = Math.abs(currentPosition) * indexPrice.index * contractInfo.multiplier;
      const dynamicBalance = ((+info.margin) + (+info.unrealizedPnl)).toFixed(2)
      const margin = (contractValue * contractInfo.minInitialMarginRatio).toFixed(2);
      const leverage = (+contractValue / +dynamicBalance).toFixed(1);
      const available = (+dynamicBalance) - (+margin)
      const converted = contractValue / indexPrice.index
      const tradeInfo = {
        volume,         //合约数量
        dynamicBalance, //动态余额
        margin,         //存入保证金
        available,      //可用余额
        converted,      //换算的值
        leverage,        //杠杆
      }
      setTradeInfo(tradeInfo);
    }
  }

  //spec select hide listener
  useEffect(() => {
    const bodyClickListener = document.body.addEventListener('click',() => setDropdown(false),false)
    return () => {
      document.body.removeEventListener('click',bodyClickListener)
    }
  }, []);

  //spec --> price index --> funding rate --> balance -->  contract info
  useEffect(() => {
    initialzie();
    return () => {
    };
  }, [wallet.detail,spec]);


  // useEffect(() => {
  //   calcTradeInfo()

  //   //index color
  //   if(indexPriceRef.current){
  //     setIndexPriceClass(indexPriceRef.current > indexPrice.index ? 'fall' : 'rise')
  //   }
  //   indexPriceRef.current = indexPrice.index;
  //   return () => {};
  // }, [position.info.unrealizedPnl,position.info.volume,indexPrice.index,volume,contractInfo]);




  useEffect(() => {
    if(trading.positionInfo.volume >= 0){
      setDirection('long')
    } else {
      setDirection('short')
    }
    return () => {};
  }, [trading.positionInfo.volume]);

  useEffect(() => {
    calcFundingRateAfter();
    calcLiquidityUsed();
    loadTransactionFee();

    if(trading.volume !== '') {
      trading.pause();
      // position.pause();
      // indexPrice.pause();
    } else if(wallet.detail.account && spec.pool){
      // indexPrice.start(spec.symbol);
      // position.start(wallet,spec)
      trading.resume()
    } 
    return () => {};
  }, [trading.volume]);


  useEffect(() => {    
    if(contractInfo){
      const volume = (+margin) / ((+indexPrice.index) * (+contractInfo.multiplier) * (+contractInfo.minInitialMarginRatio)) - (+position.info.volume)
      if(!isNaN(volume)){
        const number = Math.floor(volume);
        if((number) >= 0){
          setDirection('long')
        } else {
          setDirection('short')
        }
        const cloned = {...tradeInfo}
        cloned.volume = number;
        setTradeInfo(cloned)
        setVolume(number);
      }
    }
    return () => {      
    };
  }, [margin]);


  useEffect(() => {
    if(wallet.detail.account){
      trading.init(wallet)
    }
  },[wallet.detail.account,trading.index])


   
  return (
    <div className='trade-info'>
    <div className='trade-peration'>
      <div className='check-baseToken'>
        <div className='btn-group check-baseToken-btn'>
          <button
            type='button'
            onClick={onDropdown}
            className='btn chec'>
            {spec.symbol || 'BTCUSD'} / {spec.bTokenSymbol || 'BUSD'} (10X)
            <span
              className='check-base-down' onClick={onDropdown}
            ><svg
              t='1616752321986'
              className='icon'
              viewBox='0 0 1024 1024'
              version='1.1'
              xmlns='http://www.w3.org/2000/svg'
              p-id='1700'
              width='16'
              height='16'
            >
                <path
                  d='M843.946667 285.866667L512 617.386667 180.053333 285.866667 119.893333 346.026667l331.946667 331.946666L512 738.133333l392.106667-392.106666-60.16-60.16z'
                  p-id='1701'
                  fill='#cccccc'
                ></path></svg>
              </span>
          </button>
          <div className={selectClass}>
            <div className='dropdown-box'>
              {trading.configs.map((config,index) => {
                return (
                  <div className='dropdown-item' key={index} onClick={(e) => onSelect(config)}>              
                    {config.symbol } / {config.bTokenSymbol} (10X)
                  </div>
                )
              })}
            </div>
            
          </div>
        </div>

        <div className='price-fundingRate pc'>
          <div className='index-prcie'>
            Index Price: <span className={indexPriceClass}>&nbsp; <DeriNumberFormat  value={trading.index} decimalScale={2} /></span>
          </div>
          <div className='funding-rate'>
            <span>Funding Rate Annual: &nbsp;</span>
            <span className='funding-per' title={fundingRateTip}><DeriNumberFormat value={ fundingRate } suffix='%'/></span> 
          </div>
        </div>
        <div className='price-fundingRate mobile'>
          <div className='index-prcie'>
            Index: <span className={indexPriceClass}>&nbsp; <DeriNumberFormat value={indexPrice.index} decimalScale={2}/></span>
          </div>
          <div className='funding-rate'>
            <span>Funding: &nbsp;</span>
            <span className='funding-per' title={fundingRateTip}><DeriNumberFormat value={indexPrice.index}/></span> 
          </div>
        </div>
      </div>
      <div className={directionClazz}>
        <div className='check-long' onClick={() => directionChange('long')}>LONG / BUY</div>
        <div className='check-short' onClick={() => directionChange('short')}>SHORT / SELL</div>
      </div>
      <div className='the-input'>
        <div className='left'>
          <div className='current-position'>
            <span>Current Position</span>
            <span className='position-text'><DeriNumberFormat value={trading.position.volume} allowZero={true}/></span>
          </div>
          <div className='contrant'>            
            <input
              type='number'
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyUp={onKeyUp}
              disabled={!trading.amount.available}
              onChange={event =>  volumeChange(event) }
              value={trading.volume && Math.abs(trading.volume)}
              className={volumeClazz}
              placeholder='Contract Volume'
            />
            <div className='title-volume' >
              Contract Volume
            </div>
          </div>          
          {!!volume && <div className='btc'><DeriNumberFormat value={tradeInfo.converted} allowNegative={false} decimalScale={4} prefix ='= ' suffix={` ${spec.unit}`}/></div>}
        </div>
        <div className='right-info'>
          <div className='contrant-info'>
            <div className='balance-contract'>
              <span className='balance-contract-text pc'>
                Balance in Contract<br/>
                (Dynamic Balance)
              </span>
              <span className='balance-contract-text mobile'>
                Balance in Contract<br/>
                (Dyn Bal.)
              </span>
              <span className='balance-contract-num'>
                <DeriNumberFormat value={ trading.amount.dynBalance } decimalScale={2}/>
              </span>
            </div>
            <div className='box-margin'>
              <span> Margin </span>
              <span className='margin'>
                <DeriNumberFormat value={ trading.amount.margin } allowNegative={false}  decimalScale={2}/>
              </span>
            </div>
            <div className='available-balance'>
              <span className='available-balance pc'> Available Balance </span>
              <span className='available-balance mobile'>Avail Bal</span>
              <span className='available-balance-num'>
                <DeriNumberFormat value={ trading.amount.available } decimalScale={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='slider mt-13'>
        <Slider max={trading.amount.dynBalance} onValueChange={onSlide} start={trading.amount.margin}/>
      </div>
      <div className='title-margin'>Margin</div>
      <div className='enterInfo'>
        {!!trading.volume && <>
        <div className='text-info'>
          <div className='title-enter pool'>Pool Liquidity</div>
          <div className='text-enter poolL'>
            <DeriNumberFormat value={ poolLiquidity } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } /> 
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Liquidity Used</div>
          <div className='text-enter'>
            <DeriNumberFormat value={liqUsedPair.curLiqUsed} suffix='%'/> -> <DeriNumberFormat value={ liqUsedPair.afterLiqUsed }  decimalScale={2}  suffix='%'/>
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Funding Rate Impact</div>
          <div className='text-enter'>
            <DeriNumberFormat value={ fundingRate }  suffix='%' allowNegative={false} decimalScale={4}/> -> <DeriNumberFormat value={ fundingRateAfter }  allowNegative={false} decimalScale={4} suffix='%' />
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Transaction Fee</div>
          <div className='text-enter'>
            <DeriNumberFormat value={ transFee } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } />             
          </div>
        </div>
        </>}
      </div>
      <Operator hasConnectWallet={hasConnectWallet} 
                transFee={transFee} 
                wallet={wallet} 
                spec={spec} 
                indexPrice={indexPrice} 
                available={tradeInfo.available}
                volume={volume} 
                direction={direction}
                leverage={tradeInfo.leverage}
                afterTrade={afterTrade}
                position={position}
       />
    </div>
  </div>
  )
}


const ConfirmDialog = withModal(TradeConfirm)
const DepositDialog = withModal(DepositMargin)

function Operator({hasConnectWallet,wallet,spec,volume,available,
                  baseToken,leverage,indexPrice,position,direction,transFee,afterTrade}){
  const [isApprove, setIsApprove] = useState(true);
  const [noBalance, setNoBalance] = useState(false);
  const [emptyVolume, setEmptyVolume] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');

  
  const connect = () => {
    wallet.connect()
  }

  const approve = () => {
    const {detail} = wallet
    const res = unlock(detail.chainId,spec.pool,detail.account);
    if(res.success){
      setIsApprove(true);
    } else {
      alert(res.error)
    }
  }


  const afterDeposit = async () => {    
    onClose();
    afterTrade()
  }


  //load Approve status
  const loadApprove = async () => {
    if(hasConnectWallet() && spec.pool){
      const {detail} = wallet
      const result = await isUnlocked(detail.chainId,spec.pool,detail.account).catch(e => console.log(e))
      setIsApprove(result);
    }
  }

  const loadBalance = async () => {
    if(wallet.isConnected() && spec.pool){
      const balance = await getWalletBalance(wallet.detail.chainId,spec.pool,wallet.detail.account)
      if(balance){
        setBalance(balance)
      }
    }
  }

  useEffect(() => {
    loadBalance();
    return () => {};
  }, [wallet.detail.account,spec.pool]);

  useEffect(() => {
    if((+available) > 0){
      setNoBalance(false)
    } else {
      setNoBalance(true)
    }
    return () => {
    };
  }, [available]);

  useEffect(() => {
    setEmptyVolume(!volume)
    return () => {};
  }, [volume]);


  useEffect(() => {
    loadApprove();
    return () => {      
    };
  }, [spec.pool]);

  const onClose = () => {
    setModalIsOpen(false)
  }
  

  let actionElement =(<>
    <ConfirmDialog  wallet={wallet}
                    spec={spec}
                    modalIsOpen={modalIsOpen} 
                    onClose={onClose} 
                    leverage = {leverage} 
                    baseToken={baseToken} 
                    volume={volume} 
                    direction={direction} 
                    position={position.info.volume} 
                    indexPrice={indexPrice.index} 
                    transFee={transFee}
                    afterTrade={afterTrade}
                    />
    <button className='short-submit' onClick={() => setModalIsOpen(true)}>TRADE</button>
  </>)

  if(hasConnectWallet()){
    if(!isApprove) {
      actionElement = <Button className='approve' btnText='APPROVE' onClick={approve}/>
    } else if(noBalance && available !== undefined) {
      actionElement = (<>
        <DepositDialog 
          wallet={wallet}
          modalIsOpen={modalIsOpen} 
          onClose={onClose}
          spec={spec}
          balance={balance}
          afterDeposit={afterDeposit}
        />
        <div className="noMargin-text">You have no fund in contract. Please deposit first.</div>
        <button className='short-submit'  onClick={() => setModalIsOpen(true)}>DEPOSIT</button>
      </>)
    } else if(emptyVolume) {
      actionElement = <Button className='btn btn-danger short-submit' disabled btnText='ENTER VOLUME'/>
    }
  } else {
    actionElement = <Button className='btn btn-danger connect' btnText='Connect Wallet' click={connect}/>
  }
  return (
    <div className='submit-btn'>
      {actionElement}        
    </div>
  )
}

export default inject('trading')(observer(Trade))