
import LiteTrade from "../../../components/Trade/LiteTrade";
import './lite.less'
import './zh-lite.less'
import './de-lite.less'
import AreaPicker from "../../../components/AreaPicker/AreaPicker";
import { useRouteMatch } from 'react-router-dom';

function Lite({lang}){
  const isOptions = useRouteMatch('/options/lite') ? true : false
  return (
    <div className='trade-container'>
      <AreaPicker lang={lang} options={isOptions}/>
      <div className='trade-body'>
        <LiteTrade lang={lang} options={isOptions}/>  
      </div>
    </div>    
  )
  
}

export default Lite