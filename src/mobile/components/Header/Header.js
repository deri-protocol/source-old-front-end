/* eslint-disable jsx-a11y/alt-text */
import {useState} from 'react'
import menuIcon from '../../img/menu.png'
import logo from '../../img/deri-logo.png'
import Menu from './Menu'; 
import './header.less'
import Version from '../../../components/Version/Version';
import  LanguageSelector from '../../../components/LanguageSelector/LanguageSelector';
import { inject, observer } from 'mobx-react';
import useLang from '../../../hooks/useLang';

function Header({intl}){
  const [styles, setStyles] = useState({})
  const showMenu = () => {setStyles({left : 0})}
  const closeMenu = () => setStyles({left : '-110%'})
  const header = useLang(intl.dict,'header')
  const footer = useLang(intl.dict,'footer')

  return (
      <div className="nav">
        <img className="menu-icon" src={menuIcon} onClick={showMenu}/>
        <div className='menu-left' style={styles}>
          <Menu closeMenu={closeMenu} lang={Object.assign(header,footer)}/>
        </div>
        <a className="logo" href="https://deri.finance/">
          <img src={logo} alt=""/>
        </a>
        <div className='nav-right'>
          <LanguageSelector/>
          <Version/>
        </div>
      </div> 
  )
}
export default inject('intl')(observer(Header))