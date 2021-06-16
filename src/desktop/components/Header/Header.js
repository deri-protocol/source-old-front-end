import React from 'react'
import './header.less'
import Menu  from './Menu';
import Account from '../../../components/Account/Account';
import LanguageSelector  from '../../../components/LanguageSelector/LanguageSelector';
import useLang from '../../../hooks/useLang';
import { inject, observer } from 'mobx-react';
import { useRouteMatch } from 'react-router-dom';


function Header ({intl}){
  const lang = useLang(intl.dict,'header')
  const isHome = useRouteMatch('/home')
  return (
    <div className="nav">
      <Menu lang={lang}/>                            
      <div className='nav-right'>
        <Account/>
        <LanguageSelector/>
      </div>
    </div>
  )
}

export default inject('intl')(observer(Header))