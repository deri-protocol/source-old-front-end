import React, { useEffect, useState } from 'react'
import useMiningPool from '../../../hooks/useMiningPool';
import classNames from 'classnames';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';
import Card from './Card';
import List from './List';


function Pool({lang,loading,wallet}){
  const [loaded,pools,v1Pools,v2Pools,optionPools,legacyPools,preminingPools,openPools] = useMiningPool(true,wallet);
  const [curTab,setCurTab] = useState('')
  const [curStyle, setCurStyle] = useState('list')
  const [switchChecked, setSwitchChecked] = useState(false)
  const tabCLassName = classNames('filter-area',curTab)
  const styleSelectClass = classNames('style-select',curStyle)
  const switchClass = classNames('switch-btn' ,{checked : switchChecked})
  const switchTab = (current) => {
    setCurTab(current)
  };

  useEffect(() => {
    loaded ? loading.loaded() : loading.loading()
    console.log(wallet.isConnected())
    return () => {}
  }, [loaded,wallet])

  return (
    <div className="mining-info">
      <div className='checkout-pools'>
        <div className={styleSelectClass}>
          <div className='card' onClick={() => setCurStyle('card')}></div>
          <div className='list' onClick={() => setCurStyle('list')}></div>
        </div>
        <div className='switcher'>
          <div className={switchClass} onClick={()=> setSwitchChecked(!switchChecked)}></div>
          <div className='added-only'>Added Only</div>
        </div>
        <div className={tabCLassName}>
          {/* <div className='all' onClick={() => switchTab('all')}>{lang['all']}</div> */}
          <div className='futures' onClick={() => switchTab('futures')}>{lang['futures']}</div>
          <div className='options' onClick={() => switchTab('options')}>{lang['options']}</div>
          <div className='separator-line'></div>
          <div className='opens' onClick={() => switchTab('opens')}>{lang['open-zone']}</div>
        </div>
      </div>
      {curStyle === 'list' ? <List type={curTab} optionPools={optionPools} v1Pools={v1Pools} v2Pools={v2Pools} openPools={openPools} lang={lang} wallet={wallet}/> : <Card  type={curTab} optionPools={optionPools} v1Pools={v1Pools} v2Pools={v2Pools} openPools={openPools} lang={lang}/>}
    </div>
  )
}
export default inject('version','loading','wallet')(observer(Pool))