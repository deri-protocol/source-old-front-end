import React, { useState, useEffect } from 'react'
import bnbLogo from '../img/bnb.svg'
import deriLogo from '../img/deri.svg'
export default function Staking({ lang }) {

  return (
    <div className='rewards-bnb-deri'>
      {/* <div className='bnb-total'>
       <div className='bnb-title'>
        {lang['top-ten-transaction-sharing-pool']}
       </div>
       <div className='bnb-num'>
          <img src={bnbLogo}></img>
          <span>$ 500,000</span>
       </div>
     </div> */}
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


