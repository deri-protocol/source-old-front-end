/* eslint-disable no-case-declarations */
import Oracle from '../../../../../model/Oracle';

const history = {}
let ws_time = null
const oracle = new Oracle();
// eslint-disable-next-line import/no-anonymous-default-export
export default {  
  history,
  getBars: function (symbolInfo, resolution, from, to, first,onHistoryCallback) {
    const symbol = symbolInfo.name
    switch (true) {
      case resolution === '1':
        ws_time = 'min'
        break
      case resolution === '5' :
        ws_time = '5min'
        break
      case resolution === '15':
        ws_time = '15min'
        break
      case resolution === '30':
        ws_time = '30min'
        break
      case resolution === '60':
        ws_time = 'hour'
        break
      case resolution === '1D':
        ws_time = 'day'
        break
      case resolution === '1W':
        ws_time = 'week'
        break
      default :
        ws_time = 'min'
        break
    }
    oracle.loadHistory(symbol,ws_time,data => {
      if (first) {
        var lastBar = data[data.length - 1]
        history[symbol] = {
          lastBar
        }
      }
      const len = data.length
      if (len) {
        if (to * 1000 > data[len - 1].time) {
          onHistoryCallback(data, {noData: false})
        } else {
          onHistoryCallback([], {noData: true})
        }
      } else {
        onHistoryCallback(data, {noData: true})
      }
    })
  },

  subscribeBars: function (symbolInfo, resolution, updateCb, uid, resetCache) {  
    // console.log(symbolInfo.name) 
    // oracle.addListener('kline',data => {
    //   if (data.time_type === ws_time && data.symbol === symbolInfo.name) {
    //     // updateCb(data)        
    //   }
    // }) 
    // oracle.load(symbolInfo.name,ws_time);
  },
  unsubscribeBars: function (uid) {
    oracle.unsubscribeBars(uid)
  }

}