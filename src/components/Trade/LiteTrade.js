import { useState } from 'react'
import Position from './Position';
import History from './History';
import classNames from 'classnames';
import ContractInfo from '../ContractInfo/ContractInfo';
import Trade from './Trade';

export default function LiteTrade({wallet,specs,spec,onSpecChange,isPro,indexPrice}){
  const [curTab, setCurTab] = useState('trade');

  const switchTab = current => setCurTab(current);
  const tradeClassName = classNames('trade-position',curTab)
  return (
      <div className={tradeClassName}>
        <div className='header-top'>
          <div className='header'>
            <span className='trade' onClick={() => switchTab('trade')}>
              TRADE
            </span>
            {!isPro && <>
            <span
              className='position' onClick={() => switchTab('position')}>
              MY POSITION
            </span>
            <span className='history' onClick={() => switchTab('history')}>
              HISTORY
            </span>
            </>}
          </div>
        </div>
        <Trade wallet ={wallet}  spec={spec} specs={specs} indexPrice={indexPrice}  onSpecChange={onSpecChange}/>
        <Position  wallet ={wallet} spec={spec}/>
        <History wallet ={wallet} spec={spec} specs={specs} />
        <ContractInfo wallet={wallet} spec={spec}/>   
    </div> 
  )
}