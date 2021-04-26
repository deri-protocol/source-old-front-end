import { useState } from 'react'

import TradeInfo from './TradeInfo';
import Position from './Position';
import History from './History';
import classNames from 'classnames';
import ContractInfo from '../ContractInfo/ContractInfo';
import useTransactionSymbol from '../../hooks/useTransactionSymbol';

export default function Lite({wallet}){
  const [curTab, setCurTab] = useState('tradeInfo');
  const [curSpec, setCurSpec] = useState({});
  const symbols = useTransactionSymbol(wallet)

  const switchTab = current => setCurTab(current);
  const tradeClazz = classNames('trade',{action : curTab === 'tradeInfo'})
  const posistionClazz = classNames('position',{action : curTab === 'position'})
  const histroyClazz = classNames('history',{action : curTab === 'history'})

  const onSpecChange = spec => {
    setCurSpec(spec)
  }
  

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
        {curTab === 'tradeInfo' && <TradeInfo wallet ={wallet} symbols={symbols} onSpecChange={onSpecChange}/>}
        {curTab === 'position' && <Position/>}
        {curTab === 'history' && <History/>}
    </div>
    <ContractInfo wallet={wallet} spec={curSpec}/>    
  </>
  )
}