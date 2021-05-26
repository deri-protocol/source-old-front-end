import React, { useState ,useEffect} from 'react'
import { closePosition, getWalletBalance, getPoolBTokensBySymbolId } from "../../lib/web3js/indexV2";
import className from 'classnames'
import withModal from '../hoc/withModal';
import DepositMargin from './Dialog/DepositMargin';
import WithdrawMagin from './Dialog/WithdrawMargin';
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import { eqInNumber } from '../../utils/utils';
import { inject, observer } from 'mobx-react';
import { BalanceList } from './Dialog/BalanceList';
import addMarginIcon  from '../../assets/img/add-margin.svg'
import removeMarginIcon from '../../assets/img/remove-margin.svg'
import marginDetailIcon from '../../assets/img/margin-detail.png'



const DepositDialog = withModal(DepositMargin);
const WithDrawDialog = withModal(WithdrawMagin)
const BalanceListDialog = withModal(BalanceList)

function Position({wallet,trading,version}){
  const [isLiquidation, setIsLiquidation] = useState(false);
  const [direction, setDirection] = useState('');
  const [balanceContract, setBalanceContract] = useState('');
  const [balanceListModalIsOpen, setBalanceListModalIsOpen] = useState(false)
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');

  const loadBalance = async () => {
    if(wallet.isConnected() && trading.config){
      const balance = await getWalletBalance(wallet.detail.chainId,trading.config.pool,wallet.detail.account,trading.config.bTokenId)
      if(balance){
        setBalance(balance)
      }
    }
  }

  //平仓
  const onClosePosition = async () => {
    setIsLiquidation(true)
    const res = await closePosition(wallet.detail.chainId,trading.config.pool,wallet.detail.account,trading.config.symbolId).finally(() => setIsLiquidation(false))
    if(res.success){
      refreshBalance()
    } else {      
      if(typeof res.error === 'string') {
        alert(res.error || 'Liquidation failed')
      } else if(typeof res.error === 'object'){
        alert(res.error.errorMessage || 'Liquidation failed')
      } else {
        alert('Close position failed')
      }      
    }
  }

  const refreshBalance = () => {
    trading.refresh();
    loadBalance();
  }

  const afterDeposit = () => {
    setAddModalIsOpen(false)
    refreshBalance()
  }

  const afterDepositAndWithdraw = () => {
  }

  const onCloseBalanceList = () => {
    setBalanceListModalIsOpen(false)
  }

  const onCloseDeposit = () => {
    setAddModalIsOpen(false)
  }

  const afterWithdraw = () => {
    setRemoveModalIsOpen(false)
    refreshBalance(); 
  }

  const onCloseWithdraw = () => {
    setRemoveModalIsOpen(false)
  }

  const directionClass = className('Direction','info-num',{
    'LONG' : direction === 'LONG',
    'SHORT' : direction === 'SHORT'
  })




  useEffect(() => {
    loadBalance();
    return () => {
    };
  }, [wallet.detail.account,trading.config]);


  useEffect(() => {
    if(trading.position){
      const {position} = trading
      const direction = (+position.volume) > 0 ? 'LONG' : (eqInNumber(position.volume, 0) ? '--' : 'SHORT') 
      setDirection(direction)      
      setBalanceContract((+position.margin) + (+position.unrealizedPnl))
    }
    return () => {};
  }, [trading.position.volume,trading.position.margin,trading.position.unrealizedPnl]);

   
  
  return(
    <div className='position-info'>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Position</div>
        <div className='info-num'>{ trading.position.volume}</div>
      </div>
      <div className='info-right'>
        <div
          className='close-position'
          id='close-p'
          onClick={onClosePosition}
        >
          <span
            className='spinner spinner-border spinner-border-10px'
            role='status'
            aria-hidden='true'
            style={{display: isLiquidation ? 'block' : 'none'}}
          ></span>
          <svg t='1618369709897' className='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='2009' width='14' height='14'><path d='M510.8096 420.3008l335.296-335.296 90.5088 90.5088-335.296 335.296 335.296 335.296-90.5088 90.5088-335.296-335.296-335.296 335.296-90.5088-90.5088 335.296-335.296-335.296-335.296 90.5088-90.5088z' p-id='2010' fill='#ffffff'></path></svg> Close
        </div>
      </div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Average Entry Price</div>
        <div className='info-num'><DeriNumberFormat value={ trading.position.averageEntryPrice } decimalScale={2} /></div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text balance-con'>
          Balance in Contract
          (Dynamic Balance)
        </div>
        <div className='info-num'> 
          <DeriNumberFormat decimalScale = {2} allowZero={true} value={ balanceContract}  />
        </div>
      </div>
      <div className='info-right'>
      {version.isV1 ? <>
        <div
          className='add-margin'
          id='openAddMargin'
          onClick={() => setAddModalIsOpen(true)}
        > 
          <img src={removeMarginIcon} alt='add margin'/> Add
        </div>
        <div className='remove-margin'
          onClick={() => setRemoveModalIsOpen(true)}>
          <img src={addMarginIcon} alt='add margin'/> Remove
        </div>
      </> : (<div onClick={() => setBalanceListModalIsOpen(true)}><img src={marginDetailIcon} alt='Remove margin'/> Detail</div>)}
        
      </div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Direction</div>
        <div className={directionClass} >{direction}</div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Margin</div>
        <div className='info-num'><DeriNumberFormat value={ trading.position.marginHeld }  decimalScale={2}/></div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Unrealized PnL</div>
        <div className='info-num'><DeriNumberFormat value={ trading.position.unrealizedPnl }  decimalScale={8}/></div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Liquidation Price</div>
        <div className='info-num'><DeriNumberFormat decimalScale = {2} value={trading.position.liquidationPrice} /></div>
      </div>
      <div className='info-right'></div>
    </div>
    <DepositDialog
       wallet={wallet}
       modalIsOpen={addModalIsOpen} 
       onClose={onCloseDeposit}
       spec={trading.config}
       afterDeposit={afterDeposit}
       balance={balance}
       className='trading-dialog'
    />
    <WithDrawDialog
      wallet={wallet}
      modalIsOpen={removeModalIsOpen} 
      onClose={onCloseWithdraw}
      spec={trading.config}
      afterWithdraw={afterWithdraw}
      position={trading.position}
      className='trading-dialog'
      />
    <BalanceListDialog
      wallet={wallet}
      modalIsOpen={balanceListModalIsOpen}
      onClose={onCloseBalanceList}
      spec={trading.config}
      afterDepositAndWithdraw={afterDepositAndWithdraw}
      position={trading.position}
      overlay={{background : '#1b1c22',top : 80}}
      className='balance-list-dialog'
    />
  </div>
  )
}
export default inject('wallet','trading','version')(observer(Position))