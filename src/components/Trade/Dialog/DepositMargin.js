import React, { useState ,useEffect} from 'react'
import {  getWalletBalance, depositMargin } from "../../../lib/web3js";
import NumberFormat from 'react-number-format';
import Button from '../../Button/Button';

export default function DepositMargin({wallet,spec = {},onClose,balance,afterDeposit}){
  const [integer, setInteger] = useState('');
  const [decimal, setDecimal] = useState('');
  const [amount,setAmount] = useState('');

  const onChange = event => {
    const {value} = event.target
    setAmount(value)
  }

  const addAll = () => {
    setAmount(balance)
  }

  const deposit = async (amount) => {
    const res = await depositMargin(wallet.detail.chainId,spec.pool,wallet.detail.account,amount);
    if(res.success){
      afterDeposit();
      onClose();
    } else {
      const msg = typeof res.error === 'string' ? res.error : res.error.errorMessage || res.error.message
      alert(msg)
    }
  }

  const splitDecimal = () => {
    if(balance){
      const formatBalance = (+balance).toFixed(2)
      const addMarginSub = formatBalance.indexOf('.') > 0 ? formatBalance.substring(formatBalance.indexOf('.') + 1,formatBalance.length) : '0'
      setInteger(balance);
      setDecimal(addMarginSub)
    }
  }

  useEffect(() => {
    splitDecimal();
    return () => {
    };
  }, [balance]);


  return (
    <div className='modal fade'>
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>DEPOSIT MARGIN</div>
            <div className='close' data-dismiss='modal' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='margin-box-info'>
              <div>Wallet Balance</div>
              <div className='money'>
                <span>
                  <span className='bt-balance'>
                    <NumberFormat value={ integer } displayType = 'text' decimalScale={0}/>.<span style={{fontSize:'12px'}}>{decimal}</span> 
                  </span> 
                  <br/>
                  <span 
                  style={{fontSize :'14px',marginLeft: '10px',marginTop: '10px'}}>
                    {spec.bTokenSymbol}
                  </span>
                  </span
                >
                <span className='add'></span>
              </div>
              <div className='enter-margin'>
                <div className='input-margin'>
                  <div className='box'>
                    <div className='amount' style={{display : amount !=='' ? 'block' : 'none'}}>AMOUNT</div>
                    <input
                      type='number'
                      className='margin-value'
                      placeholder='Amount'
                      value={amount}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div>{ spec.bTokenSymbol }</div>
              </div>
              <div className='max'>
                MAX: <span className='max-num'>{ balance }</span>
                <span className='max-btn-left' onClick={addAll} >ADD ALL</span>
              </div>
              <div className='add-margin-btn'>
                <Button
                  className='margin-btn'
                  btnText='DEPOSIT'
                  click={() => deposit(amount)}
                />                  
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}