import Web3 from 'web3';
import { normalizeChainId } from '../utils/validate';
import { getChainProviderUrl } from '../utils/chain';
import { isBrowser, isJsDom } from '../utils/convert';

export const web3Factory = (function () {
  const web3InstanceMap = {};
  return {
    async get(chainId) {
      chainId = normalizeChainId(chainId)
      if (Object.keys(web3InstanceMap).includes(chainId)) {
        return web3InstanceMap[chainId];
      }
      // for mining page should not depends wallet network
      let walletChainId
      if (typeof window === 'object' && window.ethereum) {
        walletChainId = await window.ethereum.request({ method: 'net_version' })
      } else {
        // MetaMask plugin is not installed in the browser
        console.log('Please install MetaMask first');
      }
      // using metaMask ethereum object
      if (
        isBrowser() &&
        !isJsDom() &&
        typeof window.ethereum === 'object' &&
        walletChainId &&
        chainId === walletChainId.toString()
      ) {
        web3InstanceMap[chainId] = new Web3(window.ethereum);
        return web3InstanceMap[chainId];
      } else {
        const providerUrl = await getChainProviderUrl(chainId);
        web3InstanceMap[chainId] = new Web3(
          new Web3.providers.HttpProvider(providerUrl)
        );
        return web3InstanceMap[chainId];
      }
    },
  };
})();