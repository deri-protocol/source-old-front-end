import LiteTrade from '../../../../components/Trade/LiteTrade';
import Tab from '../Tab/Tab';
import './lite.less'
import './zh-lite.less'
import './de-lite.less'



export default function Lite({lang}){

  return (
    <div className='trade-body lite'>
      <Tab lite={true} lang={lang}/>
      <LiteTrade lang={lang}/> 
    </div>
  )
}