import React, { useState, useEffect } from 'react'
import bnbLogo from '../img/bnb.svg'
import add from '../img/add.svg'
import deriLogo from '../img/deri.svg'
import blindBox from '../img/blindbox.png'
export default function Staking({ lang }) {

  return (
    <div className='rewards-bnb-deri'>
      <div className='bnb-total'>
        <div className='bnb-title'>
        Top 10 Leaderboard Reward
        </div>
        <div className='bnb-num'>
          {/* <div className='bnb-deri-logo'>
            <img src={bnbLogo} alt=''></img>
            <img className='add-logo' src={add} alt=''></img>
            <img src={deriLogo} alt=''></img>
          </div>
          <span>$ 500,000</span> */}
          <img className='blind-box' alt='' src={blindBox}/>
        </div>
      </div>
      
      <div className='deri-total'>
        <div className='deri-title'>
          {lang['transaction-sharing-pool']}
        </div>
        <div className='deri-num'>
          <img src={deriLogo} alt=''></img>
          <span>$ 1,000,000</span>
        </div>
      </div>
    </div>
  )
}


