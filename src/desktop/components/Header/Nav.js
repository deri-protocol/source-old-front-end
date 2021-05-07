import React from 'react'
import './nav.less'
import Menu  from './Menu';
import Account from '../../../components/Account/Account';


export default function Nav (){
  return (
    <div className="nav">
      <Menu/>
      <Account/>
    </div>
  )
}