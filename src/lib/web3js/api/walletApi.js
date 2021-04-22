import Web3 from 'web3';
import { web3Factory } from '../factory/web3';

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

export const connectWallet = async () => {
  if (typeof window.ethereum !== undefined) {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    const chainId = parseInt(
      await window.ethereum.request({ method: 'eth_chainId' }),
      16
    );
    // console.log('---chainId', chainId)
    const account = Array.isArray(accounts) && accounts[0];

    // await web3.eth.requestAccounts().then(console.log)
    window.ethereum.on('accountsChanged', (accounts) => {
      window.location.reload();
    });
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
    return { success: true, account, chainId };
  }
  return {
    success: false,
    error: 'Cannot connect wallet, please install MetaMask.',
  };
};

export const getUserWalletBalence = async (chainId, walletAddress) => {
  const web3 = web3Factory(chainId);
  const balance = await web3.eth.getBalance(walletAddress);
  const res = Web3.utils.fromWei(balance);
  return res;
};
