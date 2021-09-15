import React, {useEffect,useState} from 'react'
import './pool.less'
import './zh-pool.less'
import classNames from 'classnames';
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import { inject, observer } from 'mobx-react';
import PoolPlacehold from '../../../components/Mining/Pool/PoolPlacehold';
import {DeriEnv,openConfigListCache, getContractAddressConfig } from '../../../lib/web3js/indexV2';
import config from './../../../config.json'
import { combineSymbolfromPoolConfig, mapPoolInfo, groupByNetwork } from '../../../utils/utils';

const env = DeriEnv.get();
const { chainInfo } = config[env]

function Pool({lang,loading}){
  const [loaded,pools,v1Pools,v2Pools,optionPools] = useMiningPool(true);
  const [openPools, setOpenPools] = useState([])
  const [curTab, setCurTab] = useState('all')
  const tabCLassName = classNames('filter-area',curTab)
  const getOpenPools = async () => {
    await openConfigListCache.update()
    return getContractAddressConfig(env, 'v2_lite_open')
  }
  const siwtchTab = async (current) => {
    setCurTab(current);
    if(current === 'open' && openPools.length === 0) {
      loading.loading()
      let openPools = combineSymbolfromPoolConfig(await getOpenPools());
      openPools = openPools.map(config =>  mapPoolInfo(config,null,chainInfo))
      Promise.all(openPools).then(pools => {
        openPools = groupByNetwork(pools);
        setOpenPools(openPools)
        loading.loaded();
      })
    }
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
      {curTab === 'all' &&<div className="pools">
          {optionPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        {v2Pools.concat(v1Pools).map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
      </div>}
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
        {openPools.length > 0 && <PoolPlacehold lang={lang}></PoolPlacehold>}
      </div>}
    </div>
  )
}
export default inject('version','loading')(observer(Pool))