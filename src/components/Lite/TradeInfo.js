import { useState,useEffect,useContext } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';
import {WalletContext} from '../../context/WalletContext'
import Button from '../Button/Button';
import {priceCache,PerpetualPoolParametersCache, isUnlocked, DeriEnv, deriToNatural, getFundingRate, getUserWalletBalance, getWalletBalance, getPositionInfo, getSpecification, getEstimatedFee, getLiquidityUsed, hasWallet, getEstimatedLiquidityUsed, getEstimatedFundingRate, tradeWithMargin, depositMargin} from '../../lib/web3js/index'
import config from '../../config.json'
import axios from 'axios'
import NumberFormat from 'react-number-format';
import withModal from '../hoc/withModal';
import TradeConfirm from './Dialog/TradeConfirm';
import DepositMargin from './Dialog/DepositMargin'

const oracleConfig = config[DeriEnv.get()]['oracle']


export default function TradeInfo({wallet = {},symbols = [],onSpecChange}){
  const [direction, setDirection] = useState('long');
  const [contractInfo, setContractInfo] = useState({});
  const [dropdown, setDropdown] = useState(false);
  const [curSpec, setCurSpec] = useState({});
  const [balanceContract, setBalanceContract] = useState('0.00');
  const [availableBalance, setAvailableBalance] = useState('0.00');  
  const [margin, setMargin] = useState('0.00');
  const [marginTxt, setMarginTxt] = useState('');
  const [position, setPosition] = useState('0');
  const [fundingRate, setFundingRate] = useState('0.00');
  const [fundingRateTip, setFundingRateTip] = useState('');
  const [fundingRateAfter, setFundingRateAfter] = useState('');
  const [indexPrice, setIndexPrice] = useState('0.00');
  const [transFee, setTransFee] = useState('');
  const [leverage, setLeverage] = useState('');
  const [poolLiquidity, setPoolLiquidity] = useState('');
  const [liqUsedPair, setLiqUsedPair] = useState({});
  const [convertValue, setConvertValue] = useState('');
  //控制状态
  const [contractVolume, setContractVolume] = useState('');  

  const directionClazz = classNames('checked-long','check-long-short',' long-short',{' checked-short' : direction === 'short'})
  const selectClass = classNames('dropdown-menu',{'show' : dropdown})

  //是否有 spec
  const hasSpec = () => curSpec && curSpec.pool

  //是否有链接钱包
  const hasConnectWallet = () => wallet && wallet.account

  const directionChange = direction => {
    setDirection(direction)
    setContractVolume('')
  }

  const onDropdown = (event) => {
    if(symbols.length > 0){
      event.stopPropagation();
      setDropdown(!dropdown)    
    }
  }

  //切换交易标的
  const onSelect = select => {
    const selected = symbols.find(config => config.symbol == select.symbol )
    setCurSpec(selected);
  }

  const onSlide = value => {
    value = (+value) - (+(+margin).toFixed(0))
    if(value < 0){
      setDirection('short')
      value = Math.abs(value)
    } else {
      setDirection('long')
    }
    onContractVolumeChange(value)
  }


  //sync price
  const syncPrice = () => {
    if(hasConnectWallet() && hasSpec()){
      const {chainId,account} = wallet;
      const address = curSpec.pool
      priceCache.clear();
      priceCache.update(chainId,address);
      PerpetualPoolParametersCache.update(chainId,address,account);
    }
  }


  //价格指数
  const loadIndexPrice = async () => {
    if(curSpec && curSpec.symbol){
      const url = oracleConfig[curSpec.symbol.toUpperCase()]
      const res = await axios.get(url,{params:{symbol:curSpec.symbol}});
      if(res && res.data){
        setIndexPrice((+ deriToNatural(res.data.price)));
      }
    }
  }

  //资金费率
  const loadFundingRate = async () => {
    if(hasConnectWallet() && hasSpec()){    
      const res = await getFundingRate(wallet.chainId,curSpec.pool)
      if(res){
        setFundingRate(res.fundingRate0)
        const tip = `Funding  Rate (per block) = ${res.fundingRatePerBlock}` +
        `\n(1 Long contract pays 1 short contract ${res.fundingRatePerBlock} ${curSpec.bTokenSymbol} per block)`
        setFundingRateTip(tip);
        setPoolLiquidity(res.liquidity)
      }
    }
  }


  //当前仓位
  const loadPosition = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const position = await getPositionInfo(wallet.chainId,curSpec.pool,wallet.account);
      if(position){
        setPosition(position);
        setMargin((+position.marginHeld))
        const balanceContract = ((+position.margin) + (+position.unrealizedPnl))
        setBalanceContract(balanceContract.toFixed(2))
        setAvailableBalance(balanceContract - (+position.marginHeld))
      }
    }
  }

  //价值合同信息
  const loadContractInfo = async () => {
    if(hasConnectWallet() && hasSpec()){
      const contractInfo = await getSpecification(wallet.chainId,curSpec.pool,wallet.account);      
      setContractInfo(contractInfo)      
    }
  }

  //交易费用
  const loadTransactionFee = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const transFee = await getEstimatedFee(wallet.chainId,curSpec.pool,contractVolume);
      setTransFee(transFee);
    }
  }

  //计算流动性的变化
  const calcLiquidityUsed = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const curLiqUsed = await getLiquidityUsed(wallet.chainId,curSpec.pool)
      const afterLiqUsed = await getEstimatedLiquidityUsed(wallet.chainId,curSpec.pool,contractVolume)
      if(curLiqUsed && afterLiqUsed){
        setLiqUsedPair({curLiqUsed : curLiqUsed.liquidityUsed0,afterLiqUsed : afterLiqUsed.liquidityUsed1})
      }
    }
  }

  //计算funding rate的变化
  const calcFundingRateAfter = async () => {
    if(hasConnectWallet() && hasSpec()){
      const fundingRateAfter = await getEstimatedFundingRate(wallet.chainId,curSpec.pool,contractVolume);
      if(fundingRateAfter){
        setFundingRateAfter(fundingRateAfter.fundingRate1);
      }
    }
  }

  //计算可用余额
  const calcAaviableBalance = () => {

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
    setContractVolume('')
    loadPosition();
  }

  //输入合同个数
  const onContractVolumeChange = value => {    
    const currentPosition = (+value) + (+position.volume)
    const contractValue = currentPosition * indexPrice * contractInfo.multiplier;
    const leverage = (+contractValue / +balanceContract).toFixed(1);
    const margin = (contractValue * contractInfo.minInitialMarginRatio).toFixed(2);
    const availableBalance = (+balanceContract) - (+margin)
    const convertValue = contractValue / indexPrice
    setContractVolume(value)
    setLeverage(leverage)
    setMargin(margin)
    setAvailableBalance(availableBalance)
    calcLiquidityUsed();
    calcFundingRateAfter();
    setConvertValue(convertValue)
  }

  useEffect(() => {
    const bodyClickListener = document.body.addEventListener('click',() => setDropdown(false),false)
    return () => {
      document.body.removeEventListener('click',bodyClickListener)
    }
  }, []);

  useEffect(() => {
    if(symbols.length > 0){
      setCurSpec(symbols[0]);      
    }
    return () => {

    };
  }, [symbols]);

  //spec --> index --> funding rate --> balance -->  contract info
  useEffect(() => {
    onSpecChange && onSpecChange(curSpec); //contract info changed
    syncPrice();
    loadIndexPrice(); // index price changed
    loadFundingRate(); // funding rate changed
    loadPosition() // balance in contract changed
    loadContractInfo();
    calcAaviableBalance();
    return () => {

    };
  }, [curSpec]);


  //balance --> available balance 
  useEffect(() => {

    calcAaviableBalance(balanceContract) // available balance changed

    return () => {      
    };
  }, [balanceContract]);


  useEffect(() => {
    loadTransactionFee();
    return () => {      
    };
  }, [contractVolume]);


  //first mount
  useEffect(() => {
    loadIndexPrice();
    loadFundingRate();
    loadPosition();
    loadContractInfo();
    calcAaviableBalance();
    return () => {      
    };
  }, []);
    
  return (
    <div className='trade-info' v-show='tradeShow'>
    <div className='trade-peration'>
      <div className='check-baseToken'>
        <div className='btn-group check-baseToken-btn'>
          <button
            type='button'
            onClick={onDropdown}
            className='btn chec'>
            {curSpec.symbol} / {curSpec.bTokenSymbol} (10X)
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
              {symbols.map((config,index) => {
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
            Index Price: <span className='this.rose-fall'>&nbsp; <NumberFormat value={indexPrice } displayType='text'/></span>
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
              onChange={event => onContractVolumeChange(event.target.value)}
              value={contractVolume}
              className='contrant-input'
              placeholder='Contract Volume'
            />
            <div className='title-volume' >
              Contract Volume
            </div>
          </div>          
          {contractVolume && <div className='btc'><NumberFormat value={convertValue} displayType='text' decimalScale={4} prefix ='= ' suffix={` ${curSpec.unit}`}/></div>}
        </div>
        <div className='right-info'>
          <div className='contrant-info'>
            <div className='balance-contract'>
              <span className='balance-contract-text'>
                Balance in Contract<br/>
                (Dynamic Balance)
              </span>
              <span className='balance-contract-num'>
                { balanceContract }
              </span>
            </div>
            <div className='box-margin'>
              <span> Margin </span>
              <span className='margin'>
                { margin }
              </span>
            </div>
            <div className='available-balance'>
              <span> Available Balance </span>
              <span className='available-balance-num'>
                <NumberFormat value={ availableBalance } displayType='text' decimalScale={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='slider mt-13'>
        <Slider max={balanceContract} onValueChange={onSlide} defaultValue={margin} availableBalance={availableBalance}/>
      </div>
      <div className='title-margin'>Margin</div>
      {contractVolume && <div className='enterInfo'>
        <div className='text-info'>
          <div className='title-enter pool'>Pool Liquidity</div>
          <div className='text-enter poolL'>
            <NumberFormat value={ poolLiquidity } decimalScale={2} suffix={` ${curSpec.bTokenSymbol}` } displayType='text'/> 
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
            <NumberFormat value={ transFee } decimalScale={2} suffix={` ${curSpec.bTokenSymbol}` } displayType='text'/>             
          </div>
        </div>
      </div>}
      {margin && <div className='noMargin-text'>
        { marginTxt }
      </div>}
      <Operator hasConnectWallet={hasConnectWallet} transFee={transFee} 
                wallet={wallet} spec={curSpec} 
                indexPrice={indexPrice} availableBalance={availableBalance}
                contractVolume={contractVolume} direction={direction}
                leverage={leverage}
                afterTrade={afterTrade}
       />
    </div>
  </div>
  )
}

function Operator({hasConnectWallet,wallet,spec,contractVolume,availableBalance,
                  baseToken,leverage,indexPrice,position,direction,transFee,afterTrade}){
  const [isApprove, setIsApprove] = useState(true);
  const [noBalance, setNoBalance] = useState(false);
  const [emptyVolume, setEmptyVolume] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const context = useContext(WalletContext)

  
  const connect = () => {
    context.wallet.connect()
  }

  const unlock = () => {
    
  }

  const trade = async () => {
    const res = await tradeWithMargin(wallet.chainId,spec.pool,wallet.account,contractVolume)
    if(res.success){
      onClose()
      afterTrade()
    }
  }

  const afterDeposit = async (amount) => {    
    onClose();
    afterTrade()
  }


  //load Approve status

  const loadApprove = async () => {
    if(hasConnectWallet() && spec.pool){
      const result = await isUnlocked(wallet.chainId,spec.pool,wallet.account)
      setIsApprove(result);
    }
  }

  useEffect(() => {
    if((+availableBalance) > 0){
      setNoBalance(false)
    } else {
      setNoBalance(true)
    }
    return () => {
    };
  }, [availableBalance]);

  useEffect(() => {
    setEmptyVolume(!contractVolume)
    return () => {};
  }, [contractVolume]);


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
    <ConfirmDialog  trade={trade}
                    modalIsOpen={modalIsOpen} 
                    onClose={onClose} 
                    leverage = {leverage} 
                    baseToken={baseToken} 
                    contractVolume={contractVolume} 
                    direction={direction} 
                    position={position} 
                    indexPrice={indexPrice} 
                    transFee={transFee} 
                    spec={spec}/>
    <button className='short-submit' onClick={() => setModalIsOpen(true)}>TRADE</button>
  </>)

  if(hasConnectWallet()){
    if(!isApprove) {
      actionElement = <Button className='approve' btnText='APPROVE' onClick={unlock}/>
    } else if(noBalance) {
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
      actionElement = <Button className='btn btn-danger short-submit' disabled btnText='ENTER VOLUME' onClick={unlock}/>
    }
  } else {
    actionElement = <Button className='btn btn-danger connect' btnText='Connect Wallet' onClick={connect}/>
  }

  // const withdrawDialog = withModal(<withdrawDialog/>)
  return (
    <div className='submit-btn'>
      {actionElement}        
    </div>
  )
}