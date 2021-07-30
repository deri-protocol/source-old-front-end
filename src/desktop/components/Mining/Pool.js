import React, { useEffect } from 'react'
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';


function Pool({lang,loading}){
  const [loaded,pools,v1Pools,v2Pools] = useMiningPool(true);
  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    return () => {}
  }, [loaded])
  return (
    <div className="mining-info">
      <div className="pools">
        {v2Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
      </div>
      <div className='pools'>
        {v1Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
      </div>
    </div>
  )
}
export default inject('version','loading')(observer(Pool))