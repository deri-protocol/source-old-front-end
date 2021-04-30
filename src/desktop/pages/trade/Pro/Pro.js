import './pro.less'
import Lite from '../../../../components/Lite/Lite'
import TradingView from './TradingView'
import Reference from './Reference'

export  default function Pro({wallet,specs,spec,onSpecChange,indexPrice}){

  return (
    <div className='trade-pro'>
      <div className='left'>
        <Lite wallet ={wallet} isPro={true} spec={spec} specs={specs} indexPrice={indexPrice}  onSpecChange={onSpecChange}/>
      </div>
      <div className='right'>
          <TradingView wallet={wallet} spec={spec} indexPrice={indexPrice}/>
          <Reference wallet={wallet} spec={spec}/>
        </div>
    </div>
  )
}