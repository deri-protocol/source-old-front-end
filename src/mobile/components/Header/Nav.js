/* eslint-disable jsx-a11y/alt-text */
import {useState} from 'react'
import menuIcon from '../../img/menu.png'
import logo from '../../img/deri-logo.png'
import Menu from './Menu'; 
import './header.less'
import Version from '../../../components/Version/Version';
import  LanguageSelector from '../../../components/LanguageSelector/LanguageSelector';

export default function Nav(){
  const [styles, setStyles] = useState({})
  const showMenu = () => {setStyles({left : 0})}
  const closeMenu = () => setStyles({left : '-110%'})

  return (
      <div className="nav">
        <img className="menu-icon" src={menuIcon} onClick={showMenu}/>
        <div className='menu-left' style={styles}>
          <Menu closeMenu={closeMenu}/>
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