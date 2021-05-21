import React, { useState,useEffect } from 'react'
import dateFormat from 'date-format'
import { getTradeHistory ,DeriEnv} from '../../../../lib/web3js/indexV2';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';
import config from '../../../../config.json'
import rightArrow from '../../../../assets/img/play-button.png'
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';

const chainConfig = config[DeriEnv.get()]['chainInfo'];
export default function History({wallet,spec}) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      if(wallet.isConnected() && spec && spec.pool){
        const all = await getTradeHistory(wallet.detail.chainId,spec.pool,wallet.detail.account);    
        const his = all.map(item => {
        item.directionText = item.direction === 'LONG' ? 'LONG / BUY' : 'SHORT / SELL'
        item.directionText = 'LONG / BUY' 
        if(item.direction === 'SHORT') {
          item.directionText = 'SHORT / SELL'
        } else if (item.direction === 'Liquidation') {
          item.directionText = 'LIQUIDATION'
        }
        return item;
      })
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
              {his.directionText}
              <HistoryLine wallet={wallet} his={his}/>
            </div>
            <div>
              {his.baseToken}
            </div>
            <div>
              <DeriNumberFormat value={his.price}  decimalScale={2}/>
            </div>
            <div>
              {his.volume}
            </div>
            <div >
              <DeriNumberFormat value={his.notional} decimalScale={4}/>
            </div>
            <div >
              <DeriNumberFormat value={his.transactionFee} decimalScale={4}/>              
            </div>
          </div>
        )
      })}
    </div>
  )
}


function HistoryLine({wallet,his}){
  const [isHover, setIsHover] = useState(false);
  const mouseOver = () => {
    setIsHover(true)
  }
  const mouseOut = () => {
    setIsHover(false)
  }
  const clazz = classNames('view',{hover : isHover})
  return (
    <span className={clazz} onMouseOut={mouseOut}>
      <span className='view-space' onMouseOver={mouseOver} >
        <a target='_blank' rel='noreferrer' href={`${chainConfig[wallet.detail.chainId]['viewUrl']}tx/${his.transactionHash}`}>View at {chainConfig[wallet.detail.chainId]['viewUrl']}</a>
      </span>              
      <span className='right-arrow' onMouseOver={mouseOver}><img alt='' src={rightArrow}/></span>                          
      <span className='view-arrow' onMouseOver={mouseOver} onMouseOut={mouseOut} >
        <a target='_blank' rel='noreferrer' href={`${chainConfig[wallet.detail.chainId]['viewUrl']}tx/${his.transactionHash}`}>
          <img rel='noreferrer' alt='' src="data:image/svg+xml;base64,DQo8c3ZnIGZpbGw9Im5vbmUiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNOC42NzYuNjQyYS42NS42NSAwIDAwLS4wNzIuMDA2SDQuNzkzYS42NS42NSAwIDAwLS41Ny45NzUuNjUuNjUgMCAwMC41Ny4zMjJINy4xMkwuNDM4IDguNjE0YS42NDcuNjQ3IDAgMDAuMjg2IDEuMDk2LjY1LjY1IDAgMDAuNjMyLS4xNzlMOC4wNCAyLjg2MXYyLjMyNGEuNjQ4LjY0OCAwIDAwLjk3Ny41Ny42NDguNjQ4IDAgMDAuMzIyLS41N1YxLjM4YS42NDcuNjQ3IDAgMDAtLjY2Mi0uNzM3eiIgZmlsbD0iI0FBQUFBQSIvPg0KPC9zdmc+DQoNCg=="/>
        </a>
      </span>
    </span> 
  )
}

