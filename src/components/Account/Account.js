import React,{useState,useEffect,useContext} from 'react';
import { formatAddress } from '../../utils/utils';
import './account.less'
import { observer, inject } from 'mobx-react';


function Account({wallet}){
  const [btnText,setBtnText] = useState('Connect Wallet')

  const setAccountText = (detail) => {
    //如果用户选择的网络正确
    if(wallet.isConnected()){
      if(detail.supported) {
        setBtnText(<span>{detail.formatBalance} {detail.symbol} <span className='address'>{formatAddress(detail.account)}</span></span>)
      } else {
        setBtnText(<span className='no-supported'>Unsupported Chain ID {detail.chainId}!</span>)
      }
    } else {
      setBtnText('Connect Wallet')
    } 
  }


  useEffect(() => {
    const init = async () => {
      const detail = await wallet.connect()
      if(detail){
        setAccountText(detail)
      }
    }

    init();
    return () => {}
  }, [])

  useEffect(() => {
    setAccountText(wallet.detail)
    return () => {
    };
  }, [wallet.detail.account,wallet.detail.formatBalance]);


  return (
    <div className="connect">
      <div className="network-text-logo">
        <i className={wallet.detail.symbol}></i>
        <span className="logo-text">{wallet.detail.text}</span>
      </div>
      <div className="bg-btn">
        <button className="nav-btn connect-btn" onClick={wallet.connect}>
          {btnText}
        </button>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Account))