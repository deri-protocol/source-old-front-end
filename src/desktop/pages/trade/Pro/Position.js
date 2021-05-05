/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState,useEffect } from 'react'
import NumberFormat from 'react-number-format'
import { getPositionInfo, closePosition } from '../../../../lib/web3js';
import closePosImg from '../../../img/close-position.png'
import withModal from '../../../../components/hoc/withModal';
import DepositMargin from '../../../../components/Lite/Dialog/DepositMargin';
import WithdrawMagin from '../../../../components/Lite/Dialog/WithdrawMargin';
import useInterval from '../../../../hooks/useInterval';

export default function Position({wallet = {},spec = {}}){
  const [positionInfo, setPositionInfo] = useState({
    balanceContract : '-',
    averageEntryPrice : '-',
    marginHeld : '-',
    unrealizedPnl : '-',
    liquidationPrice : '-'
  });
  const [closing, setClosing] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  useInterval(loadPositionInfo,3000)

  const DepositDialog = withModal(DepositMargin);
  const WithDrawDialog = withModal(WithdrawMagin)

  const afterWithdraw =() => {
    loadPositionInfo();
  }

  const afterDeposit = afterWithdraw

  const onCloseDeposit = () => setAddModalIsOpen(false)
  const onCloseWithdraw = () => setRemoveModalIsOpen(false);


  
  async function loadPositionInfo(){    
    if(wallet){
      const positionInfo = await getPositionInfo(wallet.chainId,spec.pool,wallet.account)
      if(positionInfo){
        const direction = (+positionInfo.volume) > 0 ? 'LONG' : (positionInfo.volume == 0 ? '--' : 'SHORT') 
        positionInfo.direction = direction
        positionInfo.balanceContract = (+positionInfo.margin) + (+positionInfo.unrealizedPnl)
        setPositionInfo(positionInfo);
      }
    }
  }

  const onClosePosition = async () => {
    setClosing(true)
    const res = await closePosition(wallet.chainId,spec.pool,wallet.account).finally(() => setClosing(false))
    if(res.success){
      loadPositionInfo();
    } else {            
      if(typeof res.error === 'string') {
        alert(res.error)
      } else if(typeof res.error === 'object'){
        alert(res.error.errorMessage)
      } else {
        alert('Liquidation failed')
      }
    }
  }

  useEffect(() => {
    wallet && spec && loadPositionInfo();
    return () => {
    };
  }, [wallet,spec])

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
        {positionInfo.volume}
        <span className='close-position'>
          <span
            className='spinner spinner-border spinner-border-sm'
            style={{display : closing ? 'block' : 'none'}}
          ></span>
          <img src={closePosImg} onClick={onClosePosition}/>
        </span>
      </div>
      <div><NumberFormat value={positionInfo.averageEntryPrice} defaultValue='--' displayType='text' decimalScale={2}/></div>
      <div className={positionInfo.direction}>{positionInfo.direction}</div>
      <div>
        <NumberFormat value={positionInfo.balanceContract} displayType='text' decimalScale={2}/>
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
      <div><NumberFormat value={positionInfo.marginHeld} displayType='text' decimalScale={2}/></div>
      <div>{positionInfo.unrealizedPnl}</div>
      <div><NumberFormat value={positionInfo.liquidationPrice} displayType='text' decimalScale={2}/></div>
    </div>
    <div className='p-box tbody'></div>

      <DepositDialog
        wallet={wallet}
        modalIsOpen={addModalIsOpen} 
        onClose={onCloseDeposit}
        spec={spec}
        afterDeposit={afterDeposit}
      />
      <WithDrawDialog
        wallet={wallet}
        modalIsOpen={removeModalIsOpen} 
        onClose={onCloseWithdraw}
        spec={spec}
        afterWithdraw={afterWithdraw}
        />
  </div>
  )
}