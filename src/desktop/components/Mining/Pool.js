import React, { useEffect, useState } from 'react'
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import classNames from 'classnames';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';


function Pool({lang,loading}){
  const [loaded,pools,v1Pools,v2Pools] = useMiningPool(true);
  const [curTab,setCurTab] = useState('all')
  const switchTab = (current) => {
    
    setCurTab(current)
  };
  const PoolsClassName = classNames('checkout-pools',curTab)
  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    return () => {}
  }, [loaded])
  return (
    <div className="mining-info">
      <div className={PoolsClassName}>
        <div className='all' onClick={() => switchTab('all')}>{lang['all']}</div>
        <div className='futures' onClick={() => switchTab('futures')}>{lang['futures']}</div>
        <div className='options' onClick={() => switchTab('options')}>{lang['options']}</div>
      </div>
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