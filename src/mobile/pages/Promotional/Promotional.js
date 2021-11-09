import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TradingMiningNow from '../Marketing/TradingMining/tradingMiningTwo'
import Index from '../Marketing/TradingMining/Index'
import './promotional.less'
import epochone from '../../../components/TradingMining/img/epochOne.svg'
export default function Promotional({ lang }) {
  const [curTab, setCurTab] = useState('activeite') 
  const switchTab = async (current) => {
    setCurTab(current)
  }
  return (
    <div className='promotional'>
      <div className='check'>
      <div className={curTab === 'upcoming'  ? 'checked-now' : ''} onClick={() => switchTab('upcoming')}>upcoming</div>
        <div className={curTab === 'activeite' ? 'checked-now' : ''} onClick={() => switchTab('activeite')}>activite</div>
        <div className={curTab === 'finshed' ? 'checked-now' : ''} onClick={() => switchTab('finshed')}>finshed</div>
      </div>
      {curTab === 'activeite' && <div className='now-prom'>
        <Index lang={lang} />
      </div>}
      {curTab === 'finshed' && <div className='closed'>
        {/* <Link to='/trading-to-earn-finshed-one'>
          <div className='finshed-title'>10:00 AM, October 13th to 09:59:59 AM, November 10th UTC</div>
          <div>Trade to Earn <img alt='' src={epochone} /></div>
        </Link> */}
        No data
      </div>}
      {curTab === 'upcoming' && <div className='upcoming'>
        <TradingMiningNow lang={lang} />
      </div>}
    </div>
  )
}