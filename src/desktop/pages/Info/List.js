import React, { useState, useEffect } from 'react'
import './info.less'
import Table from './Table'
import config from '../../../config.json'
import axios from 'axios'
import { formatAddress } from '../../../utils/utils'
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import { Link } from 'react-router-dom'
const HEADERS = ['Catalog','BASE TOKEN','ADDRESS','LIQUIDITY','TRADING NOTIONAL']
const COLUMNS = ['catalog','bToken','address','liquidity','notional']

const GET_POOL_URL=`${process.env.REACT_APP_INFO_HTTP_URL}/get_pools`

const columnFormat = {
  catalog : data => <span className='catalog'>{data.catalog}</span>,
  address : data => <Link to={`/info/${data.address}`}> {formatAddress(data.address)}</Link>,
  liquidity : data => <DeriNumberFormat value={data.liquidity}  suffix={` ${data.bToken.split('|')[0]}`}  thousandSeparator={true} decimalScale={2}/>,  
  notional : data =>  <DeriNumberFormat value={data.notional} suffix={` ${data.bToken.split('|')[0]}`}  thousandSeparator={true} decimalScale={2}/> ,
  // price : data =>  <DeriNumberFormat value={data.price} thousandSeparator={true} decimalScale={2}/>,
  // direction : data => <span className={`direction ${data.direction}`}>{data.direction}</span>,
  // action : data => <span className={`action ${data.action}`}>{data.action}</span>
}
export default function List(){
  const [liqSummaryData, setLiqSummaryData] = useState([])
  const [tradeSummaryData, setTradeSummaryData] = useState([])
  const [allPoolData, setAllPoolData] = useState({})
  const loadLiquditySummaryData = async () => {

  }

  const loadTradeSummaryData = async () => {

  }
  const loadAllPoolData = async () => {
    const res = await axios.get(GET_POOL_URL);
    if(res.status === 200 && res.data.data){
      setAllPoolData(res.data.data)
    }
  }

  useEffect(() => {
    loadAllPoolData();
  }, [])


  return(
    <div className='info'>
      <div className='title'>DERI INFO</div>
      <div className='chart'>
        <div className='liquidity-chart'></div>
        <div className='trade-chart'></div>
      </div>
      <div className='table-by-network'>
        {Object.keys(allPoolData).map(chain => <Table title={chain} headers={HEADERS} columns={COLUMNS} columnRenders={columnFormat} dataSet={allPoolData[chain]}/>)}
      </div>
    </div>
  )
}