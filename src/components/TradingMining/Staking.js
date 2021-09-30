import React,{useState,useEffect} from 'react'
import { inject, observer } from 'mobx-react';

function Staking ({wallet,lang}){
  return(
    <div>
      <div className='staking-title'>
        {lang['staking']}
      </div>
      <div className='staking-provide'>
        {/* {lang['provide-pledged']} */}
      </div>
      <div className='staking-info'>
        <div className='staking-scored'>
          <div></div>
          <div></div>
        </div>
        <div className='staking-staked'>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Staking))

