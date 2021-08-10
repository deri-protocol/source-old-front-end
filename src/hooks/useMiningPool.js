import {useState,useEffect} from 'react';
import {
  DeriEnv,
  getContractAddressConfig,
  getPoolLiquidity,
  getPoolInfoApy,
  getLpContractAddressConfig,
  getLpPoolInfoApy,
  getPreminingContractConfig
} from '../lib/web3js/indexV2'
import config from '../config.json'
import { formatAddress, isLP,isSushiLP,isCakeLP, eqInNumber } from '../utils/utils';
import Intl from '../model/Intl';

const env = DeriEnv.get();
const {chainInfo} = config[env]

export default function useMiningPool(isNew){
  const [loaded,setLoaded] = useState(false)
  const [pools, setPools] = useState([])
  const [v1Pools, setV1Pools] = useState([])    
  const [v2Pools, setV2Pools] = useState([])
  const [optionPools, setOptionPools] = useState([])
  const [legacyPools, setLegacyPools] = useState([])
  const [preminingPools, setPreminingPools] = useState([])


  useEffect(() => {
    const mapConfig = async (config) => {
      const liqPool = await getPoolLiquidity(config.chainId,config.pool,config.bTokenId) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.pool,config.bTokenId) || {}
      const pool = config.pool || ''
      return Object.assign(config,{ 
        network : chainInfo[config.chainId] && chainInfo[config.chainId].name,
        liquidity : liqPool.liquidity,
        apy :  ((+apyPool.apy) * 100).toFixed(2),
        formatAdd : formatAddress(pool),
        address : pool,
        type : 'perpetual',
        buttonText : 'STAKING',
        multiplier : apyPool.multiplier 
      })
    }
    const groupByNetwork = pools => {
      const all = []
      pools.reduce((total,pool) => {
        const find = total.find(item => eqInNumber(item['pool']['address'],pool['address']))
        if(find && find.list.length < 5){
          find['list'].push(pool)
        } else {
          const poolInfo = {
            pool : {
              network : pool.network,
              symbol : pool.symbol,
              address : pool.address,
              formatAdd : pool.formatAdd,
              version : pool.version,
              // innoDisplay : pool.version=== 'v2_lite' ? Intl.get('mining','v2_lite') : pool.version,
              chainId : pool.chainId,
              airdrop : pool.airdrop,
              type : pool.type,
              bTokenSymbol : pool.bTokenSymbol,
              bTokenId : pool.bTokenId,
              symbolId : pool.symbolId
            },
            list : [pool]
          }
          total.push(poolInfo)
        }
        return total;
      },all)
      return all;
    }
    let v2Configs = getContractAddressConfig(env,'v2')
    let v1Configs = getContractAddressConfig(env,'v1')
    const liteConfigs = getContractAddressConfig(env,'v2_lite')
    const optionConfigs = getContractAddressConfig(env,'option')
    const preminingPools = getPreminingContractConfig(env);
    const all = []
    let configs = v2Configs.concat(v1Configs).concat(preminingPools).concat(liteConfigs).concat(optionConfigs).reduce((total,config) => {
      const pos = total.findIndex(item => item.chainId === config.chainId && item.bTokenSymbol === config.bTokenSymbol && config.version === item.version)
      if((config.version === 'v2' || config.version === 'v2_lite' || config.version === 'option')  && pos > -1 && total[pos].symbol.indexOf(config.symbol) === -1) {
        total[pos].symbol += `,${config.symbol}` 
      } else {
        total.push(config)
      }
      return total;
    },all);
    
    configs = configs.map(mapConfig)
    const slpConfig = getLpContractAddressConfig(env).map(async config => {
      const liqInfo = await getPoolLiquidity(config.chainId,config.pool) || {}
      const apyPool = await getPoolInfoApy(config.chainId,config.pool) || {} 
      const pool = config.pool || ''      
      let lpApy;
      let label;
      if(isLP(config.pool)){
        let lapy = await getLpPoolInfoApy(config.chainId,config.pool);
        lpApy = lapy && ((+lapy.apy2) * 100).toFixed(2);           
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
        formatAdd : formatAddress(pool),
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
        liquidity : '34240',
        symbol : '--',
        airdrop : true,
        chainId : 56,
        buttonText : 'CLAIM'
      }
      // pools.push(airDrop)
      let v1Pools = pools.filter(p => (p.version === 'v1' || !p.version) && !p.retired)
      let v2Pools = pools.filter(p => (p.version === 'v2' || p.version === 'v2_lite'  )&& !p.retired)
      let optionPools = pools.filter(p => (p.version === 'option') && !p.retired)
      const legacy = pools.filter(p => p.retired && !p.premining)
      const preminings = pools.filter(p =>  p.retired && p.premining) 
      //新版本按照网络来分组
      if(isNew){
        v1Pools = groupByNetwork(v1Pools);
        v2Pools = groupByNetwork(v2Pools);
        optionPools =groupByNetwork(optionPools)
      }
      setV2Pools(v2Pools);
      setV1Pools(v1Pools);
      setOptionPools(optionPools)
      setPools(pools);
      setLegacyPools(legacy);
      setPreminingPools(preminings)
      setLoaded(true)
    })
    return () => pools.length = 0
  },[])
  return [loaded,pools,v1Pools,v2Pools,optionPools,legacyPools,preminingPools];
}