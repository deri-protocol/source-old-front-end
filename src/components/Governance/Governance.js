import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import classNames from 'classnames';
import { Link } from 'react-router-dom'
import DipTwo from './DipTwo'
function Governance({ wallet = {}, lang }){
  const [curTab, setCurTab] = useState(true) 
  
  const switchTab = async (current) => {
    setCurTab(current)
  }
  return(
    <div className='governance_box'>
      <div className='check'>
        <div className={curTab ? 'checked-now' : ''}  onClick={() => switchTab(true)}>{lang['vote-now']}</div>
        <div className={curTab ? '' : 'checked-now'} onClick={() => switchTab(false)}>{lang['closed']}</div>
      </div>
      {curTab && <>
        <div className='now-vote'>
          <DipTwo lang={lang} />
        </div>
      </>}
      {!curTab && <>
        <div className='closed'>
          <div className='title'>
            {lang['dip-list-title']}
          </div>
          {/* <div className='link'>
            <Link to='/diphistorytwo'> {lang['dip-two']} </Link>
          </div> */}
          <div >
            <Link to='/diphistory'> {lang['dip-one']} </Link>
          </div>
          
        </div>
      </>}
    </div>
  )
}
export default inject('wallet')(observer(Governance))