import { useState } from 'react'

import TradeInfo from './TradeInfo';
import Position from './Position';
import History from './History';
import ContractInfo from '../ContractInfo/ContractInfo';
import classNames from 'classnames';

export default function Lite(){
  const [curTab, setCurTab] = useState('tradeInfo');
  const switchTab = current => setCurTab(current);

  const tradeClazz = classNames('trade',{action : curTab === 'tradeInfo'})
  const posistionClazz = classNames('position',{action : curTab === 'position'})
  const histroyClazz = classNames('history',{action : curTab === 'history'})
  return (
    <>
      <div className='trade-position'>
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
        {curTab === 'tradeInfo' && <TradeInfo/>}
        {curTab === 'position' && <Position/>}
        {curTab === 'history' && <History/>}
    </div>
    <ContractInfo/>
  </>
  )
}