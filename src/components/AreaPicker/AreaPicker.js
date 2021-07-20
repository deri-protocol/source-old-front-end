import React, { useState } from 'react'
import './areaPicker.less'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'

function AreaPicker({lang,version}){
  const [current, setCurrent] = useState('main')
  const clazz = classNames('area-picker-wrapper',current)
  const siwtchZone = (zone) => {
    setCurrent(zone)
    if(zone === 'innovation') {
      version.setCurrent('v2_lite')
    } else {
      version.setCurrent('v2')
    }
  }
  return (
    (version.isV2 || version.isV2Lite) ? <div className='area-picker'>
      <div className={clazz}>
        <span className='left' onClick={() => siwtchZone('main')}>{lang['main-zone']}</span>
        <span className='right' onClick={() => siwtchZone('innovation')}>{lang['innovation-zone']}</span>
      </div>
    </div> 
    : null
  )
}

export default inject('version')(observer(AreaPicker))