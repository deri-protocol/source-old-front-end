import React, { useState ,useEffect} from 'react'
import { depositMargin, bg } from "../../../lib/web3js/indexV2";
import NumberFormat from 'react-number-format';
import Button from '../../Button/Button';
import useDisableScroll from '../../../hooks/useDisableScroll';

export default function DepositMargin({wallet,spec = {},onClose,balance,afterDeposit,nested}){
  const [integer, setInteger] = useState('');
  const [decimal, setDecimal] = useState('');
  const [amount,setAmount] = useState('');
  const [pending, setPending] = useState(false);
  useDisableScroll(nested);

  const onChange = event => {
    const {value} = event.target
    setAmount(value)
  }

  const addAll = () => {
    setAmount(balance)
  }

  const deposit = async (amount) => {
    const maxBalance = bg(balance)
    const curBalance = bg(amount);
    if (curBalance.gt(maxBalance)) {
      alert("Insufficient balance in wallet");
      return;
    }
    if ((+amount) <= 0 || isNaN(amount)) {
      alert("It has to be greater than zero");
      return;
    }
    setPending(true)
    const res = await depositMargin(wallet.detail.chainId,spec.pool,wallet.detail.account,amount,spec.bTokenId);
    if(res.success){
      afterDeposit();
      onClose();
    } else {
      alert('Deposit failed')
    }
    setPending(false)
  }

  const close = () => {
    if(!pending){
      onClose()
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
            <div className='close' data-dismiss='modal' onClick={close}>
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
                  checkApprove={true}
                  wallet={wallet}
                  spec={spec}
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