import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Table({title,url,headers,columns,columnRenders,pagination}){
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState()
  const [pageSize, setPageSize] = useState(10)

  const loadData = async url => {
    const res = await axios.get(`${url}&page=${page}&page_amount=${pageSize}`);
    if(res.status === 200 && Array.isArray(res.data.data)){
      setCount(res.data.count / pageSize)
      if(res.data.count % pageSize > 0 ){
        setCount(Math.floor(res.data.count / pageSize) +1)
      }
      setData(res.data.data)
    }
  }

  const prePage = () => {

  }
  const nextPage = () => {

  }

  useEffect(() => {
    loadData(url);
  }, [url])
  return(
    <div className='info-table'>
      <div className='t-title'>{title}</div>
      <div className='tbody'>
        <div className='theader'>
          {headers.map(header => <div className='col'>{header}</div>)}
        </div>
        {data.map(d => (
          <div className='row'>
            {columns.map(col => <div className='col'>{columnRenders[col] ? columnRenders[col].call(null,d) :d[col]}</div>)}
            <div></div>
          </div>))}
        <div className='pagination row'>
          <span className='arrow' onClick={prePage}> &lt; </span><span>Page {page} of {count}</span><span className='arrow' onClick={prePage}> &gt; </span>
        </div>
      </div>
    </div>
  )
}