
import { useState ,useEffect,useCallback} from 'react'
import config from '../../../config.json'
import axios from 'axios'
import { DeriEnv, deriToNatural } from '../../../lib/web3js/indexV2';
import LiteTrade from "../../../components/Trade/LiteTrade";
import './trade.less'
import { inject, observer } from 'mobx-react';
import useDeriConfig from '../../../hooks/useDeriConfig.js';

const oracleConfig = config[DeriEnv.get()]['oracle']

function Trade({wallet,indexPrice}){
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
    <div className='trade-body'>
      <LiteTrade {...props}/>  
    </div>    
  )
}

export default inject('wallet','indexPrice')(observer(Trade))