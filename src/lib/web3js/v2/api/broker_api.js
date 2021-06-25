import { brokerManagerFactory } from "../factory"
import { normalizeAddress, normalizeChainId } from "../utils"
import { getBrokerConfig } from "../config"

// export const getBroker = async(chainId, accountAddress, useInfura) => {
//   chainId = normalizeChainId(chainId)
//   accountAddress = normalizeAddress(accountAddress)
//   const {address: brokerAddress} = getBrokerConfig(chainId)
//   let res = ''
//   try {
//     const brokerManager = brokerManagerFactory(chainId, brokerAddress, useInfura)
//     res = await brokerManager.getBroker(accountAddress)
//   } catch (err) {
//     console.log(err)
//   }
//   return res
// }

export const setBroker = async(chainId, accountAddress, brokerAddress) => {
  console.log('setBroker.............',chainId, accountAddress, brokerAddress)
  chainId = normalizeChainId(chainId)
  accountAddress = normalizeAddress(accountAddress)
  brokerAddress = normalizeAddress(brokerAddress);
  const {address: brokerManagerAddress} = getBrokerConfig(chainId)
  let res
  try {
    const brokerManager = brokerManagerFactory(chainId, brokerManagerAddress)
    const tx = await brokerManager.setBroker(accountAddress, brokerAddress);
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res
}