import {
  getChainProviderUrls,
  getDailyBlockNumberConfig,
} from '../config/chain';
import { normalizeChainId } from './validate';
import { getLatestRPCServer } from './network';
import { hexToNumber } from './convert';
import { web3Factory } from '../factory/shared'

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
export const getDailyBlockNumber = (chainId) => {
  const blockNumbers = getDailyBlockNumberConfig();
  if (blockNumbers[chainId]) {
    return parseInt(blockNumbers[chainId]);
  } else {
    throw new Error(`Invalid annual block number with chainId: ${chainId}`);
  }
};

  // get block number when last updated
  export const getLastUpdatedBlockNumber = async(chainId, contractAddress, position = 0) => {
    const web3 = await web3Factory.get(chainId)
    //console.log(chainId, contractAddress, position)
    const res = await web3.eth.getStorageAt(contractAddress, position)
    //console.log('res', res)
    //console.log('res', hexToNumber(res))
    return hexToNumber(res)
  }

  // get block number when last updated
  export const getLatestBlockNumber = async(chainId) => {
    const web3 = await web3Factory.get(chainId)
    const res = await web3.eth.getBlockNumber()
    //console.log('res', res)
    return res
  }

  export const getBlockInfo = async(chainId, blockNumber) => {
    const web3 = await web3Factory.get(chainId)
    return await web3.eth.getBlock(blockNumber);
  }

  export const getPastEvents = async(chainId, contract, eventName, filter = {}, fromBlock = 0, to = 0) => {
    let events = [];
    let amount
    if (['56', '97','127', '80001'].includes(chainId)) {
      amount = 999
    } else {
      amount = 4999
    }
    if ((fromBlock + amount) > to) {
      amount = to - fromBlock
    }
    while (fromBlock <= to) {
      let es = await contract.getPastEvents(eventName, {
        filter: filter,
        fromBlock: fromBlock,
        toBlock: fromBlock + amount,
      });
      for (let e of es) {
        events.push(e);
      }
      fromBlock += amount + 1;
      if ((fromBlock + amount) > to) {
        amount = to - fromBlock
      }
    }
    return events;
  }

export const getNetworkName = (chainId) => {
  chainId = normalizeChainId(chainId);
  let poolNetwork;
  switch (chainId) {
    case '1':
      poolNetwork = 'ethereum';
      break;
    case '56':
      poolNetwork = 'bsc';
      break;
    case '128':
      poolNetwork = 'heco';
      break;
    case '3':
      poolNetwork = 'ropsten';
      break;
    case '42':
      poolNetwork = 'kovan';
      break;
    case '97':
      poolNetwork = 'bsctestnet';
      break;
    case '256':
      poolNetwork = 'hecotestnet';
      break;
    case '137':
      poolNetwork = 'matic';
      break;
    case '80001':
      poolNetwork = 'mumbai';
      break;
    default:
      throw new Error(`The networkId is not valid for chainId ${chainId}`);
  }
  return poolNetwork;
};