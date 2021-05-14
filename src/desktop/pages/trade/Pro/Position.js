/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState,useEffect } from 'react'
import { getPositionInfo, closePosition, getWalletBalance } from '../../../../lib/web3js/indexV2';
import closePosImg from '../../../img/close-position.png'
import withModal from '../../../../components/hoc/withModal';
import DepositMargin from '../../../../components/Trade/Dialog/DepositMargin';
import WithdrawMagin from '../../../../components/Trade/Dialog/WithdrawMargin';
import useInterval from '../../../../hooks/useInterval';
import { eqInNumber } from '../../../../utils/utils';
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';



const DepositDialog = withModal(DepositMargin);
const WithDrawDialog = withModal(WithdrawMagin)

function Position({wallet = {},spec = {},position }){
  const [direction, setDirection] = useState('LONG');
  const [closing, setClosing] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');


  const afterWithdraw =() => {
    refreshBalance();
  }

  const afterDeposit = afterWithdraw

  const onCloseDeposit = () => setAddModalIsOpen(false)
  const onCloseWithdraw = () => setRemoveModalIsOpen(false);



  //todo 收拢到position modal
  const refreshBalance = () => {
    loadPositionInfo();
    loadBalance();
    wallet.loadWalletBalance(wallet.detail.chainId,wallet.detail.account)
  }
  
  async function loadPositionInfo(){    
    if(wallet.isConnected() && spec.pool){
      position.load(wallet,spec);
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

  const onClosePosition = async () => {
    setClosing(true)
    const res = await closePosition(wallet.detail.chainId,spec.pool,wallet.detail.account).finally(() => setClosing(false))
    if(res.success){
      refreshBalance();
    } else {            
      if(typeof res.error === 'string') {
        alert(res.error || 'Liquidation failed')
      } else if(typeof res.error === 'object'){
        alert(res.error.errorMessage || 'Liquidation failed')
      } else {
        alert('Liquidation failed')
      }
    }
  }

  useEffect(() => {
    loadPositionInfo();
    loadBalance();
    return () => {};
  }, [wallet.detail.account,spec.pool])

  useEffect(() => {    
    if(position.info.volume && position.info.margin && position.info.unrealizedPnl){
      const direction = (+position.info.volume) > 0 ? 'LONG' : (eqInNumber(position.info.volume , 0) ? '--' : 'SHORT')       
      setDirection(direction);
    }
    return () => {};
  }, [position.info.volume,position.info.margin,position.info.unrealizedPnl]);

  return (
    <div className='position-box' >
    <div className='p-box theader'>
      <div>Position</div>
      <div>Average Entry Price</div>
      <div>Direction</div>
      <div>
        Balance in Contract<br />
        (Dynamic Balance)
      </div>
      <div>Margin</div>
      <div>Unrealized PnL</div>
      <div>Liquidation Price</div>
    </div>
    <div className='p-box tbody'>
      <div>
        {position.info.volume}
        <span className='close-position'>
          {!closing && <img src={closePosImg} onClick={onClosePosition}/>}
          <span
            className='spinner spinner-border spinner-border-sm'
            style={{display : closing ? 'block' : 'none',marginLeft : '8px'}}
          ></span>
        </span>
      </div>
      <div><DeriNumberFormat value={position.info.averageEntryPrice}  decimalScale={2}/></div>
      <div className={direction}>{direction}</div>
      <div>
        <DeriNumberFormat value={(+position.info.margin) + (+position.info.unrealizedPnl)}  decimalScale={2}/>
        <span className='open-add' onClick={()=> setAddModalIsOpen(true)} >
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
            <path id='login' d='M13,9,7,4V7H0v4H7v3Zm3,7H8v2h8a2.006,2.006,0,0,0,2-2V2a2.006,2.006,0,0,0-2-2H8V2h8Z' transform='translate(18) rotate(90)' fill='#3ebf38' />
          </svg>
        </span>
        <span className='open-remove' onClick={() => setRemoveModalIsOpen(true)}>
          <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'>
            <path id='log-out' data-name='log out' d='M18,9,12,4V7H5v4h7v3ZM2,2h8V0H2A2.006,2.006,0,0,0,0,2V16a2.006,2.006,0,0,0,2,2h8V16H2Z' transform='translate(0 18) rotate(-90)' fill='#e35061' />
          </svg>
        </span>
      </div>
      <div><DeriNumberFormat value={position.info.marginHeld}  decimalScale={2}/></div>
      <div><DeriNumberFormat value={position.info.unrealizedPnl}  decimalScale={8}/></div>
      <div><DeriNumberFormat value={position.info.liquidationPrice}  decimalScale={2}/></div>
    </div>
    <div className='p-box tbody'></div>

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

export default inject('position')(observer(Position))