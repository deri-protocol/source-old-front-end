import LiteTrade from '../../../../components/Trade/LiteTrade';
import Tab from '../Tab/Tab';
import './lite.less'



export default function Lite({lang}){

  return (
    <div className='trade-body lite'>
      <Tab lite={true}/>
      <LiteTrade lang={lang}/> 
    </div>
  )
}