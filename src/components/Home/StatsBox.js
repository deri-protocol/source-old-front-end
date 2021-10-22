import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountUp from 'react-countup'
import VisibilitySensor from 'react-visibility-sensor'

export default function StatsBox({lang}){
  const [data, setData] = useState({})
  const [isVolumeActive, setIsVolumeActive] = useState(true)
  const [isTransactionActive, setIsTransactionActive] = useState(true)
  const loadData = async () => {
    const url = `${process.env.REACT_APP_INFO_HTTP_URL}/stats_for_homepage`
    const res = await axios.get(url);
    if(res.status === 200){
      setData(res.data)
    }
  }
  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
      setIsTransactionActive(true)
      setIsVolumeActive(true)
      // setData({volume : 1277053675.20694 + 100,transactions :13025 + 200})
    },1000 * 60 * 5)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className='index_part2-center'>
      <VisibilitySensor  
        active={isVolumeActive}
        onChange={isVisible => isVisible && setIsVolumeActive(false)} >
        {({isVisible}) => {
          return (
            <div className='stats-box'>
              <div className='data'>
                {(isVisible && data.volume) ? <CountUp
                  start={0}
                  end={data.volume}
                  duration={4.75}
                  separator=","
                  decimal=","
                  prefix="$ "
                /> : <div className='loading-line'></div>}
              </div>
            <div className='label'>{lang['total-volume']}</div>
          </div>)
        }}
      </VisibilitySensor>
      <VisibilitySensor  
        active={isTransactionActive}
        onChange={isVisible => isVisible && setIsTransactionActive(false)} >
          {({isVisible}) => {
            return (
              <div className='stats-box'>
                <div className='data'>
                  {(isVisible && data.transactions) ? <CountUp 
                    start={0}
                    duration={3.75}
                    separator=","
                    decimal=","
                    end={data.transactions} 
                  /> : <div className='loading-line'></div>}
              </div>
              <div className='label'>{lang['total-transactions']}</div>
            </div>)
          }}
      </VisibilitySensor>
    </div>
  )
}