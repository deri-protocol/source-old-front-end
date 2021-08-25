import { hexToNumber } from './convert';
import { web3Factory } from '../factory/web3'


  // get block number when last updated
  export const getLastUpdatedBlockNumber = async(chainId, contractAddress, position = 0) => {
    const web3 = await web3Factory.get(chainId)
    const res = await web3.eth.getStorageAt(contractAddress, position)
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
    if (['56', '97', '127', '80001'].includes(chainId)) {
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