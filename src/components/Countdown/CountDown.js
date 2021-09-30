import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './countDown.less'

export default function CountDown({beginTimestamp = Date.now(),lastTimestamp = moment('2021-10-11 00:00:00') ,lang}){
  const [days, setDays] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('')
  useEffect(() => {
    const eventTime = moment(lastTimestamp).unix();
    const currentTime = moment(beginTimestamp).unix();
    let  diffTime = eventTime - currentTime;
    let  duration = moment.duration(diffTime * 1000, 'milliseconds')
    const interval = setInterval(() => {
      duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
      let d = moment.duration(duration).days(),
          h = moment.duration(duration).hours(),
          m = moment.duration(duration).minutes(),
          s = moment.duration(duration).seconds();
        d = d.length === 1 ? '0' + d : d;
        h = h.length === 1 ? '0' + h : h;
        m = m.length === 1 ? '0' + m : m;
        s = s.length === 1 ? '0' + s : s;
        setDays(d);
        setHours(h);
        setMinutes(m);
        setSeconds(s)
    },1000)
    return () => clearInterval(interval)
  }, [lastTimestamp,beginTimestamp])
  return (
    <div className='count-down'>
      <div className='c-d-title'>Activity Start Countdown</div>
      <div className='c-d-clock'>
        <div>{days}<div>{lang['days']}</div></div> : 
        <div>{hours}<div>{lang['hours']}</div></div>: 
        <div>{minutes}<div>{lang['minutes']}</div></div>: 
        <div>{seconds}<div>{lang['seconds']}</div></div>  
      </div>
    </div>
  )
}