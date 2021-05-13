import React, { useState ,useEffect} from 'react'
import { closePosition, getWalletBalance } from "../../lib/web3js";
import className from 'classnames'
import withModal from '../hoc/withModal';
import DepositMargin from './Dialog/DepositMargin';
import WithdrawMagin from './Dialog/WithdrawMargin';
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import { eqInNumber } from '../../utils/utils';



const DepositDialog = withModal(DepositMargin);
const WithDrawDialog = withModal(WithdrawMagin)

export default function Position({wallet,spec = {},position}){
  const [isLiquidation, setIsLiquidation] = useState(false);
  const [direction, setDirection] = useState('');
  const [balanceContract, setBalanceContract] = useState('');
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');

  async function loadPositionInfo() { 
    if(wallet.isConnected() && spec.pool){
      position.load(wallet,spec)      
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

  //平仓
  const onClosePosition = async () => {
    setIsLiquidation(true)
    const res = await closePosition(wallet.detail.chainId,spec.pool,wallet.detail.account).finally(() => setIsLiquidation(false))
    if(res.success){
      loadPositionInfo();
    } else {      
      if(typeof res.error === 'string') {
        alert(res.error || 'Liquidation failed')
      } else if(typeof res.error === 'object'){
        alert(res.error.errorMessage || 'Liquidation failed')
      }
      
    }
  }

  const afterDeposit = () => {
    setAddModalIsOpen(false)
    loadPositionInfo();
  }

  const onCloseDeposit = () => {
    setAddModalIsOpen(false)
  }

  const afterWithdraw = () => {
    setRemoveModalIsOpen(false)
    loadPositionInfo();
  }

  const onCloseWithdraw = () => {
    setRemoveModalIsOpen(false)
  }

  const directionClass = className('Direction','info-num',{
    'LONG' : direction === 'LONG',
    'SHORT' : direction === 'SHORT'
  })



  useEffect(() => {
    loadPositionInfo();
    loadBalance();
    return () => {
    };
  }, [wallet.detail.account,spec.pool]);


  useEffect(() => {
    if(position.info){
      const {info} = position
      const direction = (+info.volume) > 0 ? 'LONG' : (eqInNumber(info.volume, 0) ? '--' : 'SHORT') 
      setDirection(direction)      
      setBalanceContract((+info.margin) + (+info.unrealizedPnl))
    }
    return () => {};
  }, [position.info.volume,position.info.margin,position.info.unrealizedPnl]);

   
  
  return(

    <div className='position-info'>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Position</div>
        <div className='info-num'>{ position.info.volume}</div>
      </div>
      <div className='info-right'>
        <div
          className='close-position'
          id='close-p'
          onClick={onClosePosition}
        >
          <span
            className='spinner spinner-border spinner-border-sm'
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
        <div className='info-num'><DeriNumberFormat value={ position.info.averageEntryPrice } decimalScale={2} /></div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text balance-con'>
          Balance in Contract
          (Dynamic Balance)
        </div>
        <div className='info-num'> <DeriNumberFormat decimalScale = {2} value={ balanceContract}  /></div>
      </div>
      <div className='info-right'>
        <div
          className='add-margin'
          id='openAddMargin'
          onClick={() => setAddModalIsOpen(true)}
        >
          <svg
            className='svg'
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 18 18'
          >
            <path
              id='login'
              d='M13,9,7,4V7H0v4H7v3Zm3,7H8v2h8a2.006,2.006,0,0,0,2-2V2a2.006,2.006,0,0,0-2-2H8V2h8Z'
              transform='translate(18) rotate(90)'
              fill='#3ebf38'
            />
          </svg>
          Add
        </div>
        <div
          className='remove-margin'
          onClick={() => setRemoveModalIsOpen(true)}
        >
          <svg
            className='svg'
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='18'
            viewBox='0 0 18 18'
          >
            <path
              id='log-out'
              data-name='log out'
              d='M18,9,12,4V7H5v4h7v3ZM2,2h8V0H2A2.006,2.006,0,0,0,0,2V16a2.006,2.006,0,0,0,2,2h8V16H2Z'
              transform='translate(0 18) rotate(-90)'
              fill='#e35061'
            />
          </svg>
          Remove
        </div>
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
        <div className='info-num'><DeriNumberFormat value={ position.info.marginHeld }  decimalScale={2}/></div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Unrealized PnL</div>
        <div className='info-num'><DeriNumberFormat value={ position.info.unrealizedPnl }  decimalScale={8}/></div>
      </div>
      <div className='info-right'></div>
    </div>
    <div className='info'>
      <div className='info-left'>
        <div className='title-text'>Liquidation Price</div>
        <div className='info-num'><DeriNumberFormat decimalScale = {2} value={position.info.liquidationPrice} /></div>
      </div>
      <div className='info-right'></div>
    </div>
    <DepositDialog
       wallet={wallet}
       modalIsOpen={addModalIsOpen} 
       onClose={onCloseDeposit}
       spec={spec}
       afterDeposit={afterDeposit}
       balance={balance}
    />
    <WithDrawDialog
      wallet={wallet}
      modalIsOpen={removeModalIsOpen} 
      onClose={onCloseWithdraw}
      spec={spec}
      afterWithdraw={afterWithdraw}
      position={position}
      />
  </div>
  )
}