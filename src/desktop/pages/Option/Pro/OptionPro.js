import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/optionlite.less'
import '../Lite/zh-lite.less'
import './pro.less'
import './zh-pro.less'
import './de-pro.less'
import AreaPicker from '../../../../components/AreaPicker/AreaPicker'



function Pro({wallet,lang}){


  useEffect(() => {
    document.querySelector('.desktop').style.minWidth = '1903px';
    return () => { 
      document.querySelector('.desktop').style.minWidth = '';
    };
  }, [wallet.detail.account]);



  return (
    <div className='trade-container'>
      {/* <AreaPicker lang={lang}></AreaPicker> */}
      <div className='trade-body'>
        <Tab lang={lang}/>
        <div className='trade-pro'>
          <div className='left'>
            <LiteTrade isPro={true} lang={lang} options={true}/>
          </div>
          <div className='right'>
            <TradingView wallet={wallet} lang={lang} options={true}/>
            <Reference lang={lang} options={true} />
          </div>
      </div> 
    </div>
  </div>
  )
}
export  default inject('wallet')(observer(Pro))