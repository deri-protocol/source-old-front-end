import { DeriEnv } from "../shared"
import { getPoolV2LiteManagerConfig } from "./config"
import { perpetualPoolLiteManagerFactory } from "./factory"

export const getPoolV2LiteOpenConfigList = async(chainId) => {
  const env = DeriEnv.get()
  const poolManagerAddress = getPoolV2LiteManagerConfig(env)
  if (env === 'prod') {
    return []
  } else {
    const poolManager = perpetualPoolLiteManagerFactory(chainId, poolManagerAddress)
    const poolNums = await poolManager.getNumPools()
  }
}