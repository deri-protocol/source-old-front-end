import { useState,useEffect,useRef } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';
import Button from '../Button/Button';
import {priceCache,PerpetualPoolParametersCache, isUnlocked,unlock, DeriEnv, deriToNatural, getFundingRate, getUserWalletBalance, getWalletBalance, getPositionInfo, getSpecification, getEstimatedFee, getLiquidityUsed, hasWallet, getEstimatedLiquidityUsed, getEstimatedFundingRate} from '../../lib/web3js/index'
import NumberFormat from 'react-number-format';
import withModal from '../hoc/withModal';
import TradeConfirm from './Dialog/TradeConfirm';
import DepositMargin from './Dialog/DepositMargin'
import useInterval from '../../hooks/useInterval';




export default function TradeInfo({wallet = {},spec = {}, specs = [],onSpecChange,indexPrice}){
  const [direction, setDirection] = useState('long');
  const [contractInfo, setContractInfo] = useState(null);
  const [dropdown, setDropdown] = useState(false);  
  const [margin, setMargin] = useState('0.00');  
  const [position, setPosition] = useState({});
  const [fundingRate, setFundingRate] = useState('0.00');
  const [fundingRateTip, setFundingRateTip] = useState('');
  const [fundingRateAfter, setFundingRateAfter] = useState('');
  const [transFee, setTransFee] = useState('');
  const [poolLiquidity, setPoolLiquidity] = useState('');
  const [liqUsedPair, setLiqUsedPair] = useState({});
  const [indexPriceClass, setIndexPriceClass] = useState('');
  const indexPriceRef = useRef();
  

  //交易信息
  const [tradeInfo, setTradeInfo] = useState({});
  //控制状态
  const [volume, setVolume] = useState('');  

  // useInterval(loadPosition,3000)

  const directionClazz = classNames('checked-long','check-long-short',' long-short',{' checked-short' : direction === 'short'})
  const selectClass = classNames('dropdown-menu',{'show' : dropdown})
  const volumeClazz = classNames('contrant-input',{'inputFamliy' : volume !== ''})

  //是否有 spec
  const hasSpec = () => spec && spec.pool

  //是否有链接钱包
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

  const directionChange = direction => {
    setDirection(direction)
    setVolume('')
  }

  const onDropdown = (event) => {
    if(specs.length > 0){
      event.stopPropagation();
      setDropdown(!dropdown)    
    }
  }

  //切换交易标的
  const onSelect = select => {
    const selected = specs.find(config => config.symbol === select.symbol )
    onSpecChange(selected);
  }

  const onSlide = value => {    
    setMargin(value);
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


  //当前仓位
  async function loadPosition() {
    if(hasConnectWallet() && hasSpec()) {
      const position = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account);
      if(position){
        setPosition(position);
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
      const transFee = await getEstimatedFee(wallet.detail.chainId,spec.pool,volume);
      setTransFee(transFee);
    }
  }

  //计算流动性的变化
  const calcLiquidityUsed = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const {detail} = wallet
      const curLiqUsed = await getLiquidityUsed(detail.chainId,spec.pool)
      const afterLiqUsed = await getEstimatedLiquidityUsed(detail.chainId,spec.pool,volume)
      if(curLiqUsed && afterLiqUsed){
        setLiqUsedPair({curLiqUsed : curLiqUsed.liquidityUsed0,afterLiqUsed : afterLiqUsed.liquidityUsed1})
      }
    }
  }

  //计算funding rate的变化
  const calcFundingRateAfter = async () => {
    if(hasConnectWallet() && hasSpec()){
      const fundingRateAfter = await getEstimatedFundingRate(wallet.detail.chainId,spec.pool,volume);
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

  //完成交易
  const afterTrade = () => {
    setVolume('')
    loadPosition();
  }


  const initialzie = () => {    
    refreshCache(); //refresh cache
    loadFundingRate(); // funding rate changed
    loadPosition() // balance in contract changed
    loadContractInfo(); //contract info change    
  }

  //计算交易相关数据（dynamic balance、margin、available balance)
  const calcTradeInfo = () => {
    if(position && contractInfo && indexPrice) {
      const currentPosition = direction === 'long' ? (+volume) + (+position.volume) : (-volume) + (+position.volume)
      const contractValue = currentPosition * indexPrice * contractInfo.multiplier;
      const dynamicBalance = ((+position.margin) + (+position.unrealizedPnl)).toFixed(2)
      const margin = (contractValue * contractInfo.minInitialMarginRatio).toFixed(2);
      const leverage = (+contractValue / +dynamicBalance).toFixed(1);
      const available = (+dynamicBalance) - (+margin)
      const converted = contractValue / indexPrice
      const overflow = (+available) < 0
      const tradeInfo = {
        volume,         //合约数量
        dynamicBalance, //动态余额
        margin,         //存入保证金
        marginHeld : position.marginHeld ,//冻结保证金 
        available,      //可用余额
        converted,      //换算的值
        leverage,        //杠杆
        overflow
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


  useEffect(() => {
    calcTradeInfo()
    if(indexPriceRef.current){
      setIndexPriceClass(indexPriceRef.current > indexPrice ? 'fall' : 'rise')
    }
    indexPriceRef.current = indexPrice;
    return () => {
    };
  }, [position.unrealizedPnl,position.volume,indexPrice,volume]);

  useEffect(() => {
    calcFundingRateAfter();
    calcLiquidityUsed();
    loadTransactionFee();
    return () => {      
    };
  }, [volume]);


  useEffect(() => {    
    if(contractInfo){
      const volume = (+margin) / ((+indexPrice) * (+contractInfo.multiplier) * (+contractInfo.minInitialMarginRatio)) - (+position.volume)
      if(!isNaN(volume)){
        const number =  parseInt(volume)
        if(number >= 0){
          setDirection('long')
        } else {
          setDirection('short')
        }
        const cloned = {...tradeInfo}
        cloned.volume = Math.abs(number);
        cloned.margin = margin;
        cloned.available = (+cloned.dynamicBalance) - margin
        setTradeInfo(cloned)
        setVolume(Math.abs(number));
      }
    }
    return () => {      
    };
  }, [margin]);


   
  return (
    <div className='trade-info'>
    <div className='trade-peration'>
      <div className='check-baseToken'>
        <div className='btn-group check-baseToken-btn'>
          <button
            type='button'
            onClick={onDropdown}
            className='btn chec'>
            {spec.symbol} / {spec.bTokenSymbol} (10X)
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
          <div className={selectClass} >
            <div className='dropdown-box'>
              {specs.map((config,index) => {
                return (
                  <div className='dropdown-item' key={index} onClick={() => onSelect(config)}>              
                    {config.symbol} / {config.bTokenSymbol} (10X)
                  </div>
                )
              })}
            </div>
            
          </div>
        </div>

        <div className='price-fundingRate'>
          <div className='index-prcie'>
            Index Price: <span className={indexPriceClass}>&nbsp; <NumberFormat value={indexPrice} displayType='text'/></span>
          </div>
          <div className='funding-rate'>
            <span>Funding Rate Annual: &nbsp;</span>
            <span className='funding-per' title={fundingRateTip}>{ fundingRate }</span> 
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
            <span className='position-text'>{ position.volume }</span>
          </div>
          <div className='contrant'>            
            <input
              type='number'
              onFocus={onFocus}
              onBlur={onBlur}
              disabled={!tradeInfo.available}
              onChange={event => setVolume(event.target.value)}
              value={tradeInfo.volume}
              className={volumeClazz}
              placeholder='Contract Volume'
            />
            <div className='title-volume' >
              Contract Volume
            </div>
          </div>          
          {!!volume && <div className='btc'><NumberFormat value={tradeInfo.converted} displayType='text' decimalScale={4} prefix ='= ' suffix={` ${spec.unit}`}/></div>}
        </div>
        <div className='right-info'>
          <div className='contrant-info'>
            <div className='balance-contract'>
              <span className='balance-contract-text'>
                Balance in Contract<br/>
                (Dynamic Balance)
              </span>
              <span className='balance-contract-num'>
                <NumberFormat value={ tradeInfo.dynamicBalance } displayType='text' decimalScale={2}/>
              </span>
            </div>
            <div className='box-margin'>
              <span> Margin </span>
              <span className='margin'>
                <NumberFormat value={ tradeInfo.margin } displayType='text' decimalScale={2}/>
              </span>
            </div>
            <div className='available-balance'>
              <span> Available Balance </span>
              <span className='available-balance-num'>
                <NumberFormat value={ tradeInfo.available } displayType='text' decimalScale={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='slider mt-13'>
        <Slider max={tradeInfo.dynamicBalance} onValueChange={onSlide} start={tradeInfo.margin}/>
      </div>
      <div className='title-margin'>Margin</div>
      <div className='enterInfo'>
        {!!volume && <>
        <div className='text-info'>
          <div className='title-enter pool'>Pool Liquidity</div>
          <div className='text-enter poolL'>
            <NumberFormat value={ poolLiquidity } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } displayType='text'/> 
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Liquidity Used</div>
          <div className='text-enter'>
            <NumberFormat value={liqUsedPair.curLiqUsed} displayType='text' suffix='%'/> -> <NumberFormat value={ liqUsedPair.afterLiqUsed } displayType='text' decimalScale={2}  suffix='%'/>
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Funding Rate Impact</div>
          <div className='text-enter'>
            { fundingRate } -> { fundingRateAfter }
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Transaction Fee</div>
          <div className='text-enter'>
            <NumberFormat value={ transFee } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } displayType='text'/>             
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
                position={position.volume}
       />
    </div>
  </div>
  )
}

function Operator({hasConnectWallet,wallet,spec,volume,available,
                  baseToken,leverage,indexPrice,position,direction,transFee,afterTrade}){
  const [isApprove, setIsApprove] = useState(true);
  const [noBalance, setNoBalance] = useState(false);
  const [emptyVolume, setEmptyVolume] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  
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


  const afterDeposit = async (amount) => {    
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

  
  const ConfirmDialog = withModal(TradeConfirm)
  const DepositDialog = withModal(DepositMargin)

  let actionElement =(<>
    <ConfirmDialog  wallet={wallet}
                    spec={spec}
                    modalIsOpen={modalIsOpen} 
                    onClose={onClose} 
                    leverage = {leverage} 
                    baseToken={baseToken} 
                    volume={volume} 
                    direction={direction} 
                    position={position} 
                    indexPrice={indexPrice} 
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