import React from 'react'
import './header.less'
import Menu  from './Menu';
import Account from '../../../components/Account/Account';
import LanguageSelector  from '../../../components/LanguageSelector/LanguageSelector';
import useLang from '../../../hooks/useLang';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom';


function Header ({intl}){
  const lang = useLang(intl.dict,'header');
  const isHome = useRouteMatch('/index');
  const isTeam = useRouteMatch('/team');
  return (
    <div className="nav">
      <div className='nav-container'>
      <Menu lang={lang} locale={intl.locale}/>                            
      <div className='nav-right'>
        <Account lang={lang} ignoreWallet={isHome || isTeam}/>
        <div className='use-deri'><Link to='/lite' target='_blank'>{lang['use-deri']}</Link></div>
        <LanguageSelector/>
      </div>
      </div>
    </div>
  )
}

export default inject('intl')(observer(Header))