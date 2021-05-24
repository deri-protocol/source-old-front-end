import React, { useState, useEffect } from 'react'
import withModal from '../../hoc/withModal';
import DepositMargin from './DepositMargin';
import WithdrawMagin from './WithdrawMargin';
import removeMarginIcon from '../../../assets/img/remove-margin.svg'
import addMarginIcon from '../../../assets/img/add-margin.svg'
import { getPoolBTokensBySymbolId } from '../../../lib/web3js/v2';
import DeriNumberFormat from '../../../utils/DeriNumberFormat';

const AddMarginDialog = withModal(DepositMargin)
const RemoveMarginDialog = withModal(WithdrawMagin)

export function BalanceList({wallet,spec,afterDepositAndWithdraw,position,onClose,depositAndWithdragList,}){
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
  const [balance, setBalance] = useState('');

  const closeAddMargin = () => setAddModalIsOpen(false)
  const closeRemoveMargin = () => setRemoveModalIsOpen(false)
  const closeCurrent = () => {
    afterDepositAndWithdraw();
    onClose();
  }
  const addMargin = (balance,bTokenSymbol) => {
    setBalance(balance);
    setAddModalIsOpen(true)
    spec.bTokenSymbol = bTokenSymbol
  }
  return(
    <>
      <div className='modal fade'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <div className='title'>Balance in contract</div>
              <div className='close' data-dismiss='modal' onClick={closeCurrent}>
                <span>&times;</span>
              </div>
            </div>
            <div className='modal-body'>
              <div className='balance-list'>
                <div className='row header'>
                  <span className='btoken'>Base Token</span>
                  <span className='w-balance'>Wallet Balance</span>
                  <span className='avail-balance'>Available Balance</span>
                </div>
                {depositAndWithdragList.map(item => (                  
                  <div className='row'>
                  <span className='btoken'>{item.bTokenSymbol}</span>
                  <span className='w-balance'><DeriNumberFormat value={item.walletBalance} decimalScale={2}/></span>
                  <span className='avail-balance'><DeriNumberFormat value={item.availableBalance} decimalScale={2}/></span>
                  <span className='action'>
                      <span
                        className='add-margin'
                        id='openAddMargin'
                        onClick={() => addMargin(item.walletBalance,item.bTokenSymbol)}> 
                        <img src={removeMarginIcon} alt='add margin'/> Add
                      </span>
                      <span className='remove-margin'
                        onClick={() => setRemoveModalIsOpen(true)}>
                        <img src={addMarginIcon} alt='add margin'/> Remove
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddMarginDialog  wallet={wallet} onClose={closeAddMargin} balance={balance} spec={spec} position={position} modalIsOpen={addModalIsOpen} className='trading-dialog'/>
      <RemoveMarginDialog  wallet={wallet} onClose={closeRemoveMargin} spec={spec} position={position} modalIsOpen={removeModalIsOpen} className='trading-dialog'/>
    </>
  )
}