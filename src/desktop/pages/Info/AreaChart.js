import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {AreaChart,XAxis,YAxis,Tooltip,Area} from 'recharts'
import dateFormat  from 'dateformat';
import CustomTooltip from './CustomTooltip';

export default function RechartArea({url,title}){
  const [data, setData] = useState(null)
  const [lastItem, setLastItem] = useState({})
  const [parentRect, setParentRect] = useState({})
  const loadData = async () => {
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
      if(data.length > 0){
        setLastItem(data[data.length -1])
      }
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
  
  return (data ? 
    <AreaChart height={300} width={parentRect.width} data={data}>
      <defs>
        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#00659f" stopOpacity={0.85}/>
          <stop offset="95%" stopColor="#00659f" stopOpacity={0}/>
        </linearGradient>
      </defs>
    <XAxis dataKey="time"  axisLine={false} tickLine={false} tick={{fill: '#fff',fontSize : '14'}} padding={{left : 12,right : 10}} allowDataOverflow={false} tickFormatter={tickFormatter} interval={3}/>
    <YAxis dataKey='value' hide padding={{top : 65}}/>
    <Tooltip position={{x : 0,y : 0}} cursor={false} content={<CustomTooltip title={title} lastItem={lastItem}/>}  />
    <Area type="monotone" dataKey="value" stroke="#00659f" fillOpacity={0.5} strokeWidth={2} fill="url(#colorArea)" />
  </AreaChart> : null
  )
}