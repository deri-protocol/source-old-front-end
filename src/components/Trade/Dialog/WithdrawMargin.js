import React, { useState ,useEffect} from 'react'
import { withdrawMargin } from "../../../lib/web3js";
import Button from '../../Button/Button';
import DeriNumberFormat from '../../../utils/DeriNumberFormat';

export default function WithdrawMagin({wallet,spec = {},position,onClose,afterWithdraw}){
  const [integer, setInteger] = useState('');
  const [decimal, setDecimal] = useState('');
  const [amount,setAmount] = useState('');

  const calculateBalance = async () => {
    if(wallet.isConnected() && position.info.margin && position.info.unrealizedPnl){      
      const balance = ((+position.info.margin)  + (+position.info.unrealizedPnl)).toFixed(2) + ''       
      const decimal = balance.indexOf('.') > 0 ? balance.substring(balance.indexOf('.') + 1,balance.indexOf('.') +3) : '0'
      setInteger(balance);
      setDecimal(decimal);
    }
  }

  const removeAll = () => {
    setAmount(integer)
  }

  const onChange = event => {
    const {value} =event.target
    setAmount(value)
  }

  const withdraw = async () => {
    const res = await withdrawMargin(wallet.detail.chainId,spec.pool,wallet.detail.account,amount);
    if(res.success){
      afterWithdraw();
    } else {
      const msg = typeof res.error === 'string' ? res.error : res.error.errorMessage || res.error.message
      alert(msg)
    }
  }

  useEffect(() => {
    calculateBalance();
    return () => {
    };
  }, [wallet.detail.account,position.info.unrealizedPnl,position.info.margin]);

  return (
    <div
      className='modal fade'
      id='removeMargin'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>WITHDRAW MARGIN</div>
            <div className='close' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='margin-box-info'>
              <div>Available Balance</div>
              <div className='money'>
                <span>
                  <span className='bt-balance'>
                    <DeriNumberFormat value={ integer } thousandSeparator ={true}  decimalScale={0}/>.<span style={{fontSize:'12px'}}>{decimal}</span>                     
                  </span>
                  </span>
                <span className='remove'></span>
              </div>
              <div className='enter-margin remv'>
                <div className='input-margin'>
                  <div className='box'>
                    <div className='amount' style={{display : amount !=='' ? 'block' : 'none'}}>AMOUNT</div>
                    <input
                      type='number'
                      className='margin-value'
                      value={amount}
                      onChange={onChange}
                      placeholder='Amount'/>
                  </div>
                </div>
                <div>{ spec.baseToken }</div>
              </div>
              {(+position.volume) === 0 && <div className='max' v-show='isPosition'>
                MAX: <span className='max-num'>{ integer }</span>
                <span className='max-btn-left' onClick={removeAll}>REMOVE ALL</span>
              </div>}
              <div className='add-margin-btn'>
                <Button className='margin-btn' btnText='WITHDRAW' click={withdraw}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}