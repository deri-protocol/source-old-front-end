import React, { useState,useEffect } from 'react'
import dateFormat from 'date-format'
import { getTradeHistory ,DeriEnv} from '../../../../lib/web3js/indexV2';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';
import config from '../../../../config.json'
import rightArrow from '../../../../assets/img/play-button.png'
import DeriNumberFormat from '../../../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';

const chainConfig = config[DeriEnv.get()]['chainInfo'];

function History({wallet,trading,lang}) {
  const [history, setHistory] = useState([]);

  async function loadHistory (){
    if(wallet.isConnected() && trading.config && trading.history.length > 0){
      const his = trading.history.map(item => {
        item.directionText =  lang['long-buy']
        if(item.direction === 'SHORT') {
          item.directionText =  lang['short-sell']
        } else if (item.direction.toLowerCase() === 'liquidation') {
          item.directionText = lang['liquidation']
        }
        return item;
      })
    setHistory(his)
    }
  }


  useEffect(() => {
    loadHistory()
    return () => {};
  }, [wallet.detail.account,trading.config,trading.history]);



  return (
    <div className='history-box'>
      <div className='p-box theader'>
        <div className='td'>{lang['time']}</div>
        <div>{lang['direction']}</div>
        <div>{lang['base-token']}</div>
        <div>{lang['price']}</div>
        <div>{lang['volume']}</div>
        <div>{lang['notional']}</div>
        <div>{lang['transaction-fee']}</div>
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
              {his.baseToken || '--'}
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

export default inject('wallet','trading')(observer(History))

