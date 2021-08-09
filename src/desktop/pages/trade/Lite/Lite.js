import LiteTrade from '../../../../components/Trade/LiteTrade';
import AreaPicker from '../../../../components/AreaPicker/AreaPicker';
import Tab from '../Tab/Tab';
import './lite.less'
import './zh-lite.less'
import './de-lite.less'
import { useRouteMatch } from 'react-router-dom';



export default function Lite({lang}){
  const isOptions = useRouteMatch('/options/lite') ? true : false
  return (
    <div className='trade-container'>
      <AreaPicker lang={lang} options={isOptions}></AreaPicker>
      <div className='trade-body lite'>
          <Tab lite={true} lang={lang} options={isOptions}/>
          <LiteTrade lang={lang} options={isOptions}/> 
      </div>
    </div>
  )
}