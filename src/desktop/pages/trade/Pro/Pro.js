import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import useDeriConfig from '../../../../hooks/useDeriConfig';
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/lite.less'
import './pro.less'
import { eqInNumber } from '../../../../utils/utils';



function Pro({wallet}){
  // const [spec, setSpec] = useState({});
  // const specs = useDeriConfig(wallet)


  // const onSpecChange = spec => {
  //   setSpec(spec)
  // }



  // useEffect(() => {
  //   if(spec.symbol){
  //     indexPrice.start(spec.symbol)
  //   }
  //   return () => {
  //   };
  // }, [spec.symbol]);


  useEffect(() => {
    document.querySelector('.desktop').style.minWidth = '1920px';
    // if(specs.length > 0 && wallet.detail.chainId){
    //   const curSpecs = specs.filter(s => eqInNumber(s.chainId,wallet.detail.chainId))
    //   if(curSpecs.length > 0){
    //     setSpec(curSpecs[0]);   
    //     // indexPrice.start(curSpecs[0].symbol)   
    //   }      
    // }
    return () => { 
      document.querySelector('.desktop').style.minWidth = '';
    };
  }, [wallet.detail.account]);



  return (
    <div className='trade-body'>
      <Tab/>
      <div className='trade-pro'>
        <div className='left'>
          <LiteTrade isPro={true}/>
        </div>
        <div className='right'>
          <TradingView wallet={wallet}/>
          <Reference/>
        </div>
    </div> 
  </div>
  )
}
export  default inject('wallet')(observer(Pro))
// export default Pro