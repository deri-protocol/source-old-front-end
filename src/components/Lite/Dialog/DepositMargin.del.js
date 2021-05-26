import React, { useState ,useEffect} from 'react'
import {  getWalletBalance, depositMargin, BigNumber } from "../../../lib/web3js/indexV2";
import NumberFormat from 'react-number-format';
import Button from '../../Button/Button';

export default function DepositMargin({wallet,spec = {},onClose,afterDeposit}){
  const [walletBalance, setWalletBalance] = useState('');
  const [addMarginSub, setAddMarginSub] = useState('');
  const [amount,setAmount] = useState('');

  const loadWalletBalance = async () => {
    if(wallet.isConnected()){
      const balance = await getWalletBalance(wallet.detail.chainId,spec.pool,wallet.detail.account)
      if(balance){
        const formatBalance = (+balance).toFixed(2)
        const addMarginSub = formatBalance.substring(formatBalance.indexOf('.'),formatBalance.length)
        setWalletBalance(balance);
        setAddMarginSub(addMarginSub)
      }
    }
  }

  const onChange = event => {
    const {value} = event.target
    setAmount(value)
  }

  const addAll = () => {
    setAmount(walletBalance)
  }

  const deposit = async (amount) => {
    const maxBalance = BigNumber(walletBalance)
    const curBalance = BigNumber(amount);
    if (curBalance.gt(maxBalance)) {
      alert("Insufficient balance in wallet");
      return;
    }
    if ((+amount) <= 0 || isNaN(amount)) {
      alert("It has to be greater than zero");
      return;
    }
    const res = await depositMargin(wallet.detail.chainId,spec.pool,wallet.detail.account,amount);
    if(res.success){
      afterDeposit();
      onClose();
    } else {
      const msg = typeof res.error === 'string' ? res.error : res.error.errorMessage || res.error.message
      alert(msg)
    }
  }

  useEffect(() => {
    loadWalletBalance()
    return () => {
    };
  }, [wallet.detail.account]);



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
                    <NumberFormat value={ walletBalance } displayType = 'text' decimalScale={0}/>.<span style={{fontSize:'12px'}}>{addMarginSub}</span> 
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
                MAX: <span className='max-num'>{ walletBalance }</span>
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