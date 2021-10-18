import React, { useState ,useEffect} from 'react'
import { Area } from '@ant-design/charts';
import dateFormat from 'dateformat'
import axios from 'axios';

export default function AreaChart({url}){
  const [data, setData] = useState([])
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
    }
    setData(data.map(d => ({time : d.timestamp,value : Number(d.value)})))
  }
  useEffect(() => {
    loadData();
  }, [url])

  var config = {
    data: data,
    smooth : true,
    meta : {
      min : 12
    },
    xField: 'time',
    yField: 'value',
    xAxis: { 
      tickInterval : 5,
      label: {
        formatter : (value) => {
          return dateFormat(new Date(value * 1000),'mm-dd')
        }
      },
      tickLine : null,
      line : null
    },
    limitInPlot : true,
    // padding : [10,0,20,10],
    yAxis : {
      position : null,
      grid: {
        line: {
          style: {
            lineWidth: 0,
          }
        }
      }
    },
    label : null,
    tooltip : {
      // follow : false,
      // showCrosshairs : false,
      // showContent : false,
      crosshairs : {
        text : (
          type,
          defaultContent,
          items,
          currentPoint) => {
            console.log(type,defaultContent,items,currentPoint)
        }
      }
    },
    style : {
      background: '#212327',
    },
    areaStyle: {
      fill: 'r(0.5, 0.5, 0.9) 0:#003452 1:#00659f',
      fillOpacity : 0.5,
      opacity : 0.5
    },
    color : '#00659f',
    line : {
      color : '#00659f'
    }
  };
  return <Area {...config} />;
}