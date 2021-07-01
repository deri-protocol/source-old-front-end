import React, { useState ,useEffect} from 'react'
import NumberFormat from 'react-number-format'
import { removeLiquidity, bg, removeLpLiquidity } from '../../../../lib/web3js/indexV2';
import Button from '../../../Button/Button';
import useDisableScroll from '../../../../hooks/useDisableScroll';
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';

export default function RemoveLiquidity({wallet,address,liqInfo,onClose,afterRemove,isLpPool,baseTokenId,unit,lang,version}){  
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('0');
  const [decimal, setDecimal] = useState('00');
  useDisableScroll();


  const addAll = () => {
    setAmount(liqInfo.totalShares)
  }

  const onChange = e => {
    const {value} = e.target;
    setAmount(value)
  }

  const remove = async () => {
    const max = bg(liqInfo.totalShares);
    const cur = bg(amount);
    if (cur.gt(max)) {
      alert(`${lang['your-current-max-removable-shares-are']}  ${liqInfo.totalShares}`);
      return false;
    }
    if(!isLpPool){
      const balance = (+liqInfo.totalShares) - (+amount)
      if (balance < 1 && balance > 0) {
        alert(lang['staking-max-limit-tip']);
        return false;
      }
    }
    if (+amount <= 0 || isNaN(amount)) {
      alert(lang['invalid-liquidity']);
      return false;
    }
    let res = null;
    if(isLpPool){
      res = await removeLpLiquidity(wallet.detail.chainId,address,wallet.detail.account,amount);
    } else {
      res = await removeLiquidity(wallet.detail.chainId,address,wallet.detail.account,amount,baseTokenId);
    }
    
    if(!res || !res.success){
      alert(lang['failure-of-transaction']);
      return false; 
    }
    return true;
  }


  useEffect(() => {    
    if(liqInfo && liqInfo.formatShares){
      const balance = liqInfo.formatShares;
      const decimal = balance.substring(balance.indexOf('.') +1 ,balance.indexOf('.') + 3)
      setBalance(balance);
      setDecimal(decimal)
    }
    return () => {};
  }, [liqInfo.totalShares]);

  
  
  return(
    <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <div className='title'>{lang['remove-liquidity']}</div>
            <div className='close' data-dismiss='modal' onClick={onClose}>
              <span>&times;</span>
            </div>
          </div>
          <div className='modal-body'>          
            <div className='margin-box-info'>
              <div> {version === 'v1' ? lang['shares-available'] : lang['liquidity-available']}</div>
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
                      {version === 'v1' ? lang['liquidity-shares'] : lang['liquidity']}
                    </div>
                    <input
                      type='number'
                      className='margin-value'
                      placeholder={version === 'v1' ? lang['liquidity-shares'] : lang['liquidity']}
                      value={amount}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div>{unit}</div>
              </div>
              <div className='max'>
                <span>{lang['max-removeable']}</span>
                <span className='max-num'><DeriNumberFormat value={liqInfo.totalShares} decimalScale={8}/></span>
                <span className='max-btn-left' onClick={addAll}>{lang['remove-all']}</span>
              </div>
              <div className='add-margin-btn'>
                <Button click={remove} className='margin-btn' btnText={lang['remove']} afterClick={afterRemove} lang={lang}/>
              </div>
            </div>
          </div>    
        </div>
      </div>
      )
}