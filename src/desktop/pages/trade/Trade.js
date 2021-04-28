import { useState ,useContext,useEffect} from 'react'
import './trade.less'
import Pro from './Pro';
import Lite from '../../../components/Lite/Lite';
import {WalletContext} from '../../../context/WalletContext'
import useTransactionSymbol from '../../../hooks/useTransactionSymbol';
import classNames from 'classnames';

export default function Trade(){
  const [curTab, setCurTab] = useState('lite')
  const context = useContext(WalletContext)
  const wallet = context.walletContext.get();
  const [spec, setSpec] = useState({});
  const specs = useTransactionSymbol(wallet)

  const switchTab = current => {
    setCurTab(current)
  }

  const onSpecChange = spec => {
    setSpec(spec)
  }

  const tradeBodyClass =classNames('trade-body', curTab)


  useEffect(() => {
    if(specs.length > 0){
      setSpec(specs[0]);      
    }
    return () => {

    };
  }, [specs]);

  const props = {
    wallet,
    specs,
    spec ,
    onSpecChange
  }

  return (
    <div className={tradeBodyClass}>
      <div className="check-lite-pro">
        <div className='lite' onClick={() => switchTab('lite')}>LITE</div>
        <div className='pro' onClick={() => switchTab('pro')}> PRO
        </div>
      </div>
      {curTab === 'lite' ? <Lite {...props}/> : <Pro {...props}/>}
    </div>
  )
}