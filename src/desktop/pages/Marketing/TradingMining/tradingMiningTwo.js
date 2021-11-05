import React, { useState } from 'react'
import Trading from "../../../../components/TradingMining/Trading";
import Staking from "../../../../components/TradingMining/Staking";
import TotalPoints from "../../../../components/TradingMining/TotalPoints";
import './index.less'
import moment from 'moment';
export default function Index({lang}){
  return (
    <div className='trading-mining'>
      <div className='title'>{lang['title']}</div>
      <div className='staking'>
        <Staking lang={lang} />
      </div>
      <div>
        <TotalPoints lang={lang} />
      </div>
      <div className='trading'>
        <Trading lang={lang} /> 
      </div>
    </div>
  )
}