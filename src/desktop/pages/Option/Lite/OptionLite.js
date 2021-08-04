import LiteTrade from '../../../../components/Trade/LiteTrade';
import AreaPicker from '../../../../components/AreaPicker/AreaPicker';
import Tab from '../Tab/Tab';
import './optionlite.less'
import './zh-lite.less'
import './de-lite.less'



export default function Lite({lang}){

  return (
    <div className='trade-container'>
      {/* <AreaPicker lang={lang}></AreaPicker> */}
      <div className='trade-body lite'>
          <Tab lite={true} lang={lang}/>
          <LiteTrade lang={lang} options={true} /> 
      </div>
    </div>
  )
}