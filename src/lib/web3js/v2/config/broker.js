import { getConfig } from './config';

export const getBrokerConfigList = () => {
  const config = getConfig()
  return config.broker
};

export const getBrokerConfig = (chainId) => {
  const filteredByChainId = getBrokerConfigList().filter((c) =>c.chainId === chainId);
  if (filteredByChainId.length > 0) {
    return filteredByChainId[0];
  }
  throw new Error(`getBrokerConfig(): invalid chainId(${chainId}).`);
};
