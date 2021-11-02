import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/lite.less'
import '../Lite/zh-lite.less'
import '../Lite/fa-lite.less'
import './pro.less'
import './zh-pro.less'
import './de-pro.less'
import AreaPicker from '../../../../components/AreaPicker/AreaPicker'
import { useRouteMatch } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'



function Pro({wallet,lang,type,version}){
  const location = useLocation();
  const isV1Router = location.pathname.split('/')[3]
  if(isV1Router === 'v1'){
    version.setCurrent('v1')
  } else {
    if(version.isV1){
      version.setCurrent('v2')
    }
  }
  useEffect(() => {
    document.querySelector('.desktop').style.minWidth = '1903px';
    return () => { 
      document.querySelector('.desktop').style.minWidth = '';
    };
  }, [wallet.detail.account]);

  return (
    <div className='trade-container'>
      <AreaPicker lang={lang} ></AreaPicker>
      <div className='trade-body'>
        <Tab lang={lang} />
        <div className='trade-pro'>
          <div className='left'>
            <LiteTrade isPro={true} lang={lang} />
          </div>
          <div className='right'>
            <TradingView wallet={wallet} lang={lang} />
            <Reference lang={lang} type={type} />
          </div>
      </div> 
    </div>
  </div>
  )
}
export  default inject('wallet','type','version')(observer(Pro))