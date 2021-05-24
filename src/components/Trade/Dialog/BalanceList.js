import React, { useState, useEffect } from 'react'
import withModal from '../../hoc/withModal';
import DepositMargin from './DepositMargin';
import WithdrawMagin from './WithdrawMargin';
import removeMarginIcon from '../../../assets/img/remove-margin.svg'
import addMarginIcon from '../../../assets/img/add-margin.svg'

const AddMarginDialog = withModal(DepositMargin)
const RemoveMarginDialog = withModal(WithdrawMagin)

export function BalanceList({onClose}){
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);

  return(
    <div className='modal fade'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>Balance in contract</div>
            <div className='close' data-dismiss='modal' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='balance-list'>
              <div className='row header'>
                <span>Base Token</span><span>Wallet Balance</span><span>Available Balance</span></div>
              <div className='row'>
                <span>UNI</span><span>9,000</span><span>200</span>
                  <span>
                    <span
                      className='add-margin'
                      id='openAddMargin'
                      onClick={() => setAddModalIsOpen(true)}
                    > 
                      <img src={removeMarginIcon} alt='add margin'/> Add
                    </span>
                    <span className='remove-margin'
                      onClick={() => setRemoveModalIsOpen(true)}>
                      <img src={addMarginIcon} alt='add margin'/> Remove
                    </span>
                  </span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}