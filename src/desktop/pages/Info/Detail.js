
import './info.less'
import Table from './Table'
import { useParams } from 'react-router-dom'
import { formatAddress } from '../../../utils/utils'
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import moment from 'moment'

const LIQUIDITY_HEADER = ['ACTION','ACCOUNT','NOTIONAL','AMOUNT','TIME']
const LIQUIDITY_COLUMNS = ['action','account','notional','amount','timestamp']
const GET_LIQUIDITY_URL = `${process.env.REACT_APP_INFO_HTTP_URL}`

const TRADE_HEADER = ['DIRECTION','ACCOUNT','VOLUME','PRICE','NOTIONAL','TIME']
const TRADE_COLUMNS = ['direction','account','volume','price','notional','timestamp']


const columnFormat = {
  account : data => formatAddress(data.account),
  timestamp : data =>  moment(new Date(data.timestamp * 1000)).format('YYYY-MM-DD HH:mm:ss'),
  notional : data => <DeriNumberFormat value={data.notional} prefix='$' thousandSeparator={true} decimalScale={2}/>,  
  amount : data =>  <DeriNumberFormat value={data.amount} suffix={` ${data.bToken}`} thousandSeparator={true} decimalScale={2}/> ,
  price : data =>  <DeriNumberFormat value={data.price} thousandSeparator={true} decimalScale={2}/>,
  direction : data => <span className={`direction ${data.direction}`}>{data.direction}</span>,
  action : data => <span className={`action ${data.action}`}>{data.action}</span>
}


export default function Detail({}){
  const {add} =  useParams();
  const getLiquidityDataUrl = `${GET_LIQUIDITY_URL}/get_liquidity?pool=${add}`
  const getTradeDataUrl = `${GET_LIQUIDITY_URL}/get_trade?pool=${add}`
  return(
    <div className='info'>
      <div className='title'>DERI INFO</div>
      <div className='chart'>
        <div className='liquidity-chart'></div>
        <div className='trade-chart'></div>
      </div>
      <div className='table-by-network'>
        <Table title='LIQUIDITY' headers={LIQUIDITY_HEADER} columns={LIQUIDITY_COLUMNS} columnRenders={columnFormat} url={getLiquidityDataUrl} pagination={true}/>
        <Table title='TRADE' headers={TRADE_HEADER} columns={TRADE_COLUMNS} columnRenders={columnFormat}  url={getTradeDataUrl} pagination={true}/>
      </div>
    </div>
  )
}