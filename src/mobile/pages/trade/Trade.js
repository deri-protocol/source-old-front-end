
import { useState ,useContext,useEffect,useCallback} from 'react'
import config from '../../../config.json'
import axios from 'axios'
import { DeriEnv, deriToNatural } from '../../../lib/web3js';
import useInterval from '../../../hooks/useInterval';
import Lite from "../../../components/Lite/Lite";
import './trade.less'
import { inject, observer } from 'mobx-react';
import useDeriConfig from '../../../hooks/useDeriConfig.js';

const oracleConfig = config[DeriEnv.get()]['oracle']

function Trade({wallet}){
  const [spec, setSpec] = useState({});  
  const [indexPrice, setIndexPrice] = useState('-'); 
  const specs = useDeriConfig(wallet.detail)


  const onSpecChange = spec => {
    setSpec(spec)
  }


  //价格指数
  const loadIndexPrice = useCallback(
    async () => {
      if(spec && spec.symbol){
        const url = oracleConfig[spec.symbol.toUpperCase()]
        const res = await axios.get(url,{params:{symbol:spec.symbol}});
        if(res && res.data){
          setIndexPrice(+deriToNatural(res.data.price));
        }
      }
    },
    [indexPrice,spec],
  )

  // useInterval(loadIndexPrice,1000)

  useEffect(() => {
    loadIndexPrice();
    return () => {
    };
  }, [indexPrice,spec]);


  useEffect(() => {
    if(specs.length > 0){
      setSpec(specs[0]);      
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
      <Lite {...props}/>  
    </div>    
  )
}

export default inject('wallet')(observer(Trade))