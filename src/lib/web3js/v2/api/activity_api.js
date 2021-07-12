import { pTokenAirdropFactory, pTokenFactory } from "../factory"
import { getPoolConfig2 } from '../config'
import { DeriEnv } from "../../config"

export const airdropPToken = async (chainId, poolAddress, accountAddress) => {
  let res
  const env = DeriEnv.get()
  let contractAddress
  if (env === 'prod') {
    contractAddress = ''
  } else {
    contractAddress = '0xA57695f1AB2Bb0ECe9256cF543557E69D103a7b8'
  }
  try {
    const tx = await pTokenAirdropFactory(chainId, contractAddress).airdropPToken(accountAddress)
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res
}

export const isUserPTokenExist = async (chainId, poolAddress, accountAddress) => {
  let res = ''
  try {
    const {lToken:lTokenAddress} = getPoolConfig2(poolAddress)
    const pToken = pTokenFactory(chainId, lTokenAddress)
    const result = await pToken.balanceOf(accountAddress)
    if (result === '1') {
      res = true
    } else if (result === '0') {
      res = false
    }
  } catch (err) {
    console.log(`${err}`)
  }
  return res
}