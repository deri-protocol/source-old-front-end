import React, { useState } from 'react'
import Trading from "../../../../components/TradingMining/two/Trading";
import Staking from "../../../../components/TradingMining/two/Staking";
import CountDown from "../../../../components/Countdown/CountDown";
import './index.less'
import './index-two.less'
import epochTwo from '../../../../components/TradingMining/img/epochTwo.svg'
import moment from 'moment';
export default function Index({lang}){
  const eventEndTimestamp = moment.utc('2021-11-10 10:00:00')
  const [timeover, setTimeover] = useState(eventEndTimestamp.isBefore(moment.utc()) ? true : false)
  return (
    <div className='trading-mining'>
      <div className='title'>{lang['title']} <img src={epochTwo} alt='' /> </div>
      <div className='count-down-box' style={{display : timeover ? 'none' : 'block'}}>
        <CountDown lang={lang}  onEnd={() => setTimeover(true)} lastTimestamp={eventEndTimestamp.unix()}/>
      </div>
      <div className='staking'>
        <Staking lang={lang} />
      </div>
      <div>
        {/* <TotalPoints lang={lang} /> */}
      </div>
      <div className='trading'>
        <Trading lang={lang} /> 
      </div>
    </div>
  )
}