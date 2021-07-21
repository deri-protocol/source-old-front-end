import { isUsedRestOracle } from '../config/oracle';
import {
  WooOracle,
  WrappedOracle,
  // OffchainOracle,
  BrokerManager,
  PTokenAirdrop,
  BToken,
} from '../contract';
import { RestOracle } from '../utils'

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
      if (isUsedRestOracle(symbol)) {
        instanceMap[key] = RestOracle(symbol);
      } else if (['56', '137', '97','80001'].includes(chainId)) {
        instanceMap[key] = new WrappedOracle(chainId, address, symbol, decimal);
      } else {
        instanceMap[key] = new WooOracle(chainId, address, symbol, decimal);
      }
      return instanceMap[key];
    }
  };
})();


export const bTokenFactory = factory(BToken);

export const brokerManagerFactory = factory(BrokerManager);

export const pTokenAirdropFactory = factory(PTokenAirdrop)
