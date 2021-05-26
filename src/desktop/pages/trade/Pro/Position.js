/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState,useEffect } from 'react'
import { closePosition, getWalletBalance } from '../../../../lib/web3js/indexV2';
import closePosImg from '../../../img/close-position.png'
import withModal from '../../../../components/hoc/withModal';
import DepositMargin from '../../../../components/Trade/Dialog/DepositMargin';
import WithdrawMagin from '../../../../components/Trade/Dialog/WithdrawMargin';
import { eqInNumber } from '../../../../utils/utils';
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';
import removeMarginIcon from '../../../../assets/img/remove-margin.svg'
import addMarginIcon from '../../../../assets/img/add-margin.svg'
import marginDetailIcon from '../../../../assets/img/margin-detail.png'
import { BalanceList } from '../../../../components/Trade/Dialog/BalanceList';



const DepositDialog = withModal(DepositMargin);
const WithDrawDialog = withModal(WithdrawMagin)
const BalanceListDialog = withModal(BalanceList)


function Position({wallet,trading,version}){
  const [direction, setDirection] = useState('LONG');
  const [closing, setClosing] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balanceListModalIsOpen, setBalanceListModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');


  const afterWithdraw =() => {
    refreshBalance();
  }

  const afterDeposit = afterWithdraw

  const onCloseDeposit = () => setAddModalIsOpen(false)
  const onCloseWithdraw = () => setRemoveModalIsOpen(false);
  const onCloseBalanceList = () => setBalanceListModalIsOpen(false);
  const afterDepositAndWithdraw = () => {
    refreshBalance();
  }

  const refreshBalance = () => {
    loadBalance();
    trading.refresh();
  }
  

  const loadBalance = async () => {
    if(wallet.isConnected() && trading.config){
      const balance = await getWalletBalance(wallet.detail.chainId,trading.config.pool,wallet.detail.account,trading.config.bTokenId)
      if(balance){
        setBalance(balance)
      }
    }
  }

  const onClosePosition = async () => {
    setClosing(true)
    const res = await closePosition(wallet.detail.chainId,trading.config.pool,wallet.detail.account,trading.config.symbolId).finally(() => setClosing(false))
    if(res.success){
      refreshBalance();
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

  // useEffect(() => {
  //   if(wallet.detail.account){
  //     trading.init(wallet)
  //   }
  //   return () => {
  //   };
  // }, [wallet.detail.account]);

  useEffect(() => {
    loadBalance();
    return () => {};
  }, [wallet.detail.account,trading.config,trading.amount.dynBalance])

  useEffect(() => {    
    if(trading.position.volume && trading.position.margin && trading.position.unrealizedPnl){
      const direction = (+trading.position.volume) > 0 ? 'LONG' : (eqInNumber(trading.position.volume , 0) ? '--' : 'SHORT')       
      setDirection(direction);
    }
    return () => {};
  }, [trading.position.volume,trading.position.margin,trading.position.unrealizedPnl]);

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
        {trading.position.volume}
        <span className='close-position'>
          {!closing && <img src={closePosImg} onClick={onClosePosition}/>}
          <span
            className='spinner spinner-border spinner-border-sm'
            style={{display : closing ? 'block' : 'none',marginLeft : '8px'}}
          ></span>
        </span>
      </div>
      <div><DeriNumberFormat value={trading.position.averageEntryPrice}  decimalScale={2}/></div>
      <div className={direction}>{direction}</div>
      <div>
        <DeriNumberFormat allowZero={true} value={(+trading.position.margin) + (+trading.position.unrealizedPnl)}  decimalScale={2}/>
        {version.isV1 ? <span>
        <span
          className='open-add'
          id='openAddMargin'
          onClick={() => setAddModalIsOpen(true)}
        > 
          <img src={removeMarginIcon} alt='add margin'/>
        </span>
        <span className='open-remove'
          onClick={() => setRemoveModalIsOpen(true)}>
          <img src={addMarginIcon} alt='add margin'/>
        </span>
      </span> : (<span className='balance-list-btn' onClick={() => setBalanceListModalIsOpen(true)}><img src={marginDetailIcon} alt='Remove margin'/> Detail</span>)}       
      </div>
      <div><DeriNumberFormat value={trading.position.marginHeld}  decimalScale={2}/></div>
      <div><DeriNumberFormat value={trading.position.unrealizedPnl}  decimalScale={8}/></div>
      <div><DeriNumberFormat value={trading.position.liquidationPrice}  decimalScale={2}/></div>
    </div>
    <div className='p-box tbody'></div>

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