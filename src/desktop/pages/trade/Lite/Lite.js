import { useState ,useEffect} from 'react'
import ProTrade from '../Pro/Pro';
import useDeriConfig from '../../../../hooks/useDeriConfig';
import classNames from 'classnames';
import {observer, inject } from 'mobx-react';
import './lite.less'
import LiteTrade from '../../../../components/Trade/LiteTrade';



function Lite({wallet,indexPrice}){
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
    indexPrice.pause();
    setSpec(spec)
  }

  const tradeBodyClass =classNames('trade-body', curTab)


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
    <div className={tradeBodyClass}>
      <div className="check-lite-pro">
        <div className='lite' onClick={() => switchTab('lite')}>LITE</div>
        <div className='pro' onClick={() => switchTab('pro')}> PRO
        </div>
      </div>
      {curTab === 'lite' ? <LiteTrade {...props}/> : <ProTrade {...props}/>}
    </div>
  )
}
export default inject('wallet','indexPrice')(observer(Lite))