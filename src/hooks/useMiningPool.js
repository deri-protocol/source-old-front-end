import {useState,useEffect} from 'react';
import {
  DeriEnv,
  getContractAddressConfig,
  getPoolLiquidity,
  getPoolInfoApy,
} from '../lib/web3js/index'
import config from '../config.json'
import { formatAddress, formatBalance } from '../utils/utils';

const env = DeriEnv.get();
const {chainInfo} = config[env]

export default function useMiningPool(){
  const [loaded,setLoaded] = useState(false)
  const [pools, setPools] = useState([])


  useEffect(() => {
    const configs = getContractAddressConfig(env).map(async config =>  {
      const liqPool = await getPoolLiquidity(config.chainId,config.pool) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.bTokenSymbol) || {}
      const pool = config.pool || ''
      return Object.assign(config,{ 
        network : chainInfo[config.chainId].name,
        liquidity : formatBalance(liqPool.liquidity),
        apy : apyPool.apy,
        pool : formatAddress(pool),
        address : pool
      })
    })
    Promise.all(configs).then(pools => {
      setPools(pools);
      setLoaded(true)
    })
    return () => pools.length = 0
  })
  return [loaded,pools];
}