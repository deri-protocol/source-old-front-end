import React, { useState, useEffect } from 'react'
import moment from 'moment'
import './countDown.less'
import FlipDown from './Flipdown'


export default function CountDown({lastTimestamp = moment('2021-10-13 00:00:00').unix() +1 ,lang}){
  useEffect(() => {
    const flipdown = new FlipDown(lastTimestamp,{theme : 'light'})
    flipdown.start()
  }, [lastTimestamp])
  return (
    <div className='count-down'>
      <div className='tip'>Time Remaining</div>
      <div id="flipdown" class="flipdown"></div>
    </div>
  )
}