import { useEffect } from 'react'


import TradingView from './TradingView'
import Reference from './Reference'
import './pro.less'
import LiteTrade from '../../../../components/Trade/LiteTrade'
import { inject, observer } from 'mobx-react'

function Pro({wallet,specs,spec,onSpecChange,indexPrice}){

  return (
    <div className='trade-pro'>
      <div className='left'>
        <LiteTrade wallet ={wallet} isPro={true} spec={spec} specs={specs} indexPrice={indexPrice}  onSpecChange={onSpecChange}/>
      </div>
      <div className='right'>
        <TradingView wallet={wallet} spec={spec} indexPrice={indexPrice}/>
        <Reference wallet={wallet} spec={spec}/>
      </div>
    </div>
  )
}

export  default inject('wallet','indexPrice')(observer(Pro))