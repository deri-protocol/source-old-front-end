import React,{useState,useEffect} from 'react';
import { formatAddress } from '../../utils/utils';
import './account.less'
import { observer, inject } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';


function Account({wallet,lang}){
  const [btnText,setBtnText] = useState(lang['connect-wallet'])
  const isIndex = useRouteMatch('/index')
  const isRoot = useRouteMatch({path: '/',exact : true})
  const isMining = useRouteMatch({path: '/mining',exact : true});
  const isTeam = useRouteMatch('/team')
  const isRetired = useRouteMatch('/retired')

  const notConnectWalletPage  = isIndex || isMining || isTeam || isRoot || isRetired
  


  const setAccountText = (detail) => {
    //如果用户选择的网络正确
    if(wallet.isConnected()){
      if(detail.supported) {
        setBtnText(<span>{detail.formatBalance} {detail.symbol} <span className='address'>{formatAddress(detail.account)}</span></span>)
      } else {
      setBtnText(<span className='no-supported'>{lang['unsupported-chain-id']}{detail.chainId}!</span>)
      }
    } else {
      setBtnText(lang['connect-wallet'])
    } 
  }


  useEffect(() => {
    const init = async () => {
      const detail = await wallet.connect()
      if(detail){
        setAccountText(detail)
      }
    }
    // const isApp = isLite || isPro || isMiningDetail

    if(!notConnectWalletPage){
      init();
    }
    return () => {}
  }, [window.location.href])

  useEffect(() => {
    setAccountText(wallet.detail)
    return () => {
    };
  }, [wallet.detail.account,wallet.detail.formatBalance,lang]);
  const addNetwork = () => {
    const params = [{
      chainId: '0x1e',
      chainName: 'RSK Mainnet',
      nativeCurrency: {
        name: 'RSK BTC',
        symbol: 'RBTC',
        decimals: 18
      },
      rpcUrls: ['https://public-node.rsk.co'],
      blockExplorerUrls: ['https://explorer.rsk.co']
    }]
  
    window.ethereum.request({ method: 'wallet_addEthereumChain', params })
      .then(() => console.log('Success'))
      .catch((error) => console.log("Error", error.message))
  }

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${(56).toString(16)}`}],
      });
    } catch (error) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (error.code === 4902) {
        // try {
        //   await window.ethereum.request({
        //     method: 'wallet_addEthereumChain',
        //     params: [{ chainId: '0xf00', rpcUrl: 'https://...' /* ... */ }],
        //   });
        // } catch (addError) {
        //   // handle "add" error
        // }
      }
      // handle other "switch" errors
    }
  }


  return !notConnectWalletPage && (
    <div className="connect">
      {/* <button onClick={addNetwork}>Add RSK Mainnet to Metamask</button> */}
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