import React, { useState ,useEffect} from 'react'
import { Area } from '@ant-design/charts';
import dateFormat from 'dateformat'
import axios from 'axios';

// class AreaChart extends React.PureComponent {
//   state = {data : []}

//   loadData = async () => {
//     const url = `${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity_history`
//     const res = await axios.get(url)
//     let data = []
//     if(res.status === 200 && Array.isArray(res.data.data)){
//       data = res.data.data.sort((item1,item2) => {
//         if(item1.timestamp > item2.timestamp) {
//           return 1
//         } else if(item1.timestamp < item2.timestamp){
//           return -1
//         } else {
//           return 0
//         }
//       })
//       // this.state = 
//       this.setState({data : data.map(d => ({time : d.timestamp,value : Number(d.value)}))})
//     }
//   }

//   componentDidMount() {
//     this.loadData();    
//   }
  
//   render(){
//     const config = {
//       data: this.state.data,
//       smooth : true,
//       autoFit : false,
//       height : 250,
//       xField: 'time',
//       yField: 'value',
//       xAxis: { 
//         tickInterval : 5,
//         label: {
//           formatter : (value) => {
//             return dateFormat(new Date(value * 1000),'mm-dd')
//           }
//         },
//         tickLine : null,
//         line : null
//       },
//       yAxis : {
//         tickLine :null,
//         grid: {
//           line: {
//             style: {
//               lineWidth: 0,
//             }
//           }
//         },
//         label : null
//       },
//       label : null,
//       tooltip : {
//         position : 'top',
//         showTitle : false,
//         // follow : false,
//         showCrosshairs : true,
//         // showContent : false,
//         crosshairs : {
//           line : null,
//           text : (type,defaultContent,items,currentPoint) => {
//               // console.log(type,defaultContent,items,currentPoint)
//               // this.props.callback && this.props.callback(items[0].data)
//           }
//         }
//       },
//       style : {
//         background: '#212327',
//       },
//       areaStyle: {
//         fill: 'r(0.5, 0.5, 0.9) 0:#003452 1:#00659f',
//         fillOpacity : 0.5,
//         opacity : 0.5
//       },
//       color : '#00659f',
//       line : {
//         color : '#00659f'
//       }
//     };
//     return <Area {...config} />
//   }
// }

function AreaChart({url,callback}){
  const [data, setData] = useState([])
  const loadData = async () => {
    const url = `${process.env.REACT_APP_INFO_HTTP_URL}/get_liquidity_history`
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
    autoFit : false,
    height : 250,
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
    yAxis : {
      tickLine :null,
      grid: {
        line: {
          style: {
            lineWidth: 0,
          }
        }
      },
      label : null
    },
    label : null,
    tooltip : {
      position : 'top',
      // showTitle : false,
      follow : false,
      // showCrosshairs : true,
      // showContent : false,
      crosshairs : {
        line : null,
        
        // text : (type,defaultContent,items,currentPoint) => {
        //     // console.log(type,defaultContent,items,currentPoint)
        //     // callback && callback(items[0].data)
        // }
      },
      containerTpl : 'customize-tooltip',
      domStyles : {

      },
      customContent: (title, data) => {
        return `<div style={{background:'#000000'}}>${title}</div>`;
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
  return <div>
      <div className='customize-tooltip'></div>   
      <Area {...config} />
    </div>
}
export default AreaChart