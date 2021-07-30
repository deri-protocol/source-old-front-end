import React, { useState, useEffect } from 'react'
import {isBrowser,isMobile} from 'react-device-detect'
import LoadableComponent from './utils/LoadableComponent';
import { inject, observer } from 'mobx-react';
import LoadingMask from './components/Loading/LoadingMask';

const DesktopApp = LoadableComponent(() => import('./desktop/index'))
const MobileApp = LoadableComponent(() => import('./mobile/index'))

function Mask({loading}){
  const [isOpen, setIsOpen] = useState(true)
  useEffect(() => {
    setIsOpen(loading.isShowMask)
    return () => {
    }
  }, [loading.isShowMask])
  return <LoadingMask modalIsOpen={isOpen} overlay={{background : 'none'}}/>
}

const MaskWrapper = inject('loading')(observer(Mask))

function App({intl,loading}) {

  if(isBrowser){
    return <><MaskWrapper/><DesktopApp locale={intl.locale}></DesktopApp></>
  }
  if(isMobile){
    return <><MaskWrapper/><MobileApp locale={intl.locale}><Mask loading={loading}/></MobileApp></>
  }
}

export default inject('intl','loading')(observer(App)) ;
