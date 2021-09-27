import {
  PerpetualPoolLite,
  LTokenLite,
  PTokenLite,
  PerpetualPoolLiteViewer 
} from './contract';
import { PerpetualPoolLiteOld } from './contract/perpetual_pool_old';

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

const factoryWithUpgrade = (klass, klassOld, newPoolList) => {
  let instances = {}
  return (chainId, address, initialBlock='') => {
    const key = address
    if (Object.keys(instances).includes(key)) {
      return instances[key];
    } else {
      if (Array.isArray(newPoolList) && newPoolList.includes(address)) {
        instances[key] = new klass(chainId, address, initialBlock);
        return instances[key];
      } else {
        instances[key] = new klassOld(chainId, address, initialBlock);
        return instances[key];
      }
    }
  }
}

export const perpetualPoolLiteFactory = factoryWithUpgrade(
  PerpetualPoolLite,
  PerpetualPoolLiteOld,
  [
    // // prod
    // '0x3465A2a1D7523DAF811B1abE63bD9aE36D2753e0',
    // '0x1a9b1B83C4592B9F315E933dF042F53D3e7E4819',
    // '0xb144cCe7992f792a7C41C2a341878B28b8A11984',
    // '0xa4eDe2C4CB210CD07DaFbCe56dA8d36b7d688cd0',
    // // dev
    // '0x6832DFE1359c158a15E50b31B97b3BCD9cb12701',

    "0x43701b4bf0430DeCFA41210327fE67Bf4651604C",
  ]
);

export const lTokenLiteFactory = factory(LTokenLite)

export const pTokenLiteFactory = factory(PTokenLite)

export const perpetualPoolLiteViewerFactory = factory(PerpetualPoolLiteViewer)