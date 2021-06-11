import { useState ,useEffect} from 'react'
import Position from './Position';
import History from './History';
import classNames from 'classnames';
import ContractInfo from '../ContractInfo/ContractInfo';
import Trade from './Trade';
import { inject, observer } from 'mobx-react';
import useLang from '../../hooks/useLang';

function LiteTrade({wallet,trading,isPro,lang}){
  const [curTab, setCurTab] = useState('trade');
  // const dict = useLang(intl.dict,'lite')


  // useEffect(() => {
  //   if(wallet.detail.account){
  //     trading.init(wallet)
  //   }
  // },[wallet.detail.account])



  const switchTab = current => setCurTab(current);
  const tradeClassName = classNames('trade-position',curTab)


  return (
      <div className={tradeClassName}>
        <div className='header-top'>
          <div className='header'>
            <span className='trade'  onClick={() => switchTab('trade')}>
              TRADE
            </span>
            {!isPro && <>
            <span
              className='pc position' onClick={() => switchTab('position')}>
              MY POSITION
            </span>
            <span
              className='mobile position' onClick={() => switchTab('position')}>
              POSITION
            </span>
            <span className='history' onClick={() => switchTab('history')}>
              HISTORY
            </span>
            </>}
          </div>
        </div>
        <Trade lang={lang}/>
        <Position/>
        <History wallet ={wallet} spec={trading.config} specs={trading.configs} />
        <ContractInfo />   
    </div> 
  )
}

export default inject('wallet','trading')(observer(LiteTrade))