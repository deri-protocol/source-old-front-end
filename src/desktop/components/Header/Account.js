import React,{useState,useEffect} from 'react';
import {
  connectWallet,
  hasWallet
} from '../../../lib/web3js/index'
import walletManager from '../../../lib/account/WalletManager';
import { formatAddress } from '../../../utils/utils';
import './account.less'

export default function Account(){
  const [wallet, setWallet] = useState({});
  let [wCText,setWCText] = useState('Connect Wallet')

  const wc = async () => {
    const res = await connectWallet();
    if(res && res.success){
      const {chainId,account} = res;
      const wallet = await walletManager.setWallet(chainId,account);
      if(wallet){
        setWallet(wallet);
        const address = formatAddress(wallet.address)
        const btn = <span>{wallet.balance} {wallet.symbol} <span className='address'>{address}</span></span>
        setWCText(btn)
      } else {
        setWCText(<span className='no-supported'>Unsupported Chain ID {chainId}!</span>)
      }
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