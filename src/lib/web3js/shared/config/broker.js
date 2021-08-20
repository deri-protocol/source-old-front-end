import { getConfig } from './config';

export const getBrokerConfigList = (version) => {
  const config = getConfig(version)
  return config.brokerManager
};

export const getBrokerConfig = (chainId, version) => {
  const filteredByChainId = getBrokerConfigList(version).filter((c) =>c.chainId === chainId);
  if (filteredByChainId.length > 0) {
    return filteredByChainId[0];
  }
  throw new Error(`getBrokerConfig(): invalid chainId(${chainId}).`);
};
