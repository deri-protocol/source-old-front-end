import { useState,useEffect,useRef } from 'react'
import classNames from "classnames";
import Slider from '../Slider/Slider';
import Button from '../Button/Button';
import {priceCache,PerpetualPoolParametersCache, isUnlocked,unlock,  getFundingRate,  getWalletBalance,  getSpecification, getEstimatedFee, getLiquidityUsed, hasWallet, getEstimatedLiquidityUsed, getEstimatedFundingRate} from '../../lib/web3js/indexV2'
import withModal from '../hoc/withModal';
import TradeConfirm from './Dialog/TradeConfirm';
import DepositMargin from './Dialog/DepositMargin'
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import { inject,  observer } from 'mobx-react';
import { BalanceList } from './Dialog/BalanceList';




function Trade({wallet = {},trading,version}){
  const [direction, setDirection] = useState('long');
  const [spec, setSpec] = useState({});
  const [dropdown, setDropdown] = useState(false);  
  const [fundingRateAfter, setFundingRateAfter] = useState('');
  const [transFee, setTransFee] = useState('');
  const [liqUsedPair, setLiqUsedPair] = useState({});
  const [indexPriceClass, setIndexPriceClass] = useState('rise');
  const indexPriceRef = useRef();  
  const directionClazz = classNames('checked-long','check-long-short',' long-short',{'checked-short' : direction === 'short'})
  const selectClass = classNames('dropdown-menu',{'show' : dropdown})
  const volumeClazz = classNames('contrant-input',{'inputFamliy' : trading.volume !== ''})


  //是否有 spec
  const hasSpec = () => spec && spec.pool

  //是否有链接钱包
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

  const directionChange = direction => {
    trading.setVolume('')
    trading.setUserSelectedDirection(direction)
    setDirection(direction)
  }

  const onDropdown = (event) => {
    if(trading.configs.length > 0){
      event.preventDefault();
      setDropdown(!dropdown)    
    }
  }

  //切换交易标的
  const onSelect = select => {
    const selected = trading.configs.find(config => config.pool === select.pool && select.symbolId === config.symbolId )
    if(selected){
      trading.pause();
      setSpec(selected)
      trading.switch(selected);
      setDropdown(false)    
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


  const makeLongOrShort = (volume) => {
    if(volume >= 0){
      setDirection('long')
    } else {
      setDirection('short')
    }    
  }


  //交易费用
  const loadTransactionFee = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const transFee = await getEstimatedFee(wallet.detail.chainId,spec.pool,Math.abs(trading.volumeDisplay),spec.symbolId);
      if(!isNaN(transFee)){
        setTransFee((+transFee).toFixed(2));
      }
    }
  }

  //计算流动性的变化
  const calcLiquidityUsed = async () => {
    if(hasConnectWallet() && hasSpec()) {
      const {detail} = wallet
      const curLiqUsed = await getLiquidityUsed(detail.chainId,spec.pool,spec.symbolId)
      const afterLiqUsed = await getEstimatedLiquidityUsed(detail.chainId,spec.pool,trading.volumeDisplay,spec.symbolId)
      if(curLiqUsed && afterLiqUsed){
        setLiqUsedPair({curLiqUsed : curLiqUsed.liquidityUsed0,afterLiqUsed : afterLiqUsed.liquidityUsed1})
      }
    }
  }

  //计算funding rate的变化
  const calcFundingRateAfter = async () => {
    if(hasConnectWallet() && hasSpec()){
      const fundingRateAfter = await getEstimatedFundingRate(wallet.detail.chainId,spec.pool,trading.volumeDisplay,spec.symbolId);
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

  const onKeyPress = evt => {
    if (evt.which < 48 || evt.which > 57){
        evt.preventDefault();
    }
  }

  const volumeChange = event => {
    trading.setMargin('')
    let {value} = event.target
    if(value === '0'){
      value = ''
    }
    trading.setVolume(value)
  }

  //完成交易
  const afterTrade = () => {
    trading.refresh()
    trading.setVolume('')
  }
  
  useEffect(() => {
    refreshCache();
    return () => {
    };
  }, [wallet.detail]);


  useEffect(() => {
    if(trading.position && trading.position.volume){
      makeLongOrShort((+trading.position.volume))
      trading.setUserSelectedDirection((+trading.position.volume) > 0 ? 'long' : 'short')
    }
    return () => {};
  }, [trading.position.volume]);

  useEffect(() => {
    calcFundingRateAfter();
    calcLiquidityUsed();
    loadTransactionFee();

    if(trading.volume !== '') {
      trading.pause();
    } else if(wallet.detail.account){
      trading.resume()
    }

    return () => {};
  }, [trading.volume]);


  useEffect(() => {
    if(indexPriceRef.current > trading.index) {
      setIndexPriceClass('fall')
    } else {
      setIndexPriceClass('rise')
    }
    indexPriceRef.current = trading.index
    return () => {
    };
  }, [trading.index]);

  useEffect(() => {
    if(trading.config){
      setSpec(trading.config)
    }
    return () => {};
  }, [trading.config]);


  useEffect(() => {
    if(wallet.detail.account){
      trading.init(wallet,version)
    }
  },[wallet.detail.account,version.current])


  useEffect(() => {
    if(trading.margin){
      trading.direction && setDirection(trading.direction)
    }
    return () => {    };
  }, [trading.margin]);


   
  return (
    <div className='trade-info'>
    <div className='trade-peration'>
      <div className='check-baseToken'>
        <div className='btn-group check-baseToken-btn'>
          <button
            type='button'            
            onClick={onDropdown}
            className='btn chec'>
            {(spec.symbol) || 'BTCUSD'} / {(spec.bTokenSymbol) || 'BUSD'} (10X)
            <span className='check-base-down'>
            <svg
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
            <span className='funding-per' title={trading.fundingRateTip}><DeriNumberFormat value={ trading.fundingRate.fundingRate0 } decimalScale={4} suffix='%'/></span> 
          </div>
        </div>
        <div className='price-fundingRate mobile'>
          <div className='index-prcie'>
            Index: <span className={indexPriceClass}>&nbsp; <DeriNumberFormat value={trading.index} decimalScale={2}/></span>
          </div>
          <div className='funding-rate'>
            <span>Funding: &nbsp;</span>
            <span className='funding-per' title={trading.fundingRateTip}><DeriNumberFormat value={trading.fundingRate.fundingRate0} decimalScale={4} suffix='%'/></span> 
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
              onKeyPress={onKeyPress}
              disabled={!trading.index || Math.abs(trading.position.margin) === 0}
              onChange={event =>  volumeChange(event) }
              value={trading.volumeDisplay}
              className={volumeClazz}
              placeholder='Contract Volume'
            />
            <div className='title-volume' >
              Contract Volume
            </div>
          </div>          
          {!!trading.volumeDisplay && <div className='btc'><DeriNumberFormat value={trading.amount.exchanged} allowNegative={false} decimalScale={4} prefix ='= ' suffix={` ${spec.unit}`}/></div>}
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
                <DeriNumberFormat value={ trading.amount.dynBalance } allowZero={true}  decimalScale={2}/>
              </span>
            </div>
            <div className='box-margin'>
              <span> Margin </span>
              <span className='margin'>
                <DeriNumberFormat value={ trading.amount.margin } allowZero={true}  decimalScale={2}/>
              </span>
            </div>
            <div className='available-balance'>
              <span className='available-balance pc'> Available Balance </span>
              <span className='available-balance mobile'>Avail Bal</span>
              <span className='available-balance-num'>
                <DeriNumberFormat value={ trading.amount.available } allowZero={true}  decimalScale={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className='slider mt-13'>
        <Slider max={trading.amount.dynBalance} onValueChange={onSlide} start={trading.amount.margin} freeze={!trading.index}/>
      </div>
      <div className='title-margin'>Margin</div>
      <div className='enterInfo'>
        {!!trading.volumeDisplay && <>
        <div className='text-info'>
          <div className='title-enter pool'>Pool Liquidity</div>
          <div className='text-enter poolL'>
            <DeriNumberFormat value={ trading.fundingRate.liquidity } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } /> 
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
            <DeriNumberFormat value={ trading.fundingRate.fundingRate0 }  suffix='%' allowNegative={false} decimalScale={4}/> -> <DeriNumberFormat value={ fundingRateAfter }  allowNegative={false} decimalScale={4} suffix='%' />
          </div>
        </div>
        <div className='text-info'>
          <div className='title-enter'>Transaction Fee</div>
          <div className='text-enter'>
            <DeriNumberFormat value={ transFee } allowZero={true} decimalScale={2} suffix={` ${spec.bTokenSymbol}` } />             
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
                symbolId={trading.config && trading.config.symbolId}
                version={version}
       />
    </div>
  </div>
  )
}


const ConfirmDialog = withModal(TradeConfirm)
const DepositDialog = withModal(DepositMargin)
const BalanceListDialog = withModal(BalanceList)

function Operator({hasConnectWallet,wallet,spec,volume,available,
                  baseToken,leverage,indexPrice,position,transFee,afterTrade,direction,trading,symbolId,version}){
  const [isApprove, setIsApprove] = useState(true);
  const [noBalance, setNoBalance] = useState(false);
  const [emptyVolume, setEmptyVolume] = useState(true);
  const [confirmIsOpen, setConfirmIsOpen] = useState(false);
  const [depositIsOpen, setDeposiIsOpen] = useState(false);
  const [balance, setBalance] = useState('');

  
  const connect = () => {
    wallet.connect()
  }

  const approve = async () => {
    const {detail} = wallet
    const res = await unlock(detail.chainId,spec.pool,detail.account);
    if(res.success){
      setIsApprove(true);
      trading.refresh();
    } else {
      setIsApprove(false)
      alert('Approve faild')
    }
  }


  const afterDeposit = async () => {    
    setDeposiIsOpen(false);
    afterTrade()
  }

  const afterDepositAndWithdraw = () => {
    setDeposiIsOpen(false);
    afterTrade()
  }


  //load Approve status
  const loadApprove = async () => {
    if(hasConnectWallet() && spec){
      const {detail} = wallet
      const result = await isUnlocked(detail.chainId,spec.pool,detail.account,symbolId).catch(e => console.log(e))
      setIsApprove(result);
    }
  }

  const loadBalance = async () => {
    if(wallet.isConnected() && spec){
      const balance = await getWalletBalance(wallet.detail.chainId,spec.pool,wallet.detail.account)
      if(balance){
        setBalance(balance)
      }
    }
  }

  useEffect(() => {
    if(hasConnectWallet() && spec){
      loadBalance();
    }
    return () => {};
  }, [wallet.detail.account,spec,available]);

  useEffect(() => {
    if(!depositIsOpen && !confirmIsOpen){
      if((+available) > 0){
        setNoBalance(false)
      } else {
        setNoBalance(true)
      }
    }
    return () => {
    };
  }, [available]);

  useEffect(() => {
    setEmptyVolume(!volume)
    return () => {};
  }, [volume]);


  useEffect(() => {
    if(spec){
      loadApprove();
    }
    return () => {};
  }, [spec]);


  let actionElement =(<>
    <ConfirmDialog  wallet={wallet}
                    className='trading-dialog'
                    spec={spec}
                    modalIsOpen={confirmIsOpen} 
                    onClose={() => setConfirmIsOpen(false)} 
                    leverage = {leverage} 
                    baseToken={baseToken} 
                    volume={volume} 
                    position={position.volume} 
                    indexPrice={indexPrice} 
                    transFee={transFee}
                    afterTrade={afterTrade}
                    direction={direction}
                    />
    <button className='short-submit' onClick={() => setConfirmIsOpen(true)}>TRADE</button>
  </>)

  if(hasConnectWallet()){
    if(!isApprove) {
      actionElement = <Button className='approve' btnText='APPROVE' click={approve}/>
    } else if(noBalance && available !== undefined) {
      actionElement = (<>
      {version.isV2 
      ?
       <BalanceListDialog
        wallet={wallet}
        modalIsOpen={depositIsOpen}
        onClose={() => setDeposiIsOpen(false)}
        spec={trading.config}
        afterDepositAndWithdraw={afterDepositAndWithdraw}
        position={trading.position}
        overlay={{background : '#1b1c22',top : 80}}
        className='balance-list-dialog'
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
      />}
        <div className="noMargin-text">You have no fund in contract. Please deposit first.</div>
        <button className='short-submit'  onClick={() => setDeposiIsOpen(true)}>DEPOSIT</button>
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

export default inject('wallet','trading','version')(observer(Trade))
// export default Trade