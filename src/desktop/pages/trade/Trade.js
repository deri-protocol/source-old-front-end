import { useState ,useEffect,useCallback} from 'react'
import './Lite/Lite.less'
import Pro from './Pro/Pro';
import Lite from '../../../components/Lite/Lite';
import useDeriConfig from '../../../hooks/useDeriConfig';
import classNames from 'classnames';
import config from '../../../config.json'
import axios from 'axios'
import { DeriEnv, deriToNatural } from '../../../lib/web3js/indexV2';
import useInterval from '../../../hooks/useInterval';
import {observer, inject } from 'mobx-react';


const oracleConfig = config[DeriEnv.get()]['oracle']

function Trade({wallet,indexPrice}){
  const [curTab, setCurTab] = useState('lite')
  const [spec, setSpec] = useState({});
  const specs = useDeriConfig(wallet.detail)



  const switchTab = current => {
    setCurTab(current)
    if(current === 'pro') {
      document.querySelector('.desktop').style.minWidth = '1920px';
    } else {
      document.querySelector('.desktop').style.minWidth = 'inherit';
    }
  }

  const onSpecChange = spec => {
    setSpec(spec)
  }

  const tradeBodyClass =classNames('trade-body', curTab)


  useEffect(() => {
    if(spec.symbol){
      // indexPrice.start(spec.symbol)
    }
    return () => {
    };
  }, [spec.symbol]);


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
export default inject('wallet','indexPrice')(observer(Trade))