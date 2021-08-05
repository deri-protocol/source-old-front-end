
import LiteTrade from "../../../components/Trade/LiteTrade";
import './lite.less'
import './zh-lite.less'
import './de-lite.less'
import AreaPicker from "../../../components/AreaPicker/AreaPicker";

function Lite({lang}){

  return (
    <div className='trade-container'>
      <AreaPicker lang={lang}/>
      <div className='trade-body'>
        <LiteTrade lang={lang} options={false}/>  
      </div>
    </div>    
  )
  
}

export default Lite