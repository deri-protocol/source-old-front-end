import {
  getChainProviderUrls,
  getAnnualBlockNumberConfig,
} from '../config/chain';
import { normalizeChainId } from './validate';
import { getLatestRPCServer } from './network';

export const getChainProviderUrl = async (chainId) => {
  chainId = normalizeChainId(chainId);
  const urls = getChainProviderUrls(chainId);
  if (urls.length > 0) {
   const url =  await getLatestRPCServer(urls);
   // console.log('url', url)
   return url
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
