import React, { useState ,useEffect} from 'react'
import { getTradeHistory } from "../../lib/web3js";

export default function History({wallet,spec}){
  const [history, setHistory] = useState([]);

  const loadHistory =  async () => {
    const all = await getTradeHistory(wallet.chainId,spec.pool,wallet.account)
    setHistory(all)
  }

  useEffect(() => {
    loadHistory();
    return () => {      
    };
  }, [wallet.account,spec.pool]);
  
  return (
    <div className='history-info' v-show='historyShow'>
      {history.map(his => {
        return (
          <div className='history-box'>
          <div className='direction-bToken-price'>
            <span>
              <span className='his.direction'>{ his.direction }</span>
              <span>{ his.baseToken }</span>
            </span>
            <span className='history-text time'>{ his.time }</span>
          </div>
          <div className='time-price-volume'>
            <div className='history-price'>
              <div className='history-title'>Volume @ Price</div>
              <div className='history-text'>{ his.volume } @ { his.price }</div>
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