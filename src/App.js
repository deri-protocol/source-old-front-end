import React, { useState, useEffect } from 'react'
import {isBrowser,isMobile} from 'react-device-detect'
import LoadableComponent from './utils/LoadableComponent';
import { inject, observer } from 'mobx-react';

const DesktopApp = LoadableComponent(() => import('./desktop/index'))
const MobileApp = LoadableComponent(() => import('./mobile/index'))

function App({intl}) {
  const [dict, setDict] = useState({});

  const fetchDict = async () => {
    const dict = await intl.fetchDict();
    setDict(dict);
  }
  useEffect(() => {
    fetchDict()
    return () => {};
  }, [intl]);
  
  if(isBrowser){
    return <DesktopApp dict={dict}/>
  }
  if(isMobile){
    return <MobileApp/>
  }
}

export default inject('intl')(observer(App)) ;
