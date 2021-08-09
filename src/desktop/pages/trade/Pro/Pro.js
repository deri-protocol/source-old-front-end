import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/lite.less'
import '../Lite/zh-lite.less'
import './pro.less'
import './zh-pro.less'
import './de-pro.less'
import AreaPicker from '../../../../components/AreaPicker/AreaPicker'
import { useRouteMatch } from 'react-router-dom';



function Pro({wallet,lang}){
  const isOptions = useRouteMatch('/options/pro') ? true : false


  useEffect(() => {
    document.querySelector('.desktop').style.minWidth = '1903px';
    return () => { 
      document.querySelector('.desktop').style.minWidth = '';
    };
  }, [wallet.detail.account]);



  return (
    <div className='trade-container'>
      <AreaPicker lang={lang} options={isOptions}></AreaPicker>
      <div className='trade-body'>
        <Tab lang={lang} options={isOptions}/>
        <div className='trade-pro'>
          <div className='left'>
            <LiteTrade isPro={true} lang={lang} options={isOptions}/>
          </div>
          <div className='right'>
            <TradingView wallet={wallet} lang={lang} options={isOptions}/>
            <Reference lang={lang} options={isOptions}/>
          </div>
      </div> 
    </div>
  </div>
  )
}
export  default inject('wallet')(observer(Pro))