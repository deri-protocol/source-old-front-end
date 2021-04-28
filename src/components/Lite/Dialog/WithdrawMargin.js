import React, { useState ,useEffect} from 'react'
import { withdrawMargin, getPositionInfo } from "../../../lib/web3js";
import NumberFormat from 'react-number-format';
import Button from '../../Button/Button';

export default function WithdrawMagin({wallet,spec = {},onClose,afterWithdraw}){
  const [walletBalance, setWalletBalance] = useState('');
  const [decimal, setDecimal] = useState('');
  const [amount,setAmount] = useState('');

  const loadWalletBalance = async () => {
    if(wallet && wallet.account){
      const positionInfo = await getPositionInfo(wallet.chainId,spec.pool,wallet.account);
      if(positionInfo){
        const balance = (+positionInfo.margin)  + (+positionInfo.unrealizedPnl) + ''       
        const decimal = balance.substring(balance.indexOf('.'),balance.indexOf('.') +3)
        setWalletBalance(balance);
        setDecimal(decimal);
      }
    }
  }

  const removeAll = () => {
    setAmount(walletBalance)
  }

  const onChange = event => {
    const {value} =event.target
    setAmount(value)
  }

  const withdraw = async () => {
    const res = await withdrawMargin(wallet.chainId,spec.pool,wallet.account,amount);
    if(res.success){
      afterWithdraw();
    } else {
      alert(res.error)
    }
  }

  useEffect(() => {
    loadWalletBalance();
    return () => {
    };
  }, [wallet]);

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
                    <NumberFormat value={ walletBalance } thousandSeparator ={false} displayType = 'text' decimalScale={0}/>.<span style={{fontSize:'12px'}}>{decimal}</span>                     
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
              <div className='max' v-show='isPosition'>
                MAX: <span className='max-num'>{ walletBalance }</span>
                <span className='max-btn-left' onClick={removeAll}>REMOVE ALL</span>
              </div>
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