import React, { useState } from 'react'
import moment from 'moment';
import CountDown from "../../../../components/Countdown/CountDown";
import Trading from "../../../../components/TradingMining/one/Trading";
import Claim from "../../../../components/TradingMining/one/Claim";
import Staking from "../../../../components/TradingMining/one/Staking";
import epochOne from '../../../../components/TradingMining/img/epochOne.svg'
import './index.less'
export default function Index({lang}){
  const eventEndTimestamp = moment.utc('2021-10-13 10:00:00')
  const [timeover, setTimeover] = useState(eventEndTimestamp.isBefore(moment.utc()) ? true : false)
  return (
    <div className='trading-mining'>
      <div className='title'>{lang['title']} <img src={epochOne} alt='' /></div>
      <div className='count-down-box' style={{display : timeover ? 'none' : 'block'}}>
        <CountDown lang={lang}  onEnd={() => setTimeover(true)} lastTimestamp={eventEndTimestamp.unix()}/>
      </div>
      {/* <div className='claim'>
        <Claim lang={lang}/>
      </div> */}
      <div className='staking'>
        <Staking lang={lang} />
      </div>
      <div className='trading'>
        <Trading lang={lang} />
      </div>
    </div>
  )
}