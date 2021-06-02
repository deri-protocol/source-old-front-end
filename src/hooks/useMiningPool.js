import {useState,useEffect} from 'react';
import {
  DeriEnv,
  getContractAddressConfig,
  getPoolLiquidity,
  getPoolInfoApy,
  getLpContractAddressConfig,
  getLpPoolInfoApy
} from '../lib/web3js/indexV2'
import config from '../config.json'
import { formatAddress, isLP,isSushiLP,isCakeLP } from '../utils/utils';

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
      let lpApy;
      let label;
      if(isLP(config.pool)){
        let lapy = await getLpPoolInfoApy(config.chainId,config.pool);
        lpApy = (+lapy.apy2) * 100;           
      }
      if(isSushiLP(config.pool)){
        label = 'SUSHI-APY'
      }
      if(isCakeLP(config.pool)){
        label = 'CAKE-APY'
      }
      return Object.assign(config,{
        network : chainInfo[config.chainId].name,
        liquidity : liqInfo.liquidity,
        apy : (+apyPool.apy) * 100,
        pool : formatAddress(pool),
        lpApy : lpApy,
        address : pool,
        type : 'lp',
        label:label,
        buttonText : 'STAKING'
      })    
    })
    const allConfigs = configs.concat(slpConfig)
    Promise.all(allConfigs).then(pools => {
      const airDrop = {
        network : 'BSC',
        bTokenSymbol : 'GIVEAWAY',
        liquidity : '0',
        symbol : '--',
        airdrop : true,
        buttonText : 'CLAIM'
      }
      // pools.push(airDrop)
      setPools(pools);
      setLoaded(true)
    })
    return () => pools.length = 0
  })
  return [loaded,pools];
}