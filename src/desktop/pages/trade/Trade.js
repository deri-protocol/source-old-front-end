import { useState ,useContext,useEffect,useCallback} from 'react'
import './trade.less'
import Pro from './Pro/Pro';
import Lite from '../../../components/Lite/Lite';
import {WalletContext} from '../../../context/WalletContext'
import useTransactionSymbol from '../../../hooks/useTransactionSymbol';
import classNames from 'classnames';
import config from '../../../config.json'
import axios from 'axios'
import { DeriEnv, deriToNatural } from '../../../lib/web3js';
import useInterval from '../../../hooks/useInterval';

const oracleConfig = config[DeriEnv.get()]['oracle']

export default function Trade(){
  const [curTab, setCurTab] = useState('lite')
  const [spec, setSpec] = useState({});
  const [indexPrice, setIndexPrice] = useState('-');
  const context = useContext(WalletContext)
  const wallet = context.walletContext.get() || {};  
  const specs = useTransactionSymbol(wallet)



  const switchTab = current => {
    setCurTab(current)
  }

  const onSpecChange = spec => {
    setSpec(spec)
  }

  const tradeBodyClass =classNames('trade-body', curTab)


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

  useInterval(loadIndexPrice,1000)

  useEffect(() => {
    loadIndexPrice();
    return () => {
    };
  }, [loadIndexPrice]);


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
    <div className={tradeBodyClass}>
      <div className="check-lite-pro">
        <div className='lite' onClick={() => switchTab('lite')}>LITE</div>
        <div className='pro' onClick={() => switchTab('pro')}> PRO
        </div>
      </div>
      {curTab === 'lite' ? <Lite {...props}/> : <Pro {...props}/>}
    </div>
  )
}