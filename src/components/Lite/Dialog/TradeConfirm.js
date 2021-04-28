import Button from "../../Button/Button";
import NumberFormat from 'react-number-format';
import { tradeWithMargin } from "../../../lib/web3js";


export default function TradeConfirm({wallet,spec,onClose,volume,direction,position = 0,indexPrice,leverage,transFee,afterTrade}){


  const trade = async () => {
    const amount = direction === 'long' ? volume : -volume
    const res = await tradeWithMargin(wallet.chainId,spec.pool,wallet.account,amount)
    if(res.success){
      afterTrade()
      onClose()
    }
  }

  const afterTradePosition = direction === 'long' ? ((+volume) + (+position)) : ((+position) - (+volume))

  return (
    <div className='modal-dialog'>
      <div className='modal-content'>
        <div className='modal-header'>
          <div className='title'>CONFIRM</div>
          <div className='close' data-dismiss='modal' onClick={onClose}>
            <span>&times;</span>
          </div>
        </div>
        <div className='modal-body'>
          <div className='contract-box-info'>
            <div className='top'>
              <div className='text'>
                <div className='text-title'># of Contracts</div>
                <div className='text-num'>{ volume }</div>
              </div>
              <div className='text'>
                <div className='text-title'>Position after execution</div>
                <div className='text-num'>{ afterTradePosition }</div>
              </div>
              <div className='text'>
                <div className='text-title'>Direction</div>
                <div className='text-num'><span className={direction}>{direction}</span></div>
              </div>
              <div className='text'>
                <div className='text-title'>Trade Price (estimated)</div>
                <div className='text-num'><NumberFormat value={ indexPrice } decimalScale={2}  displayType='text'/></div>
              </div>
              <div className='text'>
                <div className='text-title'>Leverage after execution</div>
                <div className='text-num'>{ leverage }X</div>
              </div>
              <div className='text'>
                <div className='text-title'>Transaction Fee</div>
                <div className='text-num'>
                  <NumberFormat value={ transFee } decimalScale={2} suffix={` ${spec.bTokenSymbol}` } displayType='text'/>                   
                </div>
              </div>
            </div>
            <div className='modal-footer'>
              <div className='long-btn' v-if='confirm'>
                <button className='cancel' onClick={onClose}>CANCEL</button>
                <Button className='confirm' btnText='OK' click={trade} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}