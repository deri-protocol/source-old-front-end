import CountDown from "../../../../components/Countdown/CountDown";
import Trading from "../../../../components/TradingMining/Trading";
import Staking from "../../../../components/TradingMining/Staking";
import './index.less'
export default function Index({lang}){
  return (
    <div className='trading-mining'>
      <div className='title'>{lang['title']}</div>
      <div className='count-down-box'>
        <CountDown lang={lang}/>
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