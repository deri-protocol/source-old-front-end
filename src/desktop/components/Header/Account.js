import React,{useState,useEffect,useContext} from 'react';
import {
  hasWallet
} from '../../../lib/web3js/index'
import { formatAddress } from '../../../utils/utils';
import './account.less'
import { WalletContext } from '../../../context/WalletContext';

export default function Account(){
  const [btnText,setBtnText] = useState('Connect Wallet')
  const {walletContext} = useContext(WalletContext);
  const [wallet, setWallet] = useState({});


  const setAccountText = (wallet = {}) => {
    //如果用户选择的网络正确
    if(wallet && wallet.account){
      if(wallet.supported){
        setBtnText(<span>{wallet.formatBalance} {wallet.symbol} <span className='address'>{formatAddress(wallet.account)}</span></span>)
      } else {
        setBtnText(<span className='no-supported'>Unsupported Chain ID {wallet.chainId}!</span>)
      }
    }
  }

  const wc = async () => {
    const w = await walletContext.connect();
    setWallet(w);
    setAccountText(w);
  }

  //连接钱包
  const walletCollectClick = async () => {
    if(hasWallet()){
      wc();
    }
  }

  useEffect(() => {
    const init = async () => {
      if(walletContext.isConnected()){
        const c = walletContext.get() || {};
        if(c.account){
          wc();
        }
      }
    }

    init();
    return () => {}
  }, [])


  return(
    <div className="connect">
      <div className="network-text-logo">
        <i className={wallet.symbol}></i>
        <span className="logo-text">{wallet.text}</span>
      </div>
      <div className="bg-btn">
        <button className="nav-btn connect-btn" onClick={walletCollectClick}>
          {btnText}
        </button>
      </div>
    </div>
  )
}