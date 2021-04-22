import Web3 from 'web3';
import { getChainProviderUrl } from '../utils';

export const metaMaskWeb3 = (function () {
  let web3Instance = null;
  return () => {
    if (web3Instance !== null) {
      return web3Instance;
    }
    let web3;
    if (typeof window.ethereum !== undefined) {
      web3 = new Web3(window.ethereum);
    } else {
      // console.log("Please install MetaMask first")
      throw new Error('Please install MetaMask first');
    }
    web3Instance = web3;
    return web3;
  };
})();

export const web3Factory = (function () {
  const web3InstanceMap = {};
  return (chainId) => {
    if (Object.keys(web3InstanceMap).includes(chainId)) {
      return web3InstanceMap[chainId];
    }
    const providerUrl = getChainProviderUrl(chainId);
    const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
    web3InstanceMap[chainId] = web3;
    return web3;
  };
})();
