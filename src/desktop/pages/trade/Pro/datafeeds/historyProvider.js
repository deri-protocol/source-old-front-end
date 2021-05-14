/* eslint-disable no-case-declarations */
import axios from 'axios'
import {DeriEnv} from "../../../../../lib/web3js/indexV2";

const history = {}

// eslint-disable-next-line import/no-anonymous-default-export
export default {  
  history,
  getBars: function (symbolInfo, resolution, _from, to, first) {
    const trade =  symbolInfo.name;
    let url;
    if(DeriEnv.get()=='prod'){
      if(trade =='COIN'){
        url = 'https://oracle3.deri.finance/pricekline/'
      }else{
        url = 'https://oracle.deri.finance/pricekline/'
      }
      
    }else{
      url ="https://oracle2.deri.finance/pricekline/"
    }
    const params = {
      symbol: trade,
      bars: 200,
    }
    switch(true) {
      case resolution.indexOf('D') > 0 :
        const d = resolution.substr(0, 1);
        params.period = d*24*60*60
      break;
      case resolution.indexOf('W') > 0 :
        const w = resolution.substr(0, 1);
        params.period = w*24*60*60*7
      break;
      case resolution.indexOf('M') > 0:
        const m = resolution.substr(0, 1);
        params.period = m*24*60*60*30
      break;
      default :
        params.period = resolution*60 
      break;
    }
    
    return axios.get(url, {
        params: {
            ...params
        }
    }).then(res => {
        if (res.data.data.length) {
          // res.data.shift()
          // console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
          var bars = res.data.data.map(el => {
            let time = String(el.ts).length < 13 ? el.ts * 1000 : el.ts
            // if (resolution.indexOf('D') > 0) {
            //   time = time + 8*60*60*1000
            // }
            // if (resolution.indexOf('W') > 0) {
            //   time = time + 32*60*60*1000
            // }
            return {
              time, //TradingView requires bar time in ms
              low: Number(el.l),
              high: Number(el.h),
              open: Number(el.o),
              close: Number(el.c),
              volume: Number(el.v)
            }
          })
          if (first) {
            var lastBar = bars[bars.length - 1]
            history[symbolInfo.name] = {
              lastBar
            }
          }
          return bars
        } else {
          return []
        }
      })
  }
}