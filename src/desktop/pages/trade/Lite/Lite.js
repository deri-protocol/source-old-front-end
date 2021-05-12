import { useState ,useEffect} from 'react'
import useDeriConfig from '../../../../hooks/useDeriConfig';
import classNames from 'classnames';
import {observer, inject } from 'mobx-react';
import './lite.less'
import LiteTrade from '../../../../components/Trade/LiteTrade';
import Tab from '../Tab/Tab';



function Lite({wallet,indexPrice}){
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
    return () => {

    };
  }, [specs]);

  const props = {
    wallet,
    specs,
    spec ,
    onSpecChange,
    indexPrice
  }

  return (
    <div className='trade-body lite'>
      <Tab/>
      <LiteTrade {...props}/> 
    </div>
  )
}
export default inject('wallet','indexPrice')(observer(Lite))