import Web3 from 'web3';
import { metaMaskWeb3 } from '../factory/web3';
import { hexToNumber } from '../utils';

export const hasWallet = () => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    return { success: true, isMetaMask: true };
  }
  return {
    success: false,
    error:
      'The browser is not support ethereum wallet, please install MetaMask to proceed.',
  };
};

export const connectWallet = async (
  handleChainChanged,
  handleAccountChanged
) => {
  if (typeof window.ethereum !== undefined) {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    //console.log('accounts', accounts);
    // const chainId = parseInt(
    //   await window.ethereum.request({ method: 'net_version' })
    // );
    const chainId = hexToNumber(
      await window.ethereum.request({ method: 'eth_chainId' })
    );
    //console.log('chainId', chainId);
    const account = Array.isArray(accounts) && accounts[0];

    // await web3.eth.requestAccounts().then(console.log)
    window.ethereum.on('accountsChanged', (accounts) => {
      let account;
      if (accounts.length > 0) {
        account = accounts[0];
      } else {
        account = '';
      }
      if (typeof handleAccountChanged === 'function') {
        handleAccountChanged(account);
      } else {
        window.location.reload();
      }
      //console.log('accountChanged', account);
    });
    window.ethereum.on('chainChanged', (chainId) => {
      let res = hexToNumber(chainId);
      if (typeof handleChainChanged === 'function') {
        handleChainChanged(res);
      } else {
        window.location.reload();
      }
      //console.log('chainChanged', res);
    });
    return { success: true, account, chainId };
  }
  return {
    success: false,
    error: 'Cannot connect wallet, please install MetaMask.',
  };
};

export const getUserWalletBalance = async (chainId, walletAddress) => {
  //const web3 = web3Factory(chainId);
  const web3 = metaMaskWeb3();
  const balance = await web3.eth.getBalance(walletAddress);
  const res = Web3.utils.fromWei(balance);
  return res;
};
