import { useState } from 'react'
import './trade.less'
import Pro from './Pro';
import Lite from '../../../components/Lite/Lite';

export default function Trade(){
  const [curTab, setCurTab] = useState('lite')

  const switchTab = current => {
    setCurTab(current)
  }

  return (
    <div className="trade-body">
      <div className="check-lite-pro">
        <div className="lite selected" onClick={() => switchTab('lite')}>LITE</div>
        <div className="pro" onClick={() => switchTab('pro')}> PRO
        </div>
      </div>
      {curTab === 'lite' ? <Lite/> : <Pro/>}
    </div>
  )
}