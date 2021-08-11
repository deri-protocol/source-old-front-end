
import React, { useState, useEffect } from 'react'
import Position from "./Position";
import History from "./History";
import classNames from "classnames";

function Reference({lang}) {
  const [curTab, setCurTab] = useState('position');

  const switchTab = tab => {
    setCurTab(tab)
  }

  const curClassName = classNames('position-info',curTab)


  return (
    <div className={curClassName}>
      <div className='position-header'>
        <div className='position-title'>          
          <span className="position-info-title">{lang['position-info']}</span>
          <span className="history-info-title">{lang['trade-history']}</span>
        </div>
        <div className='check-position-history '>
          <div
            className='btn-position'
            onClick={() => switchTab('position')}
          >
            {lang['current-position']}
              </div>
          <div
            className='btn-history'            
            onClick={() => switchTab('history')}
          >
            {lang['trade-history']}
              </div>
        </div>
      </div>
      <div className='pos-his-info '>
        <Position lang={lang} />
        <History lang={lang}  />
      </div>
    </div>
  )
}
export default  Reference;
