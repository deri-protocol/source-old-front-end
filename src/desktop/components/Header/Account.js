import React,{useState,useEffect,useContext} from 'react';
import {
  hasWallet
} from '../../../lib/web3js/index'
import walletManager from '../../../lib/account/WalletManager';
import { formatAddress } from '../../../utils/utils';
import './account.less'
import { WalletContext } from '../../../context/WalletContext';

export default function Account(){
  let [wCText,setWCText] = useState('Connect Wallet')
  const {walletContext} = useContext(WalletContext);
  const [wallet, setWallet] = useState({});

  const wc = async () => {
    const w = await walletContext.connect();
    setWallet(w);
    if(w.symbol){
      const formatAccount = formatAddress(w.account)
      const btn = <span>{w.formatBalance} {w.symbol} <span className='address'>{formatAccount}</span></span>
      setWCText(btn)
    } else {
      setWCText(<span className='no-supported'>Unsupported Chain ID {w.chainId}!</span>)
    }
  }

  //连接钱包
  const walletCollectClick = async () => {
    if(hasWallet()){
      wc();
    }
  }

  useEffect(() => {
    const init = async () => {
      if(walletManager.isConnected()){
        wc();
      }
    }
    init();
    return () => {
      wCText = 'Connect Wallet'
    }
  }, [])


  return(
    <div className="connect">
      <div className="network-text-logo">
        <i className={wallet.symbol}></i>
        <span className="logo-text">{wallet.symbol}</span>
      </div>
      <div className="bg-btn">
        <button className="nav-btn connect-btn" onClick={walletCollectClick}>
          {wCText}
        </button>
      </div>
    </div>
  )
}