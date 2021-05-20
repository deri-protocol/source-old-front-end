import {useState,useEffect} from 'react';
import {
  DeriEnv,
  getContractAddressConfig,
  getPoolLiquidity,
  getPoolInfoApy,
  getLpContractAddressConfig
} from '../lib/web3js/indexV2'
import config from '../config.json'
import { formatAddress, isSushi } from '../utils/utils';

const env = DeriEnv.get();
const {chainInfo} = config[env]

export default function useMiningPool(){
  const [loaded,setLoaded] = useState(false)
  const [pools, setPools] = useState([])


  useEffect(() => {
    const configs = getContractAddressConfig(env).map(async config =>  {
      const liqPool = await getPoolLiquidity(config.chainId,config.pool) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.pool) || {}
      const pool = config.pool || ''
      return Object.assign(config,{ 
        network : chainInfo[config.chainId].name,
        liquidity : liqPool.liquidity,
        apy :  (+apyPool.apy) * 100,
        pool : formatAddress(pool),
        address : pool,
        type : 'perpetual',
        buttonText : 'STAKING'        
      })
    })
    const slpConfig = getLpContractAddressConfig(env).map(async config => {
      const liqInfo = await getPoolLiquidity(config.chainId,config.pool) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.pool) || {} 
      const pool = config.pool || ''      
      let sushiApy ;
      if(isSushi(config.pool)){
        sushiApy =  0.22008070161007/liqInfo.liquidity * 100;           
      }
      return Object.assign(config,{
        network : chainInfo[config.chainId].name,
        liquidity : liqInfo.liquidity,
        apy : (+apyPool.apy) * 100,
        pool : formatAddress(pool),
        sushiApy : sushiApy,
        address : pool,
        type : 'lp',
        buttonText : 'STAKING'
      })    
    })
    const allConfigs = configs.concat(slpConfig)
    Promise.all(allConfigs).then(pools => {
      const airDrop = {
        network : 'BSC',
        bTokenSymbol : 'GIVEAWAY',
        liquidity : '12800',
        symbol : '--',
        airdrop : true,
        buttonText : 'CLAIM'
      }
      pools.push(airDrop)
      setPools(pools);
      setLoaded(true)
    })
    return () => pools.length = 0
  })
  return [loaded,pools];
}