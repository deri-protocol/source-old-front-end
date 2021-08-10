import React, { useEffect, useState } from 'react'
import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import classNames from 'classnames';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';
import Card from './Card';
import List from './List';


function Pool({lang,loading}){
  const [loaded,pools,v1Pools,v2Pools,optionPools] = useMiningPool(true);
  const [curTab,setCurTab] = useState('all')
  const [curStyle, setCurStyle] = useState('list')
  const [switchChecked, setSwitchChecked] = useState(false)
  const PoolsClassName = classNames('checkout-pools',curTab)
  const styleSelectClass = classNames('style-select',curStyle)
  const switchClass = classNames('switch-btn' ,{checked : switchChecked})
  const switchTab = (current) => {
    setCurTab(current)
  };
  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    return () => {}
  }, [loaded])
  return (
    <div className="mining-info">
      <div className={PoolsClassName}>
        <div className={styleSelectClass}>
          <div className='card' onClick={() => setCurStyle('card')}></div>
          <div className='list' onClick={() => setCurStyle('list')}></div>
        </div>
        <div className={switchClass} onClick={()=> setSwitchChecked(!switchChecked)}></div>
        <div className='added-only'>Added Only</div>
        <div className='all' onClick={() => switchTab('all')}>{lang['all']}</div>
        <div className='futures' onClick={() => switchTab('futures')}>{lang['futures']}</div>
        <div className='options' onClick={() => switchTab('options')}>{lang['options']}</div>
      </div>
      {curStyle === 'list' ? <List optionPools={optionPools} v1Pools={v1Pools} v2Pools={v2Pools} lang={lang}/> : <Card  type={curTab} optionPools={optionPools} v1Pools={v1Pools} v2Pools={v2Pools} lang={lang}/>}
    </div>
  )
}
export default inject('version','loading')(observer(Pool))