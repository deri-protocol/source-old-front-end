import React, { useEffect ,useState} from 'react'
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import PoolPlacehold from '../../../components/Mining/Pool/PoolPlacehold';


function Pool({lang,loading}){
  const [loaded,pools,v1Pools,v2Pools,legacyPools,preminingPools,openPools] = useMiningPool(true);
  const [curTab, setCurTab] = useState('official')
  const tabCLassName = classNames('filter-area',{'official' : curTab ==='official','open' : curTab === 'open'})
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
        <span className='official-zone' onClick={() => siwtchTab('official')}>{lang['official-zone']}</span>
        <span className='separator-line'></span>
        <span className='open-zone' onClick={() => siwtchTab('open')}>{lang['open-zone']}</span>
      </div>
      {curTab === 'official' && <div className='official-pool'>
        <div className="pools">
          {v2Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className='pools'>
          {v1Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
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