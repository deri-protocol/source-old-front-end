
import LiteTrade from "../../../components/Trade/LiteTrade";
import './lite.less'
import './de-lite.less'

function Lite({lang}){

  return (
    <div className='trade-body'>
      <LiteTrade lang={lang}/>  
    </div>    
  )
}

export default Lite