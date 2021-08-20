import React, { useState,useEffect } from 'react'
import './areaPicker.less'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'

function AreaPicker({lang,version,wallet}){
  const [current, setCurrent] = useState('main')
  const clazz = classNames('area-picker-wrapper',current)
  const siwtchZone = (zone) => {
    setCurrent(zone)
    if(zone === 'innovation') {
      version.setCurrent('v2_lite')
    } else if(zone === 'main') {
      version.setCurrent('v2')
    } else {
      version.setCurrent('v2_lite_open')
    }
  }
  useEffect(() => {
    siwtchZone('main')
    return () => {}
  }, [])
  return (
    ((version.isV2 || version.isV2Lite || version.isOpen) && wallet.supportInnovation) ? <div className='area-picker'>
      <div className={clazz}>
        <span className='left' onClick={() => siwtchZone('main')}>{lang['main-zone']}</span>
        <span className='middle' onClick={() => siwtchZone('innovation')}>{lang['innovation-zone']}</span>
        <span className='right' onClick={() => siwtchZone('open')}>{lang['open-zone']}</span>
      </div>
    </div> 
    : null
  )
}

export default inject('version','wallet')(observer(AreaPicker))