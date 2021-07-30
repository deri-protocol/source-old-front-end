import React, { useEffect } from 'react'
import PoolBox from '../../../../components/Pool/legacy/LegacyPoolBox';
import useMiningPool from '../../../../hooks/useMiningPool';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';


function Pool({version,lang,loading}){
  const [loaded,pools,v1Pools,v2Pools,legacy,premining] = useMiningPool(version);
  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    return () => {}
  }, [loaded])
  return (
    <div className='retired'>
      <div className='retired-title'>
        <div className='retired-pools'>{lang['retired-pools']}</div>
        {lang['retired-text']}
        <a href="https://app.deri.finance/#/mining">{lang['new-pools']}</a>
      </div>
      <div className="retired-mining-info">
        <div className='pools'>
          {legacy.map((pool,index) => <PoolBox pool={pool} key={index} lang={lang}/>)}
          
        </div>
      </div>
      <div className='retired-title premining'>
        {lang['premining-pools']}
        <span className='premining-finished'>
          {lang['premining-finished']}
        </span>
      </div>
      <div className="retired-mining-info">
        <div className='pools'>
          {premining.map((pool,index) => <PoolBox pool={pool} key={index} lang={lang}/>)}
          
        </div>
      </div>
    </div>
    
  )
}
export default inject('version','loading')(observer(Pool))