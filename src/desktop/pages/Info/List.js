import React, { useState, useEffect } from 'react'
import './info.less'
import Table from './Table'
import config from '../../../config.json'
const HEADERS = ['BASE TOKEN','ADDRESS','LIQUIDITY','TRADING VOLUME']
const COLUMNS = ['baseToken','address','liquidity','volume']
const NETWORKDS = ['56','1','137']

const chainConfig = config['prod']['chainInfo']
const TABLE_CONFIG = NETWORKDS.map(chainId => (
  [chainConfig[chainId].code,HEADERS,COLUMNS,`${process.env.REACT_APP_HTTP_URL}/get_summary_data_by_network?chainId=${chainId}`]
))

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
      <div className='table-by-network'>
        {TABLE_CONFIG.map(config => <Table title={config[0]} headers={config[1]} columns={config[2]} url={config[3]}/>)}
      </div>
    </div>
  )
}