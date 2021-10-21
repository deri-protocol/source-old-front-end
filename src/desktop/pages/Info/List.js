import React, { useState, useEffect } from 'react'
import './info.less'
import Table from './Table'
import axios from 'axios'
import { formatAddress } from '../../../utils/utils'
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import { useHistory } from 'react-router-dom'
import Chart from './Chart'
import { inject, observer } from 'mobx-react'
import AreaChart from './AreaChart'
import BarChart from './BarChart'
// import AreaChart from './AreaChart';
const HEADERS = ['ZONE','POOL','BASE TOKEN','POOL ADDRESS','LIQUIDITY','TRADE VOLUME']
const COLUMNS = ['zone','catalog','bToken','address','liquidity','notional']

const GET_POOL_URL=`${process.env.REACT_APP_INFO_HTTP_URL}/get_pools`

const columnFormat = {
  catalog : data => <span className='catalog'>{data.catalog.toUpperCase()}</span>,
  zone : data => data.catalog.indexOf('-') > 0 ? data.catalog.substring(data.catalog.indexOf('-') + 1,data.catalog.length).toUpperCase() : '',
  address : data => formatAddress(data.address),
  liquidity : data => <DeriNumberFormat value={data.liquidity}  suffix={` ${data.bToken.split('|')[0]}`}  thousandSeparator={true} decimalScale={2}/>,  
  notional : data =>  <DeriNumberFormat value={data.notional} suffix={` ${data.bToken.split('|')[0]}`}  thousandSeparator={true} decimalScale={2}/> ,
}
function List({loading}){
  const [allPoolData, setAllPoolData] = useState({})
  const history = useHistory()
  const loadAllPoolData = async () => {
    loading.loading();
    const res = await axios.get(GET_POOL_URL);
    if(res.status === 200 && res.data.data){
      setAllPoolData(res.data.data)
    }
    loading.loaded();
  }

  const onRowClick = d => {
    history.push(`/info/${d.address}/${d.catalog}/${d.bToken}/${d.chain}`)
  }

  useEffect(() => {
    loadAllPoolData();
    
  }, [])


  return(
    <div className='info'>
      <div className='title'>Deri Overview</div>
      <div className='chart-box'>
        <div className='chart'><AreaChart title='TVL' url = {`${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity_history`} seriesType='area'/> </div>
        <div className='chart'><BarChart title='Volume 24H' url = {`${process.env.REACT_APP_INFO_HTTP_URL}/get_trade_history`} seriesType='histogram' cycle={['W','M']} defaultCycle='M'/> </div>
      </div>
      <div className='table-by-network'>
        {Object.keys(allPoolData).map((chain,index) => <Table title={chain} key={index} headers={HEADERS} columns={COLUMNS} columnRenders={columnFormat} onRowClick={d => onRowClick(d)} dataSet={allPoolData[chain]}/>)}
      </div>
    </div>
  )
}
export default inject('loading')(observer(List))