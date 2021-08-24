import { isUsedRestOracle } from '../config';
import { RestOracle } from '../utils/oracle';
import { WrappedOracle } from '../contract/oracle/wrapped_oracle';

export const oracleFactory = (function () {
  const instanceMap = {};
  return (chainId, address, symbol, decimal = '18') => {
    const key = address;
    if (Object.keys(instanceMap).includes(key)) {
      return instanceMap[key];
    } else {
      if (isUsedRestOracle(symbol)) {
        instanceMap[key] = RestOracle(symbol);
      } else if (['56', '137', '97', '80001'].includes(chainId)) {
        instanceMap[key] = new WrappedOracle(chainId, address, symbol, decimal);
      } else {
        throw new Error(
          `please setup oracle contract for the chain(${chainId})`
        );
      }
      return instanceMap[key];
    }
  };
})();
