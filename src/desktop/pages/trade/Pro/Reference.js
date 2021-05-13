
import React, { useState, useEffect } from 'react'
import Position from "./Position";
import History from "./History";
import classNames from "classnames";

export default function Reference({wallet,spec}) {
  const [curTab, setCurTab] = useState('position');

  const switchTab = tab => {
    setCurTab(tab)
  }


  const curClassName = classNames('position-info',curTab)

  return (
    <div className={curClassName}>
      <div className='position-header'>
        <div className='position-title'>          
          <span className="position-info-title">POSITION INFO</span>
          <span className="history-info-title">TRADE HISTORY</span>
        </div>
        <div className='check-position-history '>
          <div
            className='btn-position'
            onClick={() => switchTab('position')}
          >
            CURRENT POSITION
              </div>
          <div
            className='btn-history'            
            onClick={() => switchTab('history')}
          >
            TRADE HISTORY
              </div>
        </div>
      </div>
      <div className='pos-his-info '>
        <Position wallet={wallet} spec={spec}/>
        <History wallet={wallet} spec={spec}/>
      </div>
    </div>
  )
}