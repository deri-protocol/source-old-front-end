import React, { useState ,useEffect} from 'react'
import { getTradeHistory,DeriEnv } from "../../lib/web3js/indexV2";
import dateFormat from 'date-format'
import NumberFormat from 'react-number-format';
import useInterval from '../../hooks/useInterval';
import config from '../../config.json'
import classNames from 'classnames';
import rightArrow from '../../assets/img/play-button.png'
import DeriNumberFormat from '../../utils/DeriNumberFormat';
import { inject, observer } from 'mobx-react';

const chainConfig = config[DeriEnv.get()]['chainInfo'];

function History({wallet ,trading}){
  const [history, setHistory] = useState([]);  

  async function loadHistory (){
    if(wallet.isConnected() && trading.configs && trading.config){
      const all = trading.history
      const his = all.map(item => {
        item.directionText = item.direction === 'LONG' ? 'LONG / BUY' : 'SHORT / SELL'
        item.directionText = 'LONG / BUY' 
        if(item.direction === 'SHORT') {
          item.directionText = 'SHORT / SELL'
        } else if (item.direction === 'Liquidation') {
          item.directionText = 'LIQUIDATION'
        }
        const find = trading.config.find(s => s.bTokenSymbol === item.baseToken)
        if(find){
          item.baseTokenText = ` ${find.symbol} / ${find.bTokenSymbol}`
        }
        return item;
      })
      setHistory(his)
    }
  }

  useEffect(() => {
    loadHistory();
    return () => {};
  }, [wallet.detail,trading.configs,trading.config]);
  
  return (
    <div className='history-info' v-show='historyShow'>
      {history.map((his,index) => {
        return (
          <div className='history-box' key={index}>
          <div className='direction-bToken-price'>
            <span className='direction'>
              <span className={`${his.direction}`}>{ his.directionText }</span>
              <span>{ his.baseTokenText }</span>  
              <HistoryLine wallet={wallet} his={his}/>    
            </span>
            <span className='history-text time'>{dateFormat.asString('yyyy-MM-dd hh:mm:ss',new Date(parseInt(his.time)))}</span>
          </div>
          <div className='time-price-volume'>
            <div className='history-price'>
              <div className='history-title'>Volume @ Price</div>
              <div className='history-text'>{ his.volume } @ <DeriNumberFormat value={ his.price } decimalScale={2} displayType='text'/></div>
            </div>
          <div className='notional'>
              <div className='history-title'>Notional</div>
              <div className='history-text'><DeriNumberFormat value={ his.notional} decimalScale={4}/></div>
            </div>
          <div className='history-fee'>
            <div className='history-title pc'>Transaction Fee</div>
              <div className='history-title mobile'>Fee</div>
              <div className='history-text'><DeriNumberFormat value={ his.transactionFee } decimalScale={4}/></div>            
            </div>
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
      <span className='view-arrow' onMouseOver={mouseOver} onMouseOut={mouseOut}  >
        <a target='_blank' rel='noreferrer' href={`${chainConfig[wallet.detail.chainId]['viewUrl']}tx/${his.transactionHash}`}>
          <img rel='noreferrer' alt='' src="data:image/svg+xml;base64,DQo8c3ZnIGZpbGw9Im5vbmUiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNOC42NzYuNjQyYS42NS42NSAwIDAwLS4wNzIuMDA2SDQuNzkzYS42NS42NSAwIDAwLS41Ny45NzUuNjUuNjUgMCAwMC41Ny4zMjJINy4xMkwuNDM4IDguNjE0YS42NDcuNjQ3IDAgMDAuMjg2IDEuMDk2LjY1LjY1IDAgMDAuNjMyLS4xNzlMOC4wNCAyLjg2MXYyLjMyNGEuNjQ4LjY0OCAwIDAwLjk3Ny41Ny42NDguNjQ4IDAgMDAuMzIyLS41N1YxLjM4YS42NDcuNjQ3IDAgMDAtLjY2Mi0uNzM3eiIgZmlsbD0iI0FBQUFBQSIvPg0KPC9zdmc+DQoNCg=="/>
        </a>
      </span>
    </span> 
  )
}

export default inject('wallet','trading')(observer(History))
