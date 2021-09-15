import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Table({title,url,headers,colums,pagination}){
  const [data, setData] = useState([])

  const loadData = async url => {
    const res = await axios.get(url);
    if(res.ok && Array.isArray(res.data.data)){
      setData(res.data.data)
    }
  }

  useEffect(() => {
    loadData(url);
  }, [url])
  return(
    <div className='info-table'>
      <div className='t-tile'>{title}</div>
      <div className='tbody'>
        <div className='theader'>
          {headers.map(header => <div className='col'>{header}</div>)}
        </div>
        {data.map(d => (
          <div className='row'>
            {colums.map(col => <div className='col'>{d[col]}</div>)}
            <div></div>
          </div>))}
      </div>
      <div className='pagination'>

      </div>
    </div>
  )
}