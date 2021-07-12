import React from 'react'
import './pool.less'
import './zh-pool.less'
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import { inject, observer } from 'mobx-react';


function Pool({lang}){
  const [loaded,pools,v1Pools,v2Pools] = useMiningPool(true);

  return (
    <div className="mining-info">
      <div className="pools">
        {v2Pools.concat(v1Pools).map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        {!loaded && <div className="loading">
          <span
            className="spinner spinner-border spinner-border-sm">
            </span>
          </div>}  
      </div>
    </div>
  )
}
export default inject('version')(observer(Pool))