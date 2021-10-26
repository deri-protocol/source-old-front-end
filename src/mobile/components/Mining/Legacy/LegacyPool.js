import React,{useEffect} from 'react'
import './legacyPools.less'
import './zh-pool.less'
import PoolBox from '../../../../components/Pool/legacy/LegacyPoolBox';
import useMiningPool from '../../../../hooks/useMiningPool';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'


function Pool({version,lang,loading}){
  const [loaded,pools,v1Pools,v2Pools,optionPools,legacyPools,premining] = useMiningPool(version,null,true);
  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    return () => {}
  }, [loaded])
  return (
    <div className='retired'>
     <div className='retired-title'>
     <div className='retired-pools'>{lang['retired-markets']}</div>
        {lang['v1-markets']} <Link to="/futures/lite/v1">{lang['v1-here']}</Link> {lang['to-close-position']}
      <div className='retired-pools'>{lang['retired-pools']}</div>
        {lang['retired-text']}
        <a href="https://app.deri.finance/#/mining">{lang['new-pools']}</a>
      </div>
      <div className="retired-mining-info">
        <div className="pools">
          {legacyPools.map((pool,index) => <PoolBox pool={pool} key={index} lang={lang}/>)}
        </div>
      </div>
      <div className='retired-title'>
        <div className='premining'> {lang['premining-pools']}</div>
        <span>
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