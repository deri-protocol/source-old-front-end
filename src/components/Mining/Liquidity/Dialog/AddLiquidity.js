import React, { useState ,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import Button from '../../../Button/Button';
import Modal from 'react-modal'
import { addLiquidity, getWalletBalance, bg, addLpLiquidity } from '../../../../lib/web3js/indexV2';
import useSpecification from '../../../../hooks/useSpecification';
import useDisableScroll from '../../../../hooks/useDisableScroll';



export default function AddLiquidity({wallet,address,baseToken,onClose,afterAdd,balance,isLpPool,baseTokenId,symbolId,lang}){
  const [amount, setAmount] = useState('0');
  const [decimal, setDecimal] = useState('00');
  const [addValue, setAddValue] = useState('')
  const spec = useSpecification({wallet,address,symbolId});
  useDisableScroll();


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
      alert(lang['not-sufficient-funds']);
      return false;
    }
    if(spec && (+addValue) < (+spec.minAddLiquidity)) {
      alert(`${lang['the-input-liquidity-shall-not-be-less-than']} ${spec.minAddLiquidity}`);
      return false;
    }
    if(addValue <=0 || isNaN(addValue)){
      alert(lang['it-has-to-be-greater-than-zero']);
      return false;
    }
    let res =  null;
    if(isLpPool){
      res = await addLpLiquidity(wallet.detail.chainId,address,wallet.detail.account,addValue);
    } else{
      res = await addLiquidity(wallet.detail.chainId,address,wallet.detail.account,addValue,baseTokenId)
    }
    
    if (!res ||  !res.success) {
      alert(lang['failure-of-transaction']);
    }
    return true;
  }

  useEffect(() => {    
    const amount = (+balance).toFixed(2)
    const decimal = amount.substring(amount.indexOf('.') + 1,amount.length)
    setAmount(amount);
    setDecimal(decimal)
    return () => {};
  }, [balance]);


  return(
    <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>{lang['add-liquidity']}</div>
            <div className='close' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>
            <div className='margin-box-info'>
              <div>{lang['wallet-balance']}</div>
              <div className='money'>
                <span> 
                  <span className='bt-balance'>
                    <NumberFormat displayType='text' value ={amount } thousandSeparator={true} allowZero={true} decimalScale={0}/>.
                    <span className='float'><NumberFormat displayType='text' value ={decimal} thousandSeparator={true} decimalScale={2} allowZero={true}/></span>
                  </span> 
                    <div className='base-token'>{ baseToken }</div> 
                  </span>
                <span className='add'></span>
              </div>
              <div className='enter-margin'>
                <div className='input-margin'>
                  <div className='box'>
                    <div className='amount' style={{display : addValue ? 'block' : 'none'}}>{lang['liquidity']}</div>
                    <input
                      type='number'
                      className='margin-value'
                      placeholder={lang['liquidity']}
                      value={addValue}
                      onChange={input}
                    />
                  </div>
                </div>
                <div>{ baseToken }</div>
              </div>
              <div className='max'>
                {lang['max']}: <span className='max-num'>{balance }</span>
                <span className='max-btn-left' onClick={addAll}>{lang['add-all']}</span>
              </div>
              <div className='add-margin-btn'>
                <Button className='margin-btn' click={addLiq} btnText={lang['add']} afterClick={afterAdd}/>
              </div>
            </div>
          </div>    
        </div>
      </div>
  )
}