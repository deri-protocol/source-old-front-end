import {
  PerpetualPoolLite,
  LTokenLite,
  PTokenLite,
} from '../../contract/v2_lite';

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

export const perpetualPoolLiteFactory = factory(PerpetualPoolLite)

export const lTokenLiteFactory = factory(LTokenLite)

export const pTokenLiteFactory = factory(PTokenLite)