import { useState,useEffect,useContext } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';
import {WalletContext} from '../../context/WalletContext'
import Button from '../Button/Button';
import {isUnlocked, DeriEnv, deriToNatural, getFundingRate, getUserWalletBalance, getWalletBalance, getPositionInfo, getSpecification} from '../../lib/web3js/index'
import config from '../../config.json'
import axios from 'axios'
import NumberFormat from 'react-number-format';
import useSpecification from '../../hooks/useSpecification';

const oracleConfig = config[DeriEnv.get()]['oracle']


export default function TradeInfo({wallet = {},symbols,onSpecChange}){
  const [direction, setDirection] = useState('long');
  const [contractInfo, setContractInfo] = useState({});
  const [dropdown, setDropdown] = useState(false);
  const [curSpec, setCurSpec] = useState({});
  const [balanceContract, setBalanceContract] = useState('0.00');
  const [availableBalance, setAvailableBalance] = useState('0.00');
  const [totalLiquidity, setTotalLiquidity] = useState('');
  const [baseToken, setBaseToken] = useState('');
  const [margin, setMargin] = useState('0.00');
  const [marginTxt, setMarginTxt] = useState('');
  const [position, setPosition] = useState('0');
  const [fundingRate, setFundingRate] = useState('0.00');
  const [fundingRateTip, setFundingRateTip] = useState('');
  const [fundingRateAfter, setFundingRateAfter] = useState('');
  const [liqUsed, setLiqUsed] = useState('');
  const [liqUsedAfter, setLiqUsedAfter] = useState('');
  const [indexPrice, setIndexPrice] = useState('0.00%');
  const [mfee, setMfee] = useState('');
  

  //控制状态
  const [contractVolume, setContractVolume] = useState('');

  const directionClazz = classNames('checked-long','check-long-short',' long-short',{' checked-short' : direction === 'short'})

  const onDropdown = (event) => {
    event.stopPropagation();
    setDropdown(!dropdown)    
  }

  //切换交易标的
  const onSelect = select => {
    const selected = symbols.find(config => config.symbol == select.symbol )
    setCurSpec(selected);
  }

  const hasSpec = () => curSpec && curSpec.pool

  const hasConnectWallet = () => wallet && wallet.account

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

  //自己费率
  const loadFundingRate = async () => {
    if(hasConnectWallet() && hasSpec()){    
      const res = await getFundingRate(wallet.chainId,curSpec.pool)
      if(res){
        setFundingRate(res.fundingRate0)
        const tip = `Funding  Rate (per block) = ${res.fundingRatePerBlock}` +
        `\n(1 Long contract pays 1 short contract ${res.fundingRatePerBlock} ${baseToken} per block)`
        setFundingRateTip(tip);
      }
    }
  }

  //合同余额
  const loadBalanceInContract = async () => {
    // if(hasConnectWallet() && hasSpec()){
    //   const balance = await getWalletBalance(wallet.chainId,curSpec.pool,wallet.account)
    //   setBalanceContract((+balance).toFixed(2))
    // }
  }


  //当前仓位
  const loadPosition = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const position = await getPositionInfo(wallet.chainId,curSpec.pool,wallet.account);
      if(position){
        setPosition(position);
        setMargin((+position.marginHeld))
        setBalanceContract(((+position.margin) + (+position.unrealizedPnl)).toFixed(2))
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

  //输入合同个数
  const onContractVolumeChange = event => {
    const {value} = event.target
    setContractVolume(value)
    const currentPosition = (+value) + (+position.volume)
    const contractValue = currentPosition * indexPrice * contractInfo.multiplier;
    // const leverages = (contractValue / balanceContract).toFixed(1);
    const margin = (contractValue * contractInfo.minInitialMarginRatio).toFixed(2);
    setMargin(margin)    
  }

  const selectClass = classNames('dropdown-menu',{'show' : dropdown})

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
    loadIndexPrice(); // index price changed
    loadFundingRate(); // funding rate changed
    loadPosition() // balance in contract changed
    loadContractInfo();
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
    loadIndexPrice();
    loadFundingRate();
    loadBalanceInContract();
    loadPosition();
    loadContractInfo();
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
        <div className='check-long' onClick={() => setDirection('long')}>LONG / BUY</div>
        <div className='check-short' onClick={() => setDirection('short')}>SHORT / SELL</div>
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
              onChange={onContractVolumeChange}
              className='contrant-input'
              placeholder='Contract Volume'
            />
            <div className='title-volume' >
              Contract Volume
            </div>
          </div>
          {/* <div className='btc'>= { btc } {btc-coin}</div> */}
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
                { availableBalance }
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='slider mt-13'>
        <Slider max={balanceContract} defaultValue={margin}/>
      </div>
      <div className='title-margin'>Margin</div>
      {contractVolume && <div className='enterInfo'>
        <div className='text-info'>
          <div className='title-enter pool'>Pool Liquidity</div>
          <div className='text-enter poolL'>
            { totalLiquidity } { baseToken }
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Liquidity Used</div>
          <div className='text-enter'>
            { liqUsed } -> { liqUsedAfter }
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
            { mfee } { baseToken }
          </div>
        </div>
      </div>}
      {margin && <div className='noMargin-text'>
        { marginTxt }
      </div>}
      <Operator hasConnectWallet={hasConnectWallet} wallet={wallet} spec={curSpec}/>
    </div>
  </div>
  )
}

function Operator({hasConnectWallet, wallet,spec,contractVolume,balanceContract}){
  const [isApprove, setIsApprove] = useState(false);
  const [noBalance, setNoBalance] = useState(false);
  const [emptyVolume, setEmptyVolume] = useState(true);
  const context = useContext(WalletContext)

  

  const connect = () => {
    context.wallet.connect()
  }

  const unlock = () => {
    
  }

  const trade = () => {

  }

  const deposit = () => {

  }

  useEffect(() => {
    setNoBalance(!balanceContract)
    return () => {
    };
  }, [balanceContract]);

  useEffect(() => {
    setEmptyVolume(!!contractVolume)
    return () => {};
  }, [contractVolume]);


  useEffect(() => {
    const isApproved = async () => {
      if(spec.pool){
        const result = await isUnlocked(wallet.chainId,spec.pool,wallet.account)
        setIsApprove(result);
      }
    }
    hasConnectWallet() && isApproved();
    return () => {      
    };
  }, [spec]);



  let actionElement = <Button className='short-submit' btnText='TRADE' onClick={trade}/>
  if(hasConnectWallet()){
    if(!isApprove) {
      actionElement = <Button className='approve' btnText='APPROVE' onClick={unlock}/>
    } else if(noBalance) {
      actionElement = <Button className='short-submit' btnText='DEPOSIT' onClick={deposit}/>
    } else if(emptyVolume) {
      actionElement = <Button className='btn btn-danger short-submit' disabled btnText='ENTER VOLUME' onClick={unlock}/>
    }
  } else {
    actionElement = <Button className='btn btn-danger connect' btnText='Connect Wallet' onClick={connect}/>
  }

  return (
    <div className='submit-btn'>
      {actionElement}        
    </div>
  )
}