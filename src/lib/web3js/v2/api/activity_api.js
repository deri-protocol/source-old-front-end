import { pTokenAirdropFactory, pTokenFactory } from "../factory"
import { getPoolConfig2 } from '../config'
import { DeriEnv } from "../../config"

const AIRDROP_PTOKEN_ADDRESS_BSC = '0x94e7f76eb542657Bc8d2a9aA321D79F66F7C8FfA'
const AIRDROP_PTOKEN_ADDRESS_BSCTESTNET = '0x3b88a9B5896a49AEb23Ca2Ee9892d28d3B8De5f6'

const getAirdropPTokenAddress = () => {
  const env = DeriEnv.get()
  if (env === 'prod') {
    return AIRDROP_PTOKEN_ADDRESS_BSC
  } else {
    return AIRDROP_PTOKEN_ADDRESS_BSCTESTNET
  }
}

export const airdropPToken = async (chainId, accountAddress) => {
  let res
  let contractAddress = getAirdropPTokenAddress()
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
  let contractAddress = getAirdropPTokenAddress()
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