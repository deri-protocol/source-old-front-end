import React from 'react'
import './pool.less'
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import useSlpMiningPool from '../../../hooks/useSlpMiningPool';


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
    </div>
  )
}