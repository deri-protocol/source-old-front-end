import React, {useEffect,useState} from 'react'
import './pool.less'
import './zh-pool.less'
import classNames from 'classnames';
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import { inject, observer } from 'mobx-react';
import PoolPlacehold from '../../../components/Mining/Pool/PoolPlacehold';


function Pool({lang,loading}){
  const [loaded,pools,v1Pools,v2Pools,optionPools,legacyPools,preminingPools,openPools] = useMiningPool(true);
  const [curTab, setCurTab] = useState('future')
  const tabCLassName = classNames('filter-area',curTab)
  const siwtchTab = (tab) => {
    setCurTab(tab);
  }
  
  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    return () => {}
  }, [loaded])
  return (
    <div className="mining-info">
      <div className={tabCLassName}>
      <span className='future-zone' onClick={() => siwtchTab('future')}>{lang['futures']}</span>
        <span className='option-zone' onClick={() => siwtchTab('option')}>{lang['options']}</span>
        <span className='separator-line'></span>
        <span className='open-zone' onClick={() => siwtchTab('open')}>{lang['open-zone']}</span>
      </div>
      {curTab === 'future' &&<div className="pools">
        {v2Pools.concat(v1Pools).map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
      </div>}
      {curTab === 'option' && <div className='pools'>
        <div className="pools">
          {optionPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </div>}
      {curTab === 'open' && <div className='pools open-pool'>
        {openPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        <PoolPlacehold lang={lang}></PoolPlacehold>
      </div>}
    </div>
  )
}
export default inject('version','loading')(observer(Pool))