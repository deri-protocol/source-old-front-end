/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable camelcase */
import {io} from 'socket.io-client'
import { restoreVersion, restoreChain, getFormatSymbol } from '../../../../../utils/utils'
// function s(){
//   data = [];
// }
// const socket = io('ws://192.168.7.192:5000', {
//   transports: ['websocket'],
//   withCredentials: true
// })
const history = {}
// const socket = io('ws://192.168.7.173:8081', {
//   transports: ['websocket'],
//   path: '/kline'
// })

let onRealtimeCallback = null;

// const socket = io('wss://oracle2.deri.finance', {
const socket = io(process.env.REACT_APP_WSS_URL, {
    transports: ['websocket'],
    withCredentials: true
})

var bars = []
var param = null
var ws_first
var ws_onHistoryCallback
var ws_onResetCacheNeededCallback
var ws_to
window.sub_index = 0
var _subs = []

function getSymbol(symbolInfo){
  return getFormatSymbol(symbolInfo.name)
}
export default {
  history,

  getBars: function (symbolInfo, resolution, from, to, first, onHistoryCallback) {
    let trade = getSymbol(symbolInfo);
    let ws_time
    ws_first = first
    ws_to = to
    // ws_onResetCacheNeededCallback = onResetCacheNeededCallback;
    ws_onHistoryCallback = onHistoryCallback
    switch (true) {
      case resolution == '1':
        ws_time = 'min'
        break
      case resolution == '5' :
        ws_time = '5min'
        break
      case resolution == '15':
        ws_time = '15min'
        break
      case resolution == '30':
        ws_time = '30min'
        break
      case resolution == '60':
        ws_time = 'hour'
        break
      case resolution == '1D':
        ws_time = 'day'
        break
      case resolution == '1W':
        ws_time = 'week'
        break
      default :
        ws_time = 'min'
        break
    }
    socket.emit('un_get_kline',param)
    param = {'symbol': trade, 'time_type': ws_time,from : from, to : to}

    socket.emit('get_kline', param)
  },
  subscribeBars: function (symbolInfo, resolution, updateCb, uid, resetCache) {
    let trade = getSymbol(symbolInfo);
    let ws_time
    switch (true) {
      case resolution == '1':
        ws_time = 'min'
        break
      case resolution == '5' :
        ws_time = '5min'
        break
      case resolution == '15':
        ws_time = '15min'
        break
      case resolution == '30':
        ws_time = '30min'
        break
      case resolution == '60':
        ws_time = 'hour'
        break
      case resolution == '1D':
        ws_time = 'day'
        break
      case resolution == '1W':
        ws_time = 'week'
        break
      default :
        ws_time = 'min'
        break
    }
    param = {'symbol': trade, 'time_type': ws_time,updated : true}
    onRealtimeCallback = updateCb;

    // socket.emit('get_kline_update', param)
    // var newSub = {
    //   uid,
    //   resolution,
    //   symbolInfo,
    //   lastBar: history[symbolInfo.name] && history[symbolInfo.name].lastBar,
    //   listener: updateCb
    // }
    // _subs.push(newSub)
    // resetCache()
  },
  unsubscribeBars: function (uid) {
    // var subIndex = _subs.findIndex(e => e.uid === uid)  
    // if (subIndex === -1) {
    // console.log("No subscription found for ",uid)
    //   return
    // }
    // var sub = _subs[subIndex]
    // socket.emit('un_get_kline', param)
    // window.sub_index -= 1
    //   socket.emit('SubRemove', {subs: [sub.channelString]})
    // _subs.splice(subIndex, 1)
  }
}
socket.on('connect', data => {
  //代表断开重连
  if(param && param.updated){
    socket.emit('get_kline_update', param)
  }
  console.log('socket,connect')
})
socket.on('kline_update', data => {
  let obj = {}
  let time = data.time
  if (data.time_type === param.time_type && data.symbol.toUpperCase() === param.symbol.toUpperCase()) {
    obj.time = time // TradingView requires bar time in ms
    obj.low = Number(data.low)
    obj.high = Number(data.high)
    obj.open = Number(data.open)
    obj.close = Number(data.close)
    obj.volume = Number(data.volume)
    // const sub = _subs[_subs.length - 1] || {}
    onRealtimeCallback && onRealtimeCallback(obj)
    // sub.lastBar = obj
  }
})

socket.on('kline_history', data => {
  let current = param.symbol;
  bars = data.map(el => {
    current = el.symbol;
    return {
      time: el.time, // TradingView requires bar time in ms
      low: Number(el.low),
      high: Number(el.high),
      open: Number(el.open),
      close: Number(el.close),
      volume: Number(el.volume)
    }
  })
  // bars = bars.reverse()
  if (ws_first) {
    var lastBar = bars[bars.length - 1]
    history[param.symbol] = {
      lastBar
    }
  }
  const len = bars.length
  if(param.symbol.toUpperCase() === current.toUpperCase()){
    const options = {noData : bars.length > 0 ? false : true}
    ws_onHistoryCallback(bars,options)
    // if (len) {
    //   if (ws_to * 1000 > bars[len - 1].time) {
    //     ws_onHistoryCallback(bars, {noData: false})
    //   } else {
    //     ws_onHistoryCallback([], {noData: true})
    //   }
    // } else {
    //   ws_onHistoryCallback(bars, {noData: true})
    // }
  }
})
