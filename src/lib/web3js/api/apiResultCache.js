import { perpetualPoolFactory } from "../factory/contracts";
import { getBTCUSDPrice } from "../utils";

export const fundingRateCache = (function () {
  let resourceMap = {};
  return {
    get: function (chainId, contractAddress) {
      const key = `${chainId}.${contractAddress}`
      if (Object.keys(resourceMap).includes(key)) {
        return resourceMap[key];
      } else {
        console.log(`Cache key is not in resouceMap: ${key}`)
      }
    },
    set: function (chainId, contractAddress, resource) {
      const key = `${chainId}.${contractAddress}`;
      resourceMap[key] = resource;
    },
  };
})();

export const accountAddressCache =(function() {
  let _accountAddress = ""
  return {
    get: function() {
      if (_accountAddress === "") {
        console.log("please init 'accountAddress' first")
      }
      return _accountAddress
    },
    set: function(value) {
      if (typeof value === 'string' && value !== "") {
        _accountAddress = value
      }
    }
  }
})()

export const priceCache =(function() {
  let _price = ""
  return {
    get: function() {
      if (_price === "") {
        console.log("please init 'price' first")
      }
      return _price
    },
    _update: async function() {
      const res = await getBTCUSDPrice()
      if (res !== "") {
        _price = res
      }
    },
    update: function() {
      const self = this
      setInterval(() => {
        //console.log('tick')
        self._update()
      }, 5000)
    }
  }
})()

export const PerpetualPoolParametersCache =(function() {
  let _parameters = {};
  return {
    get: function () {
      if (!_parameters.multiplier) {
        console.log("please init 'perpetual pool parameters' first");
      }
      return _parameters;
    },
    update: async function (chainId, poolAddress) {
      const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
      const res = await perpetualPool.getParameters();
      if (res.multiplier) {
        _parameters = res;
      }
      return res
    },
  };
})()
