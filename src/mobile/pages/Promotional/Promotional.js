import React, { useState } from 'react'
import { Link ,useRouteMatch} from 'react-router-dom'
import TradingMiningNow from '../Marketing/TradingMining/tradingMiningTwo'
import Index from '../Marketing/TradingMining/Index'
import './promotional.less'
import epochone from '../../../components/TradingMining/img/epochOne.svg'
export default function Promotional({ lang }) {
  const active = useRouteMatch('/trade-to-earn/finished') ? 'finished' : 'active'
  const [curTab, setCurTab] = useState(active)
  const switchTab = async (current) => {
    setCurTab(current)
  }
  return (
    <div className='promotional'>
      <div className='check'>
        {/* <div className={curTab === 'upcoming' ? 'checked-now' : ''} onClick={() => switchTab('upcoming')}>upcoming</div>
         */}
         <div className={curTab === 'upcoming'  ? 'checked-now' : ''}>
         <a  href='https://v3app.deri.finance/#/trade-to-earn'>upcoming</a> 
        </div>
        <div className={curTab === 'active' ? 'checked-now' : ''} onClick={() => switchTab('active')}>active</div>
        <div className={curTab === 'finished' ? 'checked-now' : ''} onClick={() => switchTab('finished')}>finished</div>
      </div>
      {curTab === 'active' && <div className='now-prom'>
        <TradingMiningNow lang={lang} />
      </div>}
      {curTab === 'finished' && <div className='closed'>
        <Link to='/trading-to-earn-finshed-one'>
          <div>Trade to Earn <img alt='' src={epochone} /></div>
          <div className='finshed-title'>10:00 AM, October 13th to 09:59:59 AM, November 10th UTC</div>
        </Link>
      </div>}
      {curTab === 'upcoming' && <div className='upcoming'>
        {/* <TradingMiningNow lang={lang} /> */}
        No data
      </div>}
    </div>
  )
}