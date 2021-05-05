import React, { useState,useEffect } from 'react'
import dateFormat from 'date-format'
import { getTradeHistory } from '../../../../lib/web3js';

export default function History({wallet,spec}) {
  const [history, setHistory] = useState([]);

  

  useEffect(() => {
    const loadHistory = async () => {
      const his = await getTradeHistory(wallet.chainId,spec.pool,wallet.account);    
      setHistory(his)
    }
    wallet && spec && loadHistory()
    return () => {
    };
  }, [wallet,wallet,spec]);
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
      {history.map(his => {
        return (
          <div className='p-box tbody' v-for='list in history'>
            <div className='td'>
              {dateFormat.asString('yyyy-MM-dd hh:mm:ss',new Date(parseInt(his.time)))}
            </div>
            <div className={his.direction}>
              {his.direction}
            </div>
            <div>
              {his.baseToken}
            </div>
            <div>
              {his.price}
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