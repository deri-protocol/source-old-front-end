
import './info.less'
import Table from './Table'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'

const LIQUIDITY_HEADER = ['DIRECTION','ACCOUNT','NOTIONAL','AMOUNT','TIMESTAMP']
const LIQUIDITY_COLUMNS = ['direction','account','notional','volume','timestamp']
const GET_LIQUIDITY_URL = `${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity`

const TRADE_HEADER = ['DIRECTION','ACCOUNT','VOLUME','PRICE','NOTIONAL','TIMESTAMP']
const TRADE_COLUMNS = ['direction','account','volume','price','notional','timestamp']

export default function Detail({}){
	const {add} =  useParams();

  return(
    <div className='info'>
      <div className='title'>DERI INFO</div>
      <div className='chart'>
        <div className='liquidity-chart'></div>
        <div className='trade-chart'></div>
      </div>
      <div className='table-by-network'>
        <Table title='LIQUIDITY' headers={LIQUIDITY_HEADER} colums={LIQUIDITY_COLUMNS} url={`${GET_LIQUIDITY_URL}?pool=${add}&page=1&page_amount=10`}/>
        <Table title='TRADE' headers={TRADE_HEADER} colums={TRADE_COLUMNS} url={`${GET_LIQUIDITY_URL}?pool=${add}&page=1&page_amount=10`}/>
      </div>
    </div>
  )
}