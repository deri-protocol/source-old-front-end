import React from 'react'
import './header.less'
import Menu  from './Menu';
import Account from '../../../components/Account/Account';
import LanguageSelector  from '../../../components/LanguageSelector/LanguageSelector';
import useLang from '../../../hooks/useLang';
import { inject, observer } from 'mobx-react';


function Header ({intl}){
  const lang = useLang(intl.dict,'header')

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