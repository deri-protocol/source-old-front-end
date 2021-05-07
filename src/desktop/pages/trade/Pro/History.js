import React, { useState,useEffect } from 'react'
import dateFormat from 'date-format'
import { getTradeHistory } from '../../../../lib/web3js';
import NumberFormat from 'react-number-format';

export default function History({wallet,spec}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      if(wallet.isConnected() && spec.pool){
        const his = await getTradeHistory(wallet.detail.chainId,spec.pool,wallet.detail.account);    
        setHistory(his)
      }
    }
    loadHistory()
    return () => {
    };
  }, [wallet.detail.account,spec]);
  return (
    <div className='history-box'>
      <div className='p-box theader'>
        <div className='td'>Time</div>
        <div>Direction</div>
        <div>Base Token</div>
        <div>Price</div>
        <div>Volume</div>
        <div>Notional</div>
        <div>Transaction Fee</div>
      </div>
      {history.map((his,index) => {
        return (
          <div className='p-box tbody' key={index}>
            <div className='td'>
              {dateFormat.asString('yyyy-MM-dd hh:mm:ss',new Date(parseInt(his.time)))}
            </div>
            <div className={his.direction}>
              {his.direction === 'LONG' ? `${his.direction} / BUY` : `${his.direction} / SELL`}
            </div>
            <div>
              {his.baseToken}
            </div>
            <div>
              <NumberFormat value={his.price} displayType='text' decimalScale={2}/>
            </div>
            <div>
              {his.volume}
            </div>
            <div >
              {his.notional}
            </div>
            <div >
              {his.transactionFee}
            </div>
          </div>
        )
      })}
    </div>
  )
}