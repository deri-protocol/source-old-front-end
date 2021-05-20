/* eslint-disable jsx-a11y/alt-text */
import {useState} from 'react'
import menuIcon from '../../img/menu.png'
import logo from '../../img/deri-logo.png'
import Menu from './Menu';
import './header.less'

export default function Nav(){
  const [styles, setStyles] = useState({})
  const showMenu = () => {setStyles({left : 0})}
  const closeMenu = () => setStyles({left : '-110%'})

  // useEffect(() => {
  //   document.querySelector('.menu-left').addEventListener('click',event => {
  //     const target = event.target
  //     event.preventDefault()
  //   })
  //   return () => {};
  // }, []);
  return (
    <>
      <div className="nav">
        <img className="menu-icon" src={menuIcon} onClick={showMenu}/>
        <div className='menu-left' style={styles}>
          <Menu closeMenu={closeMenu}/>
        </div>
        <a className="logo" href="https://deri.finance/">
          <img src={logo} alt=""/>
        </a>
      </div>
    </> 
  )
}