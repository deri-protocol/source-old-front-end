import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import './pool.less'
import './oldpool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';
import React,{useEffect,useState} from 'react'


function Pool({ lang }) {
  const [loaded, pools, v1Pools, v2Pools] = useMiningPool(true);
  return (
    <div className='oldpool'>
      <div className='old-title'>
        {lang['old-pool']}
      </div>
      <div className="mining-info">
        <div className='pools'>
          {v1Pools.map((pool, index) => <PoolBox group={pool} key={index} lang={lang} />)}
          {!loaded && <div className="loading">
          <span
            className="spinner spinner-border spinner-border-sm">
            </span>
          </div>}  
        </div>
      </div>
      <div className='old-title'>
        {lang['premining-pools']}
      </div>
      <div className='premining-finished'>
        {lang['premining-finished']}
      </div>
      <div className="mining-info">
        <div className='pools'>
          {v1Pools.map((pool, index) => <PoolBox group={pool} key={index} lang={lang} />)}
        </div>
      </div>
    </div>
  )
}
export default inject('version')(observer(Pool))