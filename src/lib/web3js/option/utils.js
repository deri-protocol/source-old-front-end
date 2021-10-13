import { getOracleVolatilitiesForOption, getPriceInfo } from "../shared/utils/oracle"
import { deriToNatural } from "../shared/utils"

export const volatilitiesCache = (function() {
  const cache = {}
  return {
    async get(poolAddress, symbols){
      const key = poolAddress
      if (!Object.keys(cache).includes(key) || Math.floor(Date.now()/1000) - cache[key].timestamp > 30) {
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

export const volatilityCache = (function() {
  const cache = {}
  return {
    async get(symbol){
      const key = symbol
      if (!Object.keys(cache).includes(key) || Math.floor(Date.now()/1000) - cache[key].timestamp > 30) {
        const timestamp = Math.floor(Date.now()/1000)
        const res = await getPriceInfo(symbol, 'option')
        const data = deriToNatural(res.volatility).toString()
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