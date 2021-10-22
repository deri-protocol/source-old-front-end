import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {BarChart,XAxis,YAxis,Tooltip,Bar} from 'recharts'
import dateFormat  from 'dateformat';
import CustomTooltip from './CustomTooltip';

export default function RechartBar({url,title}){
  const [data, setData] = useState(null)
  const [lastItem, setLastItem] = useState({})
  const [curCycle, setCurCycle] = useState('M')
  const [parentRect, setParentRect] = useState({})
  const [barPosData, setBarPosData] = useState({})
  const cycle = ['W','M']
  const loadData = async (url) => {
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
        const last24Volume = res.data.last_24h ? res.data.last_24h : data[data.length -1].value
        setLastItem({timestamp : data[data.length -1].timestamp , value : last24Volume})
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
  const cycleSelect = cycle => {
    setCurCycle(cycle)
    const filterUrl = /\?/.test(url) ? `${url}&cycle=${cycle}` : `${url}?cycle=${cycle}`
    loadData(filterUrl)
  }

  useEffect(() => {
    const rect = document.querySelector('.chart').getBoundingClientRect()
    setParentRect(rect)
    loadData(url);
  }, [])
  return (
    data ? <div >
      <div className='cycle-c'>
        {cycle.map((item,index) => <div className={`cycle-item ${item === curCycle && 'selected'}`} key={index} onClick={() => cycleSelect(item)}>{item}</div>)}
      </div>
       <BarChart height={300} width={parentRect.width} data={data}>
        <defs>
          <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00659f" stopOpacity={0.85}/>
            <stop offset="95%" stopColor="#00659f" stopOpacity={0}/>
          </linearGradient>
        </defs>
      <XAxis dataKey="time"  axisLine={false} tickLine={false} tick={{fill: '#fff',fontSize : '14'}}  padding={{left : 12,right : 12}}  tickFormatter={tickFormatter} interval={3}/>
      <YAxis dataKey='value' hide padding={{top : 65}} />
      <Tooltip position={{x : 0,y : 0}}  cursor={{ y : barPosData.y - 10,height : barPosData.height + 10,stroke: '#fff', fill : '#00659f', strokeWidth: 0,fillOpacity : 0.5}} content={<CustomTooltip title={title} lastItem={lastItem}/>}/>
      <Bar type="monotone" dataKey="value" fill="#00659f" fillOpacity={0.9} onMouseOver={(data) => {
          setBarPosData(data);
        }} />
    </BarChart>
  </div>
  : null
  )
}