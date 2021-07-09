import Web3 from 'web3';
import {
  WooOracle,
  WrappedOracle,
  BrokerManager,
} from '../contract';
import { getChainProviderUrl } from '../utils/chain';
import { isBrowser, isJsDom } from '../utils/convert';

export const factory = (klass) => {
  let instances = {}
  return (chainId, address) => {
    const key = address
    if (Object.keys(instances).includes(key)) {
      return instances[key];
    } else {
      instances[key] = new klass(chainId, address);
      return instances[key];
    }
  }
}

export const metaMaskWeb3 = (function () {
  let web3Instance = null;
  return () => {
    if (web3Instance !== null) {
      return web3Instance;
    }
    if (typeof window.ethereum !== undefined) {
      web3Instance = new Web3(window.ethereum);
      return web3Instance;
    } else {
      // console.log("Please install MetaMask first")
      throw new Error('Please install MetaMask first');
    }
  };
})();

export const web3Factory = (function () {
  const web3InstanceMap = {};
  return {
    async get(chainId) {
      if (Object.keys(web3InstanceMap).includes(chainId)) {
        return web3InstanceMap[chainId];
      }
      console.log(`--- web3factory init (${chainId}) ---`)
      // using metaMask ethereum object
      if (isBrowser() && !isJsDom() && typeof window.ethereum === 'object') {
        web3InstanceMap[chainId] = new Web3(window.ethereum);
        return web3InstanceMap[chainId];
      } else if (isBrowser() && !isJsDom()) {
        // MetaMask plugin is not installed in the browser
        throw new Error('Please install MetaMask first');
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

export const oracleFactory = (function () {
  const instanceMap = {};
  return (chainId, address, symbol, decimal) => {
    const key = address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      // if (['80001'].includes(chainId)) {
      //   instanceMap[key] = new ChainlinkOracle(
      //     chainId,
      //     address,
      //     symbol,
      //     decimal
      //   );
      // } else if (['137', '97'].includes(chainId)) {
      if (['56', '137', '97','80001'].includes(chainId)) {
        instanceMap[key] = new WrappedOracle(chainId, address, symbol, decimal);
      } else {
        instanceMap[key] = new WooOracle(chainId, address, symbol, decimal);
      }
      return instanceMap[key];
    }
  };
})();

export const brokerManagerFactory = factory(BrokerManager);
