import React, { useState, useEffect } from 'react'
import NumberFormat from 'react-number-format'
import Button from '../../Button/Button';
import DeriNumberFormat from '../../../utils/DeriNumberFormat';

export default function RemoveStake({ wallet, lang, onClose, balance,afterAdd }) {
  const [amount, setAmount] = useState('0');
  const [addValue, setAddValue] = useState('')
  const [decimal, setDecimal] = useState('00');


  const input = (e) => {
    const { value } = e.target
    setAddValue(value)
  }

  const addAll = () => {
    setAddValue(balance);
  }

  const addLiq = async ()=>{

  }

  return (
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <div className='title'>{lang['remove-stake']}</div>
          <div className='close' onClick={onClose}>
            <span>&times;</span>
          </div>
        </div>
        <div className='modal-body'>
          <div className='margin-box-info'>
            <div>{lang['wallet-balance']}</div>
            <div className='money'>
              <span>
                <span className='bt-balance'>
                  <NumberFormat displayType='text' value={amount} thousandSeparator={true} allowZero={true} decimalScale={0} />.
                    <span className='float'><NumberFormat displayType='text' value={decimal} thousandSeparator={true} decimalScale={2} allowZero={true} /></span>
                </span>
                <div className='base-token'>DERI</div>
              </span>
              <span className='add'></span>
            </div>
            <div className='enter-margin'>
              <div className='input-margin'>
                <div className='box'>
                  <div className='amount' style={{ display: addValue ? 'block' : 'none' }}>{lang['liquidity']}</div>
                  <input
                    type='number'
                    className='margin-value'
                    value={addValue}
                    onChange={input}
                  />
                </div>
              </div>
              <div>DERI</div>
            </div>
            <div className='max'>
              {lang['max']}: <span className='max-num'><DeriNumberFormat value={balance} decimalScale={8} /></span>
              <span className='max-btn-left' onClick={addAll}>{lang['add-all']}</span>
            </div>
            <div className='add-margin-btn'>
                <Button className='margin-btn' click={addLiq} btnText={lang['remove-stake']} afterClick={afterAdd} lang={lang}/>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}