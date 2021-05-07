import React, { useState ,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import Button from '../../../Button/Button';
import Modal from 'react-modal'
import { addLiquidity, getWalletBalance } from '../../../../lib/web3js';
import useSpecification from '../../../../hooks/useSpecification';



export default function AddLiquidity({wallet,chainId,address,baseToken,onClose,afterAdd}){
  const [addValue, setAddValue] = useState('')
  const [balance,setBalance] = useState('')
  const spec = useSpecification({wallet,address});


  const getBalance = async () => {
    if(wallet.isConnected() && wallet.detail.chainId == chainId){
      const total = await getWalletBalance(wallet.detail.chainId,address,wallet.detail.account);
      setBalance(total)
    }
  }

  useEffect(() => {
    getBalance();
    return () => {}
  }, [wallet.detail.account])

  const input = (e) => {
    const {value} =e.target
    setAddValue(value)
  }

  const addAll = () => {
    setAddValue(wallet.detail.balance);
  }

  const addLiq = async () => {
    if((+addValue) > (+balance)) {
      alert("not sufficient funds");
      return false;
    }
    if((+addValue) < (+spec.minAddLiquidity)) {
      alert(`The input liquidity shall not be less than ${spec.minAddLiquidity}`);
      return false;
    }
    const res = await addLiquidity(wallet.detail.chainId,address,wallet.detail.account,addValue)
    if (!res.success) {
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