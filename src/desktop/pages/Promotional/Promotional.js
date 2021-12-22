import React, { useState } from 'react'
import { Link ,useRouteMatch} from 'react-router-dom'
import TradingMiningNow from '../Marketing/TradingMining/tradingMiningTwo'
import Index from '../Marketing/TradingMining/Index'
import './promotional.less'
import epochone from '../../../components/TradingMining/img/epochOne.svg'
import epochtwo from '../../../components/TradingMining/img/epochTwo.svg'
export default function Promotional({ lang }) {
  const active = useRouteMatch('/trade-to-earn/finished') ? 'finished' : 'upcoming'
  const [curTab, setCurTab] = useState(active) 
  const switchTab = async (current) => {
    setCurTab(current)
  }
  return (
    <div className='promotional'>
      <div className='check'>
        <div className={curTab === 'upcoming'  ? 'checked-now' : ''} onClick={() => switchTab('upcoming')}>upcoming
        </div>
        {/* <div className={curTab === 'active' ? 'checked-now' : ''} onClick={() => switchTab('active')}>active</div>
         */}
         <div className={curTab === 'active' ? 'checked-now' : ''}>
         <a  href='https://app.deri.finance/#/trade-to-earn'> active </a> 
         </div>
        <div className={curTab === 'finished' ? 'checked-now' : ''} onClick={() => switchTab('finished')}>finished</div>
      </div>
      {/* {curTab === 'active' && <div className='now-prom'>
        <TradingMiningNow lang={lang} />
      </div>} */}
      {curTab === 'finished' && <div className='closed'>
        <Link to='/trading-to-earn-finshed-one'>
          <div className='finshed-title'>10:00 AM, October 13th to 09:59:59 AM, November 10th UTC</div>
          <div>Trade to Earn <img alt='' src={epochone} /></div>
        </Link>
        <Link to='/trading-to-earn-finshed-two'>
          <div className='finshed-title'>10:00 AM, November 10th to 09:59:59 AM, December 8th UTC</div>
          <div>Trade to Earn <img alt='' src={epochtwo} /></div>
        </Link>
      </div>}
      {curTab === 'upcoming' && <div className='upcoming'>
        {/* <TradingMiningNow lang={lang} /> */}
        No data
      </div>}
    </div>
  )
}