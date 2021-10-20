
import './info.less'
import Table from './Table'
import { useParams } from 'react-router-dom'
import { formatAddress } from '../../../utils/utils'
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import moment from 'moment'
import Chart from './Chart'
import { Link } from 'react-router-dom'

const LIQUIDITY_HEADER = ['ACTION','ACCOUNT','LIQUIDITY','AMOUNT','TIMESTAMP (UTC)']
const LIQUIDITY_COLUMNS = ['action','account','notional','amount','timestamp']
const GET_LIQUIDITY_URL = `${process.env.REACT_APP_INFO_HTTP_URL}`

const TRADE_HEADER = ['DIRECTION','ACCOUNT','SYMBOL','PRICE','VOLUME','NOTIONAL','TIMESTAMP (UTC)']
const TRADE_COLUMNS = ['direction','account','symbol','price','volume','notional','timestamp']


const columnFormat = {
  account : data => formatAddress(data.account),
  timestamp : data =>  moment(new Date(data.timestamp * 1000)).utc().format('YYYY-MM-DD HH:mm:ss'),
  notional : data => <DeriNumberFormat value={data.notional} prefix='$' thousandSeparator={true} decimalScale={5}/>,  
  amount : data =>  <DeriNumberFormat value={data.amount} suffix={` ${data.bToken}`} thousandSeparator={true} decimalScale={5}/> ,
  price : data =>  <DeriNumberFormat value={data.price} thousandSeparator={true}  decimalScale={5}/>,
  direction : data => <span className={`direction ${data.direction}`}>{data.direction}</span>,
  action : data => <span className={`action ${data.action}`}>{data.action}</span>
}


export default function Detail(){
  const {network,add,catalog,bToken} =  useParams();
  const getLiquidityDataUrl = `${GET_LIQUIDITY_URL}/get_liquidity?pool=${add}`
  const getTradeDataUrl = `${GET_LIQUIDITY_URL}/get_trade?pool=${add}`

  return(
    <div className='info'>
    <div className='title'><Link to='/info'>Deri Overview</Link> &gt; {`${network} - ${catalog.toUpperCase()} - ${formatAddress(add)} (${bToken})`}</div>
      <div className='chart-box'>
        <div className='chart'><Chart title='TVL' url = {`${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity_history?pool=${add}`} seriesType='area'/> </div>
        <div className='chart'><Chart title='Volume 24H' url = {`${process.env.REACT_APP_INFO_HTTP_URL}/get_trade_history?pool=${add}`} seriesType='histogram' cycle={['W','M']} defaultCycle='M'/> </div>
      </div>
      <div className='table-by-network'>
        <Table title='LIQUIDITY' headers={LIQUIDITY_HEADER} columns={LIQUIDITY_COLUMNS} columnRenders={columnFormat} url={getLiquidityDataUrl} pagination={true}/>
        <Table title='TRADE' headers={TRADE_HEADER} columns={TRADE_COLUMNS} columnRenders={columnFormat}  url={getTradeDataUrl} pagination={true}/>
      </div>
    </div>
  )
}