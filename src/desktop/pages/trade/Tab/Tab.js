import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames';


export default function Tab({ lite = false, lang, isOptions }) {
  const history = useHistory();
  // const [isLite, setIsLite] = useState(true);

  const clazz = classNames('check-lite-pro', {
    lite: lite,
    pro: !lite
  })

  const redirect = path => {
    history.push(path)
  }


  return (
    <div className={clazz}>
      {!isOptions && <>
        <div className='lite' onClick={() => redirect('/futures/lite')} >{lang['lite']}</div>
        <div className='pro' onClick={() => redirect('/futures/pro')}> {lang['pro']}
        </div>
      </>}
      {isOptions && <>
        <div className='lite' onClick={() => redirect('/options/lite')} >{lang['lite']}</div>
        <div className='pro' onClick={() => redirect('/options/pro')}> {lang['pro']}
        </div>
      </>}
    </div>
  )
}