import React, { useState, useEffect } from 'react'
import {isBrowser,isMobile} from 'react-device-detect'
import LoadableComponent from './utils/LoadableComponent';
import { inject, observer } from 'mobx-react';

const DesktopApp = LoadableComponent(() => import('./desktop/index'))
const MobileApp = LoadableComponent(() => import('./mobile/index'))

function App({intl}) {
  if(isBrowser){
    return <DesktopApp dict={intl.dict}/>
  }
  if(isMobile){
    return <MobileApp dict={intl.dict}/>
  }
}

export default inject('intl')(observer(App)) ;
