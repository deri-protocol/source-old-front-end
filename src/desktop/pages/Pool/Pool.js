import React, {useState,useEffect} from 'react'
import './pool.less'
import {
  getContractAddressConfig,
  getPoolLiquidity,
  getPoolInfoApy,
  getSlpContractAddressConfig,
  getSlpPoolInfoApy,
  DeriEnv
} from '../../../lib/web3js/index'
import config from '../../../config.json'
import { deriNatural, formatAddress, formatBalance } from '../../../utils/utils';
import PoolBox from './PoolBox';


const env = DeriEnv.get();
const chainInfo = config[env]


export default function Mining(){
  const [pools, setPools] = useState([])
  let [loaded,setLoaded] = useState(false)

  useEffect(() => {
    let poolConfigs = getContractAddressConfig(env);
    poolConfigs = poolConfigs.map(async config =>  {
      const liqPool = await getPoolLiquidity(config.chainId,config.pool);
      const apyPool = await getPoolInfoApy(config.chainId,config.bTokenSymbol)
      const pool = config.pool || ''
      return Object.assign(config,{ 
        network : chainInfo[config.chainId].name,
        liquidity : formatBalance(liqPool.liquidity),
        apy : apyPool.apy,
        pool : formatAddress(pool),
        address : pool
      })
    })
    Promise.all(poolConfigs).then(config => {
      setPools(config)
      setLoaded(true)
    })
    return () => {
      pools.length =0
      loaded = false
    }
  },[])

  useEffect(() => {
    let slpConfig = getSlpContractAddressConfig(env);
    slpConfig = slpConfig.map(async config => {
      const liqPool = await getPoolLiquidity(config.chainId,config.pool);
      const apyPool = await getSlpPoolInfoApy(config.chainId,config.pool)
      let sushiApy =  0.22008070161007/liqPool.liquidity;
      sushiApy = (sushiApy * 100).toFixed(2) + "%";
      let deriapy = deriNatural(apyPool.apy)
      if (deriapy == "0") {
        deriapy = "--";
      } else {
        deriapy = (deriapy * 100).toFixed(2) + "%";
      }
      return Object.assign(config,{
        deriapy,
        sushiApy,
        bTokenSymbol : 'DERI-USDT SLP'
      })
    })
    Promise.all(slpConfig).then(config => {
      pools.concat(config)
      setPools(pools)
    })
    return () => {
      pools.length = 0
      loaded = false;
    }
  },[pools])

  return (
    <div className="mining-info">
      <div className="pools">
        {pools.map((pool,index) => <PoolBox pool={pool} key={index}/>)}
        {!loaded && <div className="loading">
          <span
            className="spinner spinner-border spinner-border-sm">
            </span>
          </div>}  
      </div>
      <div className="mining-info-footer">
        <a href="https://premining.deri.finance/#/">PREMINING</a> 
      </div>
    </div>
  )
}