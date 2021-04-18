import React from 'react'
import './nav.less'
import Menu  from './Menu';
import Account from './Account';


export default function Nav (){
  return (
    <div className="nav">
      <Menu/>
      <Account/>
    </div>
  )
}