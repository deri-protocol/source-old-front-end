import { useState ,useEffect} from 'react'
import useDeriConfig from '../../../../hooks/useDeriConfig';
import classNames from 'classnames';
import {observer, inject } from 'mobx-react';
import './lite.less'
import LiteTrade from '../../../../components/Trade/LiteTrade';
import Tab from '../Tab/Tab';
import { eqInNumber } from '../../../../utils/utils';



export default function Lite({wallet,indexPrice,position}){
  // const [spec, setSpec] = useState({});
  // const specs = useDeriConfig(wallet)


  // const onSpecChange = spec => {
  //   indexPrice.pause();
  //   setSpec(spec)
  // }



  // useEffect(() => {
  //   if(spec.symbol){
  //     indexPrice.start(spec.symbol)
  //   }
  //   return () => {
  //   };
  // }, [spec.symbol]);


  // useEffect(() => {
  //   if(specs.length > 0 && wallet.detail.chainId){
  //     const curSpecs = specs.filter(s => eqInNumber(s.chainId,wallet.detail.chainId))
  //     if(curSpecs.length > 0){
  //       setSpec(curSpecs[0]);   
  //       indexPrice.start(curSpecs[0].symbol)   
  //     }      
  //   }
  //   return () => {

  //   };
  // }, [wallet.detail.account,specs]);

  // useEffect(() => {
  //   // console.log(indexPrice.index)
  //   return () => {
  //   };
  // }, [indexPrice.index]);

  // const props = {
  //   wallet,
  //   specs,
  //   spec ,
  //   onSpecChange,
  //   indexPrice,
  //   position
  // }

  return (
    <div className='trade-body lite'>
      <Tab lite={true}/>
      <LiteTrade /> 
    </div>
  )
}
// export default inject('wallet','indexPrice','position')(observer(Lite))