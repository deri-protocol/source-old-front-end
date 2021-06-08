import React from 'react'
import './nav.less'
import Menu  from './Menu';
import Account from '../../../components/Account/Account';


export default function Nav ({dict}){
  return (
    <div className="nav">
      <Menu/>
      <Account/>
    </div>
  )
}