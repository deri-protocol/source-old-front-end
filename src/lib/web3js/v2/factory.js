import Web3 from 'web3';
import {
  PerpetualPool,
  PerpetualPoolRouter,
  BToken,
  LToken,
  PToken,
  WooOracle,
  ChainlinkOracle,
} from './contract';
import { getChainProviderUrl } from './utils/chain';

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
    async getOrSet(chainId) {
      if (Object.keys(web3InstanceMap).includes(chainId)) {
        return web3InstanceMap[chainId];
      }
      console.log(
        `==== web3Factory(${chainId}), please caution the access limits ===`
      );
      const providerUrl = await getChainProviderUrl(chainId);
      web3InstanceMap[chainId] = new Web3(
        new Web3.providers.HttpProvider(providerUrl)
      );
      return web3InstanceMap[chainId];
    },
  };
})();

export const perpetualPoolFactory = (function () {
  const instanceMap = {};
  return (chainId, address, useInfura) => {
    const key = useInfura ? `${address}.useInfura` : address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      instanceMap[key] = new PerpetualPool(chainId, address, useInfura);
      return instanceMap[key];
    }
  };
})();

export const perpetualPoolRouterFactory = (function () {
  const instanceMap = {};
  return (chainId, address, useInfura) => {
    const key = useInfura ? `${address}.useInfura` : address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      instanceMap[key] = new PerpetualPoolRouter(chainId, address, useInfura);
      return instanceMap[key];
    }
  };
})();

export const bTokenFactory = (function () {
  const instanceMap = {};
  return (chainId, address, useInfura) => {
    const key = useInfura ? `${address}.useInfura` : address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      instanceMap[key] = new BToken(chainId, address, useInfura);
      return instanceMap[key];
    }
  };
})();

export const lTokenFactory = (function () {
  const instanceMap = {};
  return (chainId, address, useInfura) => {
    const key = useInfura ? `${address}.useInfura` : address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      instanceMap[key] = new LToken(chainId, address, useInfura);
      return instanceMap[key];
    }
  };
})();

export const pTokenFactory = (function () {
  const instanceMap = {};
  return (chainId, address, useInfura) => {
    const key = useInfura ? `${address}.useInfura` : address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      instanceMap[key] = new PToken(chainId, address, useInfura);
      return instanceMap[key];
    }
  };
})();

export const oracleFactory = (function () {
  const instanceMap = {};
  return (chainId, address, symbol, decimal, useInfura) => {
    const key = useInfura ? `${address}.useInfura` : address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      if (['80001', '137'].includes(chainId)) {
        instanceMap[key] = new ChainlinkOracle(
          chainId,
          address,
          symbol,
          decimal,
          useInfura
        );
      } else {
        instanceMap[key] = new WooOracle(chainId, address, symbol, decimal, useInfura);
      }
      return instanceMap[key];
    }
  };
})();
