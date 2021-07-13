import Web3 from 'web3';
import {
  PerpetualPool,
  PerpetualPoolRouter,
  BToken,
  LToken,
  PToken,
  WooOracle,
  ChainlinkOracle,
  WrappedOracle,
  BrokerManager,
  PTokenAirdrop,
} from './contract';
import { getChainProviderUrl } from './utils/chain';

const factory = (klass) => {
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
      if (['1', '3', '42'].includes(chainId)) {
        console.log(
          `==== web3Factory(${chainId}), please caution the access limits ===`
        );
      }
      const providerUrl = await getChainProviderUrl(chainId);
      web3InstanceMap[chainId] = new Web3(
        new Web3.providers.HttpProvider(providerUrl)
      );
      return web3InstanceMap[chainId];
    },
  };
})();

export const perpetualPoolFactory = factory(PerpetualPool)

export const perpetualPoolRouterFactory = factory(PerpetualPoolRouter)

export const bTokenFactory = factory(BToken)

export const lTokenFactory = factory(LToken)

export const pTokenFactory = factory(PToken)

export const oracleFactory = (function () {
  const instanceMap = {};
  return (chainId, address, symbol, decimal) => {
    const key = address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      if (['80001'].includes(chainId)) {
        instanceMap[key] = new ChainlinkOracle(
          chainId,
          address,
          symbol,
          decimal
        );
      } else if (['137'].includes(chainId)) {
        instanceMap[key] = new WrappedOracle(chainId, address, symbol, decimal);
      } else {
        instanceMap[key] = new WooOracle(chainId, address, symbol, decimal);
      }
      return instanceMap[key];
    }
  };
})();

export const brokerManagerFactory = factory(BrokerManager);
export const pTokenAirdropFactory = factory(PTokenAirdrop)