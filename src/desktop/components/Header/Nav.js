import React from 'react'
import './nav.less'
import Menu  from './Menu';
import Account from './Account';
import { WalletContext } from '../../../context/WalletContext';


export default function Nav (){
  return (
    <div className="nav">
      <Menu/>
      {/* <WalletContext.Consumer>
        {
          ({wallet}) => <Account wallet={wallet}/> 
        }
      </WalletContext.Consumer> */}
      <Account/>
    </div>
  )
}