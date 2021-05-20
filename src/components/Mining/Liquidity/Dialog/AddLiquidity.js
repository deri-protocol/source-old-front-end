import React, { useState ,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import Button from '../../../Button/Button';
import Modal from 'react-modal'
import { addLiquidity, getWalletBalance, bg, addLpLiquidity } from '../../../../lib/web3js/indexV2';
import useSpecification from '../../../../hooks/useSpecification';



export default function AddLiquidity({wallet,address,baseToken,onClose,afterAdd,balance,isLpPool}){
  const [addValue, setAddValue] = useState('')
  const spec = useSpecification({wallet,address});


  const input = (e) => {
    const {value} =e.target
    setAddValue(value)
  }

  const addAll = () => {
    setAddValue(balance);
  }

  const addLiq = async () => {
    const max = bg(balance)
    const cur = bg(addValue);
    if(cur.gt(max)) {
      alert("not sufficient funds");
      return false;
    }
    if(spec && (+addValue) < (+spec.minAddLiquidity)) {
      alert(`The input liquidity shall not be less than ${spec.minAddLiquidity}`);
      return false;
    }
    if(addValue <=0 || isNaN(addValue)){
      alert("It has to be greater than zero");
      return false;
    }
    let res =  null;
    if(isLpPool){
      res = await addLpLiquidity(wallet.detail.chainId,address,wallet.detail.account,addValue);
    } else{
      res = await addLiquidity(wallet.detail.chainId,address,wallet.detail.account,addValue)
    }
    
    if (!res ||  !res.success) {
      alert("failure of transaction");
    }
    return true;
  }


  return(
    <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>ADD LIQUIDITY</div>
            <div className='close' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='margin-box-info'>
              <div>Wallet Balance</div>
              <div className='money'>
                <span> 
                  <span className='bt-balance'>
                    <NumberFormat displayType='text' value ={balance } thousandSeparator={true} decimalScale={2}/>
                  </span> 
                    <div className='base-token'>{ baseToken }</div> 
                  </span>
                <span className='add'></span>
              </div>
              <div className='enter-margin'>
                <div className='input-margin'>
                  <div className='box'>
                    <div className='amount' style={{display : addValue ? 'block' : 'none'}}>LIQUIDITY</div>
                    <input
                      type='number'
                      className='margin-value'
                      placeholder='LIQUIDITY'
                      value={addValue}
                      onChange={input}
                    />
                  </div>
                </div>
                <div>{ baseToken }</div>
              </div>
              <div className='max'>
                MAX: <span className='max-num'>{balance }</span>
                <span className='max-btn-left' onClick={addAll}>ADD ALL</span>
              </div>
              <div className='add-margin-btn'>
                <Button className='margin-btn' click={addLiq} btnText='ADD' afterClick={afterAdd}/>
              </div>
            </div>
          </div>    
        </div>
      </div>
  )
}