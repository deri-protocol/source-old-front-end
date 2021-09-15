import React, { useState, useEffect } from 'react'
import './list.less'
import Table from './Table'

export default function List(){
  const [liqSummaryData, setLiqSummaryData] = useState([])
  const [tradeSummaryData, setTradeSummaryData] = useState([])
  const loadLiquditySummaryData = async () => {

  }

  const loadTradeSummaryData = async () => {

  }

  useEffect(() => {
    const loadData = async () => {

    }
    loadData();
  }, [])


  return(
    <div className='info'>
      <div className='title'>DERI INFO</div>
      <div className='chart'>
        <div className='liquidity-chart'></div>
        <div className='trade-chart'></div>
      </div>
      <div className='liqudity'>
        <Table tittle='LIQUDITY' data={liqSummaryData}/>
        <Table tittle='LIQUDITY' data={tradeSummaryData}/>
      </div>
      <div className='trade'></div>
    </div>
  )
}