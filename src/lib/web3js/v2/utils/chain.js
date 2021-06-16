import {
  getChainProviderUrls,
  getAnnualBlockNumberConfig,
} from '../config';
import { normalizeChainId } from './validate';
import { getAliveHttpServer } from './network';

export const getChainProviderUrl = async (chainId) => {
  chainId = normalizeChainId(chainId);
  const urls = getChainProviderUrls(chainId);
  if (urls.length > 0) {
    if (['56', '128', '97', '256'].includes(chainId)) {
      return await getAliveHttpServer(urls);
    } else {
      return urls[0]
    }
  } else {
    throw new Error(
      `Cannot find the chain provider url with chainId: ${chainId}`
    );
  }
};
export const getAnnualBlockNumber = (chainId) => {
  const blockNumbers = getAnnualBlockNumberConfig();
  if (blockNumbers[chainId]) {
    return parseInt(blockNumbers[chainId]);
  } else {
    throw new Error(`Invalid annual block number with chainId: ${chainId}`);
  }
};
