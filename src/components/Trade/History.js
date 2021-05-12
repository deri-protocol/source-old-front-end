import React, { useState ,useEffect} from 'react'
import { getTradeHistory,DeriEnv } from "../../lib/web3js";
import dateFormat from 'date-format'
import NumberFormat from 'react-number-format';
import useInterval from '../../hooks/useInterval';
import config from '../../config.json'
import classNames from 'classnames';
import rightArrow from '../../assets/img/play-button.png'

const chainConfig = config[DeriEnv.get()]['chainInfo'];

export default function History({wallet = {},spec ={} ,specs = []}){
  const [history, setHistory] = useState([]);
  

  const loadHistory =  async () => {
    const all = await getTradeHistory(wallet.detail.chainId,spec.pool,wallet.detail.account)
    const his = all.map(item => {
      item.directionText = item.direction === 'LONG' ? 'LONG / BUY' : 'SHORT / SELL'
      const find = specs.find(s => s.bTokenSymbol === item.baseToken)
      if(find){
        item.baseTokenText = ` ${find.symbol} / ${find.bTokenSymbol}`
      }
      return item;
    })
    setHistory(his)
  }

  const showTxBar = e => {
    let target = e.target;
    if(target.tagName === 'IMG'){
      target = target.parentElement;
    }
    const prev1 = target.previousElementSibling; 
    const prve2 = prev1.previousElementSibling
    prev1.setAttribute('style','display:block')
    prve2.setAttribute('style','display:block')
  }

  const hideTxBar = e => {
    // const target = e.target;
    // const sibling  = target.previousElementSibling;
    // sibling.setAttribute('display','none')
  }


  // useInterval(loadHistory,3000)
  useEffect(() => {
    loadHistory();
    return () => {      
    };
  }, [wallet.detail,spec.pool,specs]);
  
  return (
    <div className='history-info' v-show='historyShow'>
      {history.map((his,index) => {
        let viewHoverClass = 'view'
        const hover = () => {
          viewHoverClass = viewHoverClass + ' hover'

        }
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
    <span class={clazz} onMouseOut={mouseOut}>
      <span className='view-space' onMouseOver={mouseOver} >
        <a target='_blank' rel='noreferrer' href={`${chainConfig[wallet.detail.chainId]['viewUrl']}tx/${his.transactionHash}`}>View at {chainConfig[wallet.detail.chainId]['viewUrl']}</a>
      </span>              
      <span className='right-arrow' onMouseOver={mouseOver}><img alt='' src={rightArrow}/></span>                          
      <span className='view-arrow' onMouseOver={mouseOver} onMouseOut={mouseOut} >
        <img rel='noreferrer' alt='' src="data:image/svg+xml;base64,DQo8c3ZnIGZpbGw9Im5vbmUiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNOC42NzYuNjQyYS42NS42NSAwIDAwLS4wNzIuMDA2SDQuNzkzYS42NS42NSAwIDAwLS41Ny45NzUuNjUuNjUgMCAwMC41Ny4zMjJINy4xMkwuNDM4IDguNjE0YS42NDcuNjQ3IDAgMDAuMjg2IDEuMDk2LjY1LjY1IDAgMDAuNjMyLS4xNzlMOC4wNCAyLjg2MXYyLjMyNGEuNjQ4LjY0OCAwIDAwLjk3Ny41Ny42NDguNjQ4IDAgMDAuMzIyLS41N1YxLjM4YS42NDcuNjQ3IDAgMDAtLjY2Mi0uNzM3eiIgZmlsbD0iI0FBQUFBQSIvPg0KPC9zdmc+DQoNCg=="/>
      </span>
    </span> 
  )
}