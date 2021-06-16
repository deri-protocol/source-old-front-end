
import LiteTrade from "../../../components/Trade/LiteTrade";
import './lite.less'

function Lite({lang}){

  return (
    <div className='trade-body'>
      <LiteTrade lang={lang}/>  
    </div>    
  )
}

export default Lite