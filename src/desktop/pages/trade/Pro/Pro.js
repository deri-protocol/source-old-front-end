import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/lite.less'
import './pro.less'



function Pro({wallet,lang}){


  useEffect(() => {
    document.querySelector('.desktop').style.minWidth = '1920px';
    return () => { 
      document.querySelector('.desktop').style.minWidth = '';
    };
  }, [wallet.detail.account]);



  return (
    <div className='trade-body'>
      <Tab lang={lang}/>
      <div className='trade-pro'>
        <div className='left'>
          <LiteTrade isPro={true} lang={lang}/>
        </div>
        <div className='right'>
          <TradingView wallet={wallet} lang={lang}/>
          <Reference lang={lang}/>
        </div>
    </div> 
  </div>
  )
}
export  default inject('wallet')(observer(Pro))