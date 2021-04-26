import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import NumberFormat from 'react-number-format'
import { getLiquidityInfo, removeLiquidity } from '../../../../lib/web3js';
import Button from '../../../Button/Button';

export default function RemoveDialog({isOpen,wallet,address,onClose,customizeStyle}){
  const [modalIsOpen,setIsOpen] = useState(isOpen);
  const [liqInfo, setLiqInfo] = useState({})
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('enabled');
  const appElement = document.getElementById('root')

	const closeModel = () => {
    if(status === 'enabled') {
      setIsOpen(false);
      onClose && onClose();
    }
  }

  const loadLiqidityInfo = async () => {
    const info = await getLiquidityInfo(wallet.chainId,address,wallet.account);	
    setLiqInfo({shares : info.shares})
  }

  const addAll = () => {
    setAmount(liqInfo.shares)
  }

  const onChange = e => {
    const {value} = e.target;
    setAmount(value)
  }

  const remove = async () => {
    if (liqInfo.shares < 1 && liqInfo.shares != 0) {
      alert('Leaving staking balance of smaller than 1 is not allowed. Please click "MAX" to remove all if you are to withdraw all of your liquidity.');
      return false;
    }
    if ((+liqInfo.shares) < (+amount)) {
      alert(`Your current max removable shares are  ${liqInfo.shares}`);
      return false;
    }
    if (+amount <= 0 || isNaN(amount)) {
      alert("Invalid Liquidity!");
      return false;
    }
    setStatus('disable')
    const res = await removeLiquidity(wallet.chainId,address,wallet.account,amount);
    if(!res.success){
      alert("failure of transaction");
      return false; 
    }
    setStatus('enabled')
    return true;
  }

  useEffect(() => {
    loadLiqidityInfo();
    return () => {
      
    }
  }, [])

  useEffect(() => {
    setIsOpen(isOpen)
    return () => isOpen = false
  }, [isOpen]);
  
  
  return(
    <Modal isOpen={modalIsOpen} style={customizeStyle} appElement={appElement}>
      <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <div className='title'>REMOVE LIQUIDITY</div>
              <div className='close' data-dismiss='modal' onClick={closeModel}>
                <span>&times;</span>
              </div>
            </div>
            <div className='modal-body'>          
              <div className='margin-box-info'>
                <div>Shares Available</div>
                <div className='money'>
                  <span>
                    <span className='bt-balance'>
                      <NumberFormat displayType='text' value ={liqInfo.shares} thousandSeparator={true} decimalScale={2}/>
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
                  MAX REMOVEABLE:
                  <span className='max-num'>{liqInfo.shares}</span>
                  <span className='max-btn-left' onClick={addAll}>REMOVE ALL</span>
                </div>
                <div className='add-margin-btn'>
                  <Button click={remove} className='margin-btn' btnText='REMOVE' afterClick={closeModel}/>
                </div>
              </div>
            </div>    
          </div>
        </div>
    </Modal>)
}