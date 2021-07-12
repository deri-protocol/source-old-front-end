import { pTokenAirdropFactory, pTokenFactory } from "../factory"
import { getPoolConfig2 } from '../config'
import { DeriEnv } from "../../config"

const AIRDROP_PTOKEN_ADDRESS_BSC = ''
const AIRDROP_PTOKEN_ADDRESS_BSCTESTNET = '0x3b88a9B5896a49AEb23Ca2Ee9892d28d3B8De5f6'

export const airdropPToken = async (chainId, accountAddress) => {
  let res
  const env = DeriEnv.get()
  let contractAddress
  if (env === 'prod') {
    contractAddress = AIRDROP_PTOKEN_ADDRESS_BSC
  } else {
    contractAddress =  AIRDROP_PTOKEN_ADDRESS_BSCTESTNET
  }
  try {
    const tx = await pTokenAirdropFactory(chainId, contractAddress).airdropPToken(accountAddress)
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res
}

export const getAirdropPTokenWhitelistCount = async (chainId) => {
  let res
  const env = DeriEnv.get()
  let contractAddress
  if (env === 'prod') {
    contractAddress = AIRDROP_PTOKEN_ADDRESS_BSC
  } else {
    contractAddress = AIRDROP_PTOKEN_ADDRESS_BSCTESTNET
  }
  try {
    res = await pTokenAirdropFactory(chainId, contractAddress).totalWhitelistCount()
  } catch (err) {
    console.log(`${err}`)
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