import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import useDeriConfig from '../../../../hooks/useDeriConfig';
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/lite.less'
import './pro.less'



function Pro({wallet,indexPrice}){
  const [spec, setSpec] = useState({});
  const specs = useDeriConfig(wallet.detail)

  const onSpecChange = spec => {
    indexPrice.pause();
    setSpec(spec)
  }



  useEffect(() => {
    if(spec.symbol){
      indexPrice.start(spec.symbol)
    }
    return () => {
    };
  }, [spec.symbol]);


  useEffect(() => {
    if(specs.length > 0){
      setSpec(specs[0]);   
      indexPrice.start(specs[0].symbol)   
    }
    document.querySelector('.desktop').style.minWidth = '1920px';
    return () => {};
  }, [specs]);


  return (
    <div className='trade-body pro'>
      <Tab/>
      <div className='trade-pro'>
        <div className='left'>
          <LiteTrade wallet ={wallet} isPro={true} spec={spec} specs={specs} indexPrice={indexPrice}  onSpecChange={onSpecChange}/>
        </div>
        <div className='right'>
          <TradingView wallet={wallet} spec={spec} indexPrice={indexPrice}/>
          <Reference wallet={wallet} spec={spec}/>
        </div>
    </div> 
  </div>
  )
}
export  default inject('wallet','indexPrice')(observer(Pro))