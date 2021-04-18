import menuIcon from '../../img/menu.png'
import logo from '../../img/deri-logo.png'
import Menu from './Menu';
import './header.less'

export default function Nav(){

  return (
    <div className="nav">
      <img className="menu" src={menuIcon}/>
      <a className="logo" href="https://deri.finance/">
        <img src={logo} alt=""/>
      </a>
      <Menu/> 
    </div>
  )
}