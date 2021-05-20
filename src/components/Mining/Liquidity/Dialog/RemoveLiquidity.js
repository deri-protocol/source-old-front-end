import React, { useState ,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import { removeLiquidity, bg, removeLpLiquidity } from '../../../../lib/web3js/indexV2';
import Button from '../../../Button/Button';

export default function RemoveLiquidity({wallet,address,liqInfo,onClose,afterRemove,isLpPool}){  
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [decimal, setDecimal] = useState('00');


  const addAll = () => {
    setAmount(liqInfo.shares)
  }

  const onChange = e => {
    const {value} = e.target;
    setAmount(value)
  }

  const remove = async () => {
    const max = bg(liqInfo.shares);
    const cur = bg(amount);
    if(!isLpPool){
      const balance = (+liqInfo.shares) - (+amount)
      if (balance < 1 && balance !== 0) {
        alert('Leaving staking balance of smaller than 1 is not allowed. Please click "MAX" to remove all if you are to withdraw all of your liquidity.');
        return false;
      }
    }
    if (cur.gt(max)) {
      alert(`Your current max removable shares are  ${liqInfo.shares}`);
      return false;
    }
    if (+amount <= 0 || isNaN(amount)) {
      alert("Invalid Liquidity!");
      return false;
    }
    let res = null;
    if(isLpPool){
      res = await removeLpLiquidity(wallet.detail.chainId,address,wallet.detail.account,amount);
    } else {
      res = await removeLiquidity(wallet.detail.chainId,address,wallet.detail.account,amount);
    }
    
    if(!res || !res.success){
      alert("failure of transaction");
      return false; 
    }
    return true;
  }


  useEffect(() => {    
    if(liqInfo && liqInfo.shares){
      const balance = (+liqInfo.shares).toFixed(2)
      const decimal = balance.substring(balance.indexOf('.') +1 ,balance.length)
      setBalance(balance);
      setDecimal(decimal)
    }
    return () => {};
  }, [liqInfo.shares]);

  
  
  return(
    <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>REMOVE LIQUIDITY</div>
            <div className='close' data-dismiss='modal' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>          
            <div className='margin-box-info'>
              <div>Shares Available</div>
              <div className='money'>
                <span>
                  <span className='bt-balance'>
                    <NumberFormat displayType='text' value ={balance} decimalScale={0} thousandSeparator={true}/>.
                    <span className='float'>{decimal}</span>
                  </span>
                    </span>
                <span className='remove'></span>
              </div>
              <div className='enter-margin'>
                <div className='input-margin'>
                  <div className='box'>
                    <div className='amount' style={{display : amount ? 'block' : 'none'}}>
                      LIQUIDITY SHARES
                    </div>
                    <input
                      type='number'
                      className='margin-value'
                      placeholder='LIQUIDITY SHARES'
                      value={amount}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div>Shares</div>
              </div>
              <div className='max'>
                <span>MAX REMOVEABLE:</span>
                <span className='max-num'>{liqInfo.shares}</span>
                <span className='max-btn-left' onClick={addAll}>REMOVE ALL</span>
              </div>
              <div className='add-margin-btn'>
                <Button click={remove} className='margin-btn' btnText='REMOVE' afterClick={afterRemove}/>
              </div>
            </div>
          </div>    
        </div>
      </div>
      )
}