import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {ResponsiveContainer,BarChart,XAxis,YAxis,Tooltip,Bar,CartesianGrid} from 'recharts'
import dateFormat  from 'dateformat';
import { convertToInternationalCurrencySystem } from '../../../utils/utils';
import CustomTooltip from './CustomTooltip';

class CustomizedAxisTick extends React.PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    );
  }
}
export default function RechartBar({title,url}){
  const [data, setData] = useState([])
  const [parentRect, setParentRect] = useState({})
  const loadData = async () => {
    // const url = `${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity_history`
    const res = await axios.get(url)
    let data = []
    if(res.status === 200 && Array.isArray(res.data.data)){
      data = res.data.data.sort((item1,item2) => {
        if(item1.timestamp > item2.timestamp) {
          return 1
        } else if(item1.timestamp < item2.timestamp){
          return -1
        } else {
          return 0
        }
      })
    }
    setData(data.map(d => ({time : d.timestamp,value : Number(d.value)})))
  }
  const tickFormatter = tick => {
    if(tick && tick !== 'auto') {
      return dateFormat(new Date(tick * 1000),'mm-dd') 
    } else {
      return ''
    }
  }
  useEffect(() => {
    const rect = document.querySelector('.chart').getBoundingClientRect()
    setParentRect(rect)
    loadData();
  }, [])
  return (
    // <ResponsiveContainer >
      <BarChart height={250} width={parentRect.width} data={data}>
        <defs>
          <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00659f" stopOpacity={0.85}/>
            <stop offset="95%" stopColor="#00659f" stopOpacity={0}/>
          </linearGradient>
        </defs>
      <XAxis dataKey="time"  axisLine={false} tickLine={false} tick={{fill: '#fff',fontSize : '14'}}  padding={{right : 20}}  tickFormatter={tickFormatter} interval={3}/>
      <YAxis dataKey='value' hide  />
      <Tooltip position={{x : 0,y : 0}} cursor={{ stroke: '#fff', fill : '#00659f', strokeWidth: 0,fillOpacity : 0.1 }} content={<CustomTooltip title={title}/>}/>
      <Bar type="monotone" dataKey="value" fill="#00659f" fillOpacity={0.9}  />
    </BarChart>
  // </ResponsiveContainer>
  )
}