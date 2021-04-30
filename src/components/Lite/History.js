import React, { useState ,useEffect} from 'react'
import { getTradeHistory } from "../../lib/web3js";
import dateFormat from 'date-format'
import NumberFormat from 'react-number-format';

export default function History({wallet = {},spec ={} ,specs = []}){
  const [history, setHistory] = useState([]);

  const loadHistory =  async () => {
    const all = await getTradeHistory(wallet.chainId,spec.pool,wallet.account)
    const his = all.map(item => {
      item.directionText = item.direction === 'LONG' ? 'LONG / BUY' : 'SHORT / SELL'
      const find = specs.find(s => s.bTokenSymbol == item.baseToken)
      if(find){
        item.baseTokenText = ` ${find.symbol} / ${find.bTokenSymbol}`
      }
      return item;
    })
    setHistory(his)
  }

  useEffect(() => {
    loadHistory();
    return () => {      
    };
  }, [wallet.account,spec.pool,specs]);
  
  return (
    <div className='history-info' v-show='historyShow'>
      {history.map(his => {
        return (
          <div className='history-box'>
          <div className='direction-bToken-price'>
            <span>
              <span className={`${his.direction}`}>{ his.directionText }</span>
              <span>{ his.baseTokenText }</span>
            </span>
            <span className='history-text time'>{dateFormat.asString('yyyy-MM-dd hh:mm:ss',new Date(parseInt(his.time)))}</span>
          </div>
          <div className='time-price-volume'>
            <div className='history-price'>
              <div className='history-title'>Volume @ Price</div>
              <div className='history-text'>{ his.volume } @ <NumberFormat value={ his.price } decimalScale={2} displayType='text'/></div>
            </div>
          <div className='notional'>
              <div className='history-title'>Notional</div>
              <div className='history-text'>{ his.notional }</div>
            </div>
            <div className='history-fee'>
              <div className='history-title'>Transaction Fee</div>
              <div className='history-text'>{ his.transactionFee }</div>
            </div>
          </div>        
        </div>
        )
      })}
    </div>
  )
}