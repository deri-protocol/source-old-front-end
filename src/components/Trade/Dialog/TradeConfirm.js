import React, { useState ,useEffect} from 'react'
import Button from "../../Button/Button";
import NumberFormat from 'react-number-format';
import { tradeWithMargin } from "../../../lib/web3js/indexV2";


export default function TradeConfirm({wallet,spec,onClose,direction,volume,position = 0,indexPrice,leverage,transFee,afterTrade,lang}){
  const [pending, setPending] = useState(false);
  

  const trade = async () => {
    setPending(true)
    volume = direction === 'long' ? volume : -(+volume)
    const res = await tradeWithMargin(wallet.detail.chainId,spec.pool,wallet.detail.account,volume,spec.symbolId)
    if(res.success){
      afterTrade()
      onClose()
    } else {
      const msg = typeof res.error === 'string' ? res.error : res.error.errorMessage || res.error.message
      alert(msg)
    }
    setPending(false)
  }

  const close = () => {
    if(!pending){
      onClose()
    }
  }

  




  const afterTradePosition = direction === 'long' ?  ((+volume) + (+position)) : (+position) - (+volume)

  return (
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <div className='title'>{lang['confirm']}</div>
          <div className='close' data-dismiss='modal' onClick={close}>
            <span>&times;</span>
          </div>
        </div>
        <div className='modal-body'>
          <div className='contract-box-info'>
            <div className='top'>
              <div className='text'>
                <div className='text-title'># {lang['of-contracts']}</div>
                <div className='text-num'>{ direction === 'long' ? volume  : `-${volume}`}</div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['position-after-execution']}</div>
                <div className='text-num'>{ afterTradePosition }</div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['direction']}</div>
                <div className='text-num'><span className={direction}>{direction}</span></div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['trade-price-estimated']}</div>
                <div className='text-num'><NumberFormat value={ indexPrice } decimalScale={2}  displayType='text'/></div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['leverage-after-execution']}</div>
                <div className='text-num'>{ leverage }X</div>
              </div>
              <div className='text'>
                <div className='text-title'>{lang['transaction-fee']}</div>
                <div className='text-num'>
                  <NumberFormat value={ transFee } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } displayType='text'/>                   
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <div className='long-btn' v-if='confirm'>
                <button className='cancel' onClick={close}>{lang['cancel']}</button>
                <Button className='confirm' btnText={lang['ok']} click={trade} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}