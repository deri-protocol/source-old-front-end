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
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import useSlpMiningPool from '../../../hooks/useSlpMiningPool';


const env = DeriEnv.get();
const chainInfo = config[env]


export default function Pool(){
  const [loaded,pools] = useMiningPool();
  const slpPools = useSlpMiningPool()  
  const all = pools.concat(slpPools)
  return (
    <div className="mining-info">
      <div className="pools">
        {all.map((pool,index) => <PoolBox pool={pool} key={index}/>)}
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