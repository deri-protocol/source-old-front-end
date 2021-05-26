import { useState ,useEffect} from 'react'
import TradingView from './TradingView'
import Reference from './Reference'
import { inject, observer } from 'mobx-react'
import LiteTrade from '../../../../components/Trade/LiteTrade'
import Tab from '../Tab/Tab'
import '../Lite/lite.less'
import './pro.less'



function Pro({wallet}){


  useEffect(() => {
    document.querySelector('.desktop').style.minWidth = '1920px';
    return () => { 
      document.querySelector('.desktop').style.minWidth = '';
    };
  }, [wallet.detail.account]);



  return (
    <div className='trade-body'>
      <Tab/>
      <div className='trade-pro'>
        <div className='left'>
          <LiteTrade isPro={true}/>
        </div>
        <div className='right'>
          <TradingView wallet={wallet}/>
          <Reference/>
        </div>
    </div> 
  </div>
  )
}
export  default inject('wallet')(observer(Pro))