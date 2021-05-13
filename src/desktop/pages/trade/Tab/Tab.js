import React, { useState,useEffect } from 'react'
import {useHistory} from 'react-router-dom'
import classNames from 'classnames';


export default function Tab({lite}){
  const history = useHistory();
  // const [isLite, setIsLite] = useState(true);

  const clazz = classNames('check-lite-pro',{
    lite : lite,
    pro : !lite
  })

  const redirect = path => {
    history.push(path)
  }
  

  return (
    <div className={clazz}>
      <div className='lite' onClick={() => redirect('/lite')} >LITE</div>
      <div className='pro' onClick={() => redirect('/pro')}> PRO
      </div>
    </div>
  )
}