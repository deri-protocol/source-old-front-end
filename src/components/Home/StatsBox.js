import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DeriNumberFormat from '../../utils/DeriNumberFormat'

export default function StatsBox({lang}){
  const [data, setData] = useState({})
  const loadData = async () => {
    const url = `${process.env.REACT_APP_INFO_HTTP_URL}/stats_for_homepage`
    const res = await axios.get(url);
    if(res.status === 200){
      setData(res.data)
    }
  }
  useEffect(() => {
    loadData();
  }, [])
  return (
    <div className='index_part2-center'>
      <div className='stats-box'>
        <div className='data'><DeriNumberFormat value={data.volume} prefix='$' decimalScale={0}  thousandSeparator={true}/></div>
        <div className='label'>{lang['total-volume']}</div>
      </div>
      <div className='stats-box'>
        <div className='data'><DeriNumberFormat value={data.transactions} /></div>
        <div className='label'>{lang['total-transactions']}</div>
      </div>
    </div>
  )
}