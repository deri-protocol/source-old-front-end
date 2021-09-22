import React, { useState, useEffect } from 'react'
import './info.less'
import Table from './Table'
import config from '../../../config.json'
import axios from 'axios'
import { formatAddress } from '../../../utils/utils'
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import { useHistory } from 'react-router-dom'
import Chart from './Chart'
import { inject, observer } from 'mobx-react'
const HEADERS = ['Catalog','BASE TOKEN','ADDRESS','LIQUIDITY','TRADING NOTIONAL']
const COLUMNS = ['catalog','bToken','address','liquidity','notional']

const GET_POOL_URL=`${process.env.REACT_APP_INFO_HTTP_URL}/get_pools`

const columnFormat = {
  catalog : data => <span className='catalog'>{data.catalog}</span>,
  address : data => formatAddress(data.address),
  liquidity : data => <DeriNumberFormat value={data.liquidity}  suffix={` ${data.bToken.split('|')[0]}`}  thousandSeparator={true} decimalScale={2}/>,  
  notional : data =>  <DeriNumberFormat value={data.notional} suffix={` ${data.bToken.split('|')[0]}`}  thousandSeparator={true} decimalScale={2}/> ,
  // price : data =>  <DeriNumberFormat value={data.price} thousandSeparator={true} decimalScale={2}/>,
  // direction : data => <span className={`direction ${data.direction}`}>{data.direction}</span>,
  // action : data => <span className={`action ${data.action}`}>{data.action}</span>
}
function List({loading}){
  const [liqSummaryData, setLiqSummaryData] = useState([])
  const [tradeSummaryData, setTradeSummaryData] = useState([])
  const [allPoolData, setAllPoolData] = useState({})
  const history = useHistory()
  const loadLiquditySummaryData = async () => {

  }

  const loadTradeSummaryData = async () => {

  }
  const loadAllPoolData = async () => {
    loading.loading();
    const res = await axios.get(GET_POOL_URL);
    if(res.status === 200 && res.data.data){
      setAllPoolData(res.data.data)
    }
    loading.loaded();
  }

  const onRowClick = d => {
    history.push(`/info/${d.address}`)
  }

  useEffect(() => {
    loadAllPoolData();
  }, [])


  return(
    <div className='info'>
      <div className='title'>DERI INFO</div>
      <div className='chart-box'>
        <div className='chart'><Chart title='Liquidity' url = {`${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity_history`} seriesType='area'/> </div>
        <div className='chart'><Chart title='Trade Volume' url = {`${process.env.REACT_APP_INFO_HTTP_URL}/get_trade_history`} seriesType='histogram'/> </div>
      </div>
      <div className='table-by-network'>
        {Object.keys(allPoolData).map(chain => <Table title={chain} headers={HEADERS} columns={COLUMNS} columnRenders={columnFormat} onRowClick={d => onRowClick(d)} dataSet={allPoolData[chain]}/>)}
      </div>
    </div>
  )
}
export default inject('loading')(observer(List))