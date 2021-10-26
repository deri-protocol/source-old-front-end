import React, { useState } from 'react'
import moment from 'moment';
import CountDown from "../../../../components/Countdown/CountDown";
import Trading from "../../../../components/TradingMining/Trading";
import Staking from "../../../../components/TradingMining/Staking";
import './index.less'
export default function Index({lang}){
  const eventEndTimestamp = moment.utc('2021-10-13 10:00:00')
  const [timeover, setTimeover] = useState(eventEndTimestamp.isBefore(moment.utc()) ? true : false)
  return (
    <div className='trading-mining'>
      <div className='title'>{lang['title']}</div>
      <div className='count-down-box' style={{display : timeover ? 'none' : 'block'}}>
        <CountDown lang={lang}  onEnd={() => setTimeover(true)} lastTimestamp={eventEndTimestamp.unix()}/>
      </div>
      <div className='staking'>
        <Staking lang={lang} />
      </div>
      <div className='trading'>
        <Trading lang={lang} />
      </div>
    </div>
  )
}