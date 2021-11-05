import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import TradingMiningNow from '../Marketing/TradingMining/tradingMiningTwo'
export default function Promotional({ lang }) {
  const [curTab, setCurTab] = useState(true) 
  const switchTab = async (current) => {
    setCurTab(current)
  }
  return (
    <div className='promotional'>
      <div className='check'>
        <div className={curTab ? 'checked-now' : ''} onClick={() => switchTab(true)}>activite</div>
        <div className={curTab ? '' : 'checked-now'} onClick={() => switchTab(false)}>finshed</div>
      </div>
      {curTab && <div>
        <TradingMiningNow lang={lang} />
      </div>}
      {!curTab && <div>
        <Link to='/trading-to-earn-his'></Link>
      </div>}
    </div>
  )
}