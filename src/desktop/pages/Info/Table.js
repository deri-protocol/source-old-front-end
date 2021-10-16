import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { inject, observer } from 'mobx-react'

function Table({title,dataSet,url,headers,columns,columnRenders = {},pagination,loading,onRowClick}){
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [count, setCount] = useState()
  const [pageSize, setPageSize] = useState(10)

  const loadData = async (url,page) => {
    let restUrl = url;
    if(pagination){
      restUrl = `${restUrl}&page=${page}&page_amount=${pageSize}`
    }
    loading.loading()
    const res = await axios.get(restUrl);
    if(res.status === 200 && Array.isArray(res.data.data)){
      setCount(res.data.count / pageSize)
      if(res.data.count % pageSize > 0 ){
        setCount(Math.floor(res.data.count / pageSize) +1)
      }
      setData(res.data.data)
      setPage(page)
      loading.loaded()
    }
  }

  const prePage = () => {
    if(page === 1){
      return;
    }
    loadData(url,page - 1)
  }
  const nextPage = () => {
    if(page === count){
      return;
    }

    loadData(url,page +1)
  }

  useEffect(() => {
    if(dataSet){
      setData(dataSet)
    } else {
      loadData(url,1);
    }
  }, [url])
  return(
    <div className='info-table'>
      <div className='t-title'>{title}</div>
      <div className='tbody'>
        <div className='theader'>
          {headers.map((header,index) => <div className='col' key={index}>{header}</div>)}
        </div>
        {data.length > 0 ? data.map((d,index) => (
          <div className='row' key={index} onClick={() => onRowClick && onRowClick(d)} style={{cursor : onRowClick ? 'pointer' : 'normal'}}>
            {columns.map((col,index) => <div className='col' key={index}>{columnRenders[col] ? columnRenders[col].call(null,d) :d[col]}</div>)}
          </div>))
          :
          <div className='row'><div className='col no-data'>No Data</div></div>
          }
         

        {pagination && data.length > 0 && <div className='pagination row'>
          <span className='arrow' onClick={prePage}> &lt; </span><span>Page {page} of {count}</span><span className='arrow' onClick={nextPage}> &gt; </span>
        </div>}
      </div>
    </div>
  )
}
export default inject('loading')(observer(Table))