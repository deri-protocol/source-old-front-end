import { useState ,useContext} from 'react'
import './trade.less'
import Pro from './Pro';
import Lite from '../../../components/Lite/Lite';
import {WalletContext} from '../../../context/WalletContext'

export default function Trade(){
  const [curTab, setCurTab] = useState('lite')
  const context = useContext(WalletContext)

  const switchTab = current => {
    setCurTab(current)
  }

  const props = {
    wallet : context.walletContext.get()
  }

  return (
    <div className="trade-body">
      <div className="check-lite-pro">
        <div className="lite selected" onClick={() => switchTab('lite')}>LITE</div>
        <div className="pro" onClick={() => switchTab('pro')}> PRO
        </div>
      </div>
      {curTab === 'lite' ? <Lite {...props}/> : <Pro {...props}/>}
    </div>
  )
}