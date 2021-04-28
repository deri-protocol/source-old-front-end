import { useState ,useEffect} from 'react'

import TradeInfo from './TradeInfo';
import Position from './Position';
import History from './History';
import classNames from 'classnames';
import ContractInfo from '../ContractInfo/ContractInfo';

export default function Lite({wallet,specs,spec,onSpecChange}){
  const [curTab, setCurTab] = useState('tradeInfo');

  const tradeClazz = classNames('trade',{action : curTab === 'tradeInfo'})
  const posistionClazz = classNames('position',{action : curTab === 'position'})
  const histroyClazz = classNames('history',{action : curTab === 'history'})

  const tab1 = <TradeInfo wallet ={wallet}  spec={spec} specs={specs}   onSpecChange={onSpecChange}/>
  const tab2 = <Position  wallet ={wallet} spec={spec}/>
  const tab3 = <History wallet ={wallet} spec={spec} specs={specs} />

  const switchTab = current => setCurTab(current);

  return (
    <>
      <div className='trade-position'>
        <div className='header-top'>
          <div className='header'>
            <span className={tradeClazz} onClick={() => switchTab('tradeInfo')}>
              TRADE
            </span>
            <span
              className={posistionClazz} onClick={() => switchTab('position')}>
              MY POSITION
            </span>
            <span className={histroyClazz} onClick={() => switchTab('history')}>
              HISTORY
            </span>
          </div>
        </div>
        {curTab === 'tradeInfo' && tab1}
        {curTab === 'position' && tab2}
        {curTab === 'history' && tab3}
    </div>
    <ContractInfo wallet={wallet} spec={spec}/>    
  </>
  )
}