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

export default function useMiningPool(version){
  const [loaded,setLoaded] = useState(false)
  const [pools, setPools] = useState([])
  const [v1Pools, setV1Pools] = useState([])    
  const [v2Pools, setV2Pools] = useState([])


  useEffect(() => {
    const mapConfig = async (config) => {
      const liqPool = await getPoolLiquidity(config.chainId,config.pool,config.bTokenId) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.pool,config.bTokenId) || {}
      const pool = config.pool || ''
      return Object.assign(config,{ 
        network : chainInfo[config.chainId].name,
        liquidity : liqPool.liquidity,
        apy :  ((+apyPool.apy) * 100).toFixed(2),
        pool : formatAddress(pool),
        address : pool,
        type : 'perpetual',
        buttonText : 'STAKING'        
      })
    }
    let arr = getContractAddressConfig(env,version.current)
    let symbol_obj = arr.filter((i) => i.version === 'v2').map((i) => [i.pool, i.symbol]).reduce((ac, i) => { ac[i[0]] = ac[i[0]]||[]; ac[i[0]].push(i[1]); return ac}, {})
    let arr2 = arr.filter((i) => i.version === 'v2').filter((i,index, self) => self.map(i => i.bTokenId).indexOf(i.bTokenId) == index).map(i => { i.symbol = [...new Set(symbol_obj[i.pool])].join(','); return i})
    let arre = getContractAddressConfig(env,'v1')
    // const v1Pools = arre.map(mapConfig)
    // const v2Pools = arr2.map(mapConfig);
    const configs = arr2.concat(arre).map(mapConfig);

    const slpConfig = getLpContractAddressConfig(env).map(async config => {
      const liqInfo = await getPoolLiquidity(config.chainId,config.pool) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.pool) || {} 
      const pool = config.pool || ''      
      let lpApy;
      let label;
      if(isLP(config.pool)){
        let lapy = await getLpPoolInfoApy(config.chainId,config.pool);
        lpApy = ((+lapy.apy2) * 100).toFixed(2);           
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
        apy : ((+apyPool.apy) * 100).toFixed(2),
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
      const v1Pools = pools.filter(p => p.version === 'v1' || !p.version)
      const v2Pools = pools.filter(p => p.version === 'v2')
      setV2Pools(v2Pools);
      setV1Pools(v1Pools);
      setPools(pools);
      setLoaded(true)
    })
    return () => pools.length = 0
  },[version.current])
  return [loaded,pools,v1Pools,v2Pools];
}