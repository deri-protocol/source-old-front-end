import { getOracleVolatilitiesForOption } from "../shared/utils/oracle"

export const volatilitiesCache = (function() {
  const cache = {}
  return {
    async get(poolAddress, symbols){
      const key = poolAddress
      if (!Object.keys(cache).includes(key) || Math.floor(Date.now()/1000) - cache[key].timestamp > 5) {
        const timestamp = Math.floor(Date.now()/1000)
        const data = await getOracleVolatilitiesForOption(symbols)
        cache[key] = {
          data,
          timestamp,
        }
        return cache[key].data
      } else {
        return cache[key].data
      }
    }
  }
})()
