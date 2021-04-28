import './pro.less'
import Lite from '../../../components/Lite/Lite'

export  default function Pro({wallet,specs,spec,onSpecChange}){

  return (
    <div className='trade-pro'>
      <div className='left'>
        <Lite wallet ={wallet}  spec={spec} specs={specs}   onSpecChange={onSpecChange}/>
      </div>
      <div className='right'></div>
    </div>
  )
}