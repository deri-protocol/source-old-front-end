import React, { useState,useEffect } from 'react'
import './areaPicker.less'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'

function AreaPicker({lang,version,wallet}){
  const [current, setCurrent] = useState('main')
  const clazz = classNames('area-picker-wrapper',current)
  const [styles, setStyles] = useState({})
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
    wallet.supportOpen ? setStyles({width : `${100 / 3}%` }) : setStyles({width : `${100 /2 }%`})
    return () => {}
  }, [wallet.detail])
  return (
    ((version.isV2 || version.isV2Lite || version.isOpen) && wallet.supportInnovation) ? <div className='area-picker'>
      <div className={clazz}>
        <span className='left' style={styles} onClick={() => siwtchZone('main')}>{lang['main-zone']}</span>
        <span className='middle' style={styles} onClick={() => siwtchZone('innovation')}>{lang['innovation-zone']}</span>
        {wallet.supportOpen &&<span className='right' style={styles} onClick={() => siwtchZone('open')}>{lang['open-zone']}</span>}
      </div>
    </div> 
    : null
  )
}

export default inject('version','wallet')(observer(AreaPicker))