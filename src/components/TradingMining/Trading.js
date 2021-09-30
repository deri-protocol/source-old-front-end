import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button';
import DeriNumberFormat from '../../utils/DeriNumberFormat'

function Trading({ wallet, lang }) {
  const [TotalNotional, setTotalNotional] = useState(0)
  const [yourNotional, setYourNotional] = useState(0)
  return (
    <div>
      <div className='trading-title'>
        {lang['trading']}
      </div>
      <div className='trading-provide'>
        {lang['trading-on-deri-finance-can-get-trading-rewards']}
      </div>
      <div className='trading-info'>
        <div className='trading-scored'>
          <div className='trading-total'>
            <div className='trading-info-title'>
              {lang['total-transaction-notional']}
            </div>
            <div className='trading-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={TotalNotional} decimalScale={0} />
            </div>
          </div>
          <div className='trading-your'>
            <div className='trading-info-title'>
              {lang['your-transaction-notional']}
            </div>
            <div className='trading-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={yourNotional} decimalScale={0} />
            </div>
          </div>
        </div>
        
      </div>
      <div className='trading-button'>
        <div className='trading-button-title'>
          <div>
            
          </div>
        </div>
        <div className='trading-add-remove'>
          <a href='https://app.deri.finance/#/futures/pro' className='btn'>{lang['futures']}</a>
          <a href='https://app.deri.finance/#/options/pro' className='btn'>{lang['options']}</a>
        </div>
      </div>
      <div className='rules'>
        <div>
          {lang['activity-rules']}
        </div>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Trading))

