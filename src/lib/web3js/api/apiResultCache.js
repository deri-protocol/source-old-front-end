import { perpetualPoolFactory } from '../factory/contracts';
import { getBTCUSDPrice } from '../utils';

export const fundingRateCache = (function () {
  let resourceMap = {};
  return {
    get(chainId, contractAddress) {
      const key = `${chainId}.${contractAddress}`;
      if (Object.keys(resourceMap).includes(key)) {
        return resourceMap[key];
      }
      console.log(`Cache key is not in resouceMap: ${key}`);
      return undefined;
    },
    set(chainId, contractAddress, resource) {
      const key = `${chainId}.${contractAddress}`;
      resourceMap[key] = resource;
    },
  };
})();

export const accountAddressCache = (function () {
  let _accountAddress = '';
  return {
    get() {
      if (_accountAddress === '') {
        console.log("please init 'accountAddress' first");
      }
      return _accountAddress;
    },
    set(value) {
      if (typeof value === 'string' && value !== '') {
        _accountAddress = value;
      }
    },
  };
})();

export const priceCache = (function () {
  let _price = '';
  return {
    get() {
      if (_price === '') {
        console.log("please init 'price' first");
      }
      return _price;
    },
    async _update(chainId, poolAddress) {
      const res = await getBTCUSDPrice(chainId, poolAddress);
      if (res !== '') {
        _price = res;
      }
    },
    update(chainId, poolAddress) {
      const self = this;
      setInterval(() => {
        // console.log('tick')
        self._update(chainId, poolAddress);
      }, 2000);
    },
  };
})();

export const PerpetualPoolParametersCache = (function () {
  let _parameters = {};
  return {
    get() {
      if (!_parameters.multiplier) {
        console.log("please init 'perpetual pool parameters' first");
      }
      return _parameters;
    },
    async update(chainId, poolAddress) {
      const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
      const res = await perpetualPool.getParameters();
      if (res.multiplier) {
        _parameters = res;
      }
      return res;
    },
  };
})();
