import React, { useState ,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import Button from '../../../Button/Button';
import Modal from 'react-modal'
import { addLiquidity, getWalletBalance } from '../../../../lib/web3js';
import useSpecification from '../../../../hooks/useSpecification';



export default function AddDialog({isOpen,wallet = {},address,baseToken,onClose,customizeStyle}){
  const [addValue, setAddValue] = useState('')
  const [balance,setBalance] = useState(wallet.balance)
  const [modalIsOpen,setIsOpen] = useState(isOpen);
  const [status, setStatus] = useState('enabled');
  const spec = useSpecification({wallet,address});
  const appElement = document.getElementById('root')

	const closeModel = () => {
    if(status === 'enabled') {
      setIsOpen(false);
      onClose();
    }
  }

  const getBalance = async () => {
    if(wallet && wallet.account){
      const total = await getWalletBalance(wallet.chainId,address,wallet.account);
      setBalance(total)
    }
  }


  useEffect(() => {
    getBalance();
  }, [])

  const input = (e) => {
    const {value} =e.target
    setAddValue(value)
  }

  const addAll = () => {
    setAddValue(wallet.balance);
  }

  const addLiq = async () => {
    if(addValue > wallet.balance) {
      alert("not sufficient funds");
      return false;
    }
    if((+addValue) < (+spec.minAddLiquidity)) {
      alert(`The input liquidity shall not be less than ${spec.minAddLiquidity}`);
      return false;
    }
    setStatus('disabled')
    const res = await addLiquidity(wallet.chainId,address,wallet.account,addValue)
    if (!res.success) {
      alert("failure of transaction");
    }
    setStatus('enabled')
    return true;
  }


  useEffect(() => {
    setIsOpen(isOpen)
    return () => {
      isOpen = false
      setAddValue('')
    } 
  }, [isOpen]);


  return(
    <Modal isOpen={modalIsOpen} style={customizeStyle} appElement={appElement}>
      <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <div className='title'>ADD LIQUIDITY</div>
              <div className='close' data-dismiss='modal' onClick={closeModel}>
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
                  <Button className='margin-btn' click={addLiq} btnText='ADD' afterClick={closeModel}/>
                </div>
              </div>
            </div>    
          </div>
        </div>
    </Modal>
  )
}