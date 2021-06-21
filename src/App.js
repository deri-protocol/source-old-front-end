import React, { useState, useEffect } from 'react'
import {isBrowser,isMobile} from 'react-device-detect'
import LoadableComponent from './utils/LoadableComponent';
import { inject, observer } from 'mobx-react';

const DesktopApp = LoadableComponent(() => import('./desktop/index'))
const MobileApp = LoadableComponent(() => import('./mobile/index'))

function App({intl}) {
  if(isBrowser){
    return <DesktopApp lang={intl.locale}/>
  }
  if(isMobile){
    return <MobileApp lang={intl.locale}/>
  }
}

export default inject('intl')(observer(App)) ;
