/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable camelcase */
import {io} from 'socket.io-client'
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
const socket = io('wss://api.deri.finance', {
  transports: ['websocket'],
  path: '/kline'
})
var bars = []
var param = {}
var ws_first
var ws_onHistoryCallback
var ws_onResetCacheNeededCallback
var ws_to
window.sub_index = 0
var _subs = []
export default {
  history,

  getBars: function (symbolInfo, resolution, from, to, first, onHistoryCallback) {
    let trade = symbolInfo.name
    let ws_time
    ws_first = first
    ws_to = to
    console.log('from, to', from, to)
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
    param = {'symbol': trade, 'time_type': ws_time, 'bars': 1000}

    socket.emit('get_kline', {'symbol': trade, 'time_type': ws_time, 'bars': 1000})
  },
  subscribeBars: function (symbolInfo, resolution, updateCb, uid, resetCache) {
    let trade = symbolInfo.name
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
    param = {'symbol': trade, 'time_type': ws_time, 'bars': 200}
    // socket.emit('get_kline', {'symbol': trade, 'time_type': ws_time, 'bars': 200})
    var newSub = {
      uid,
      resolution,
      symbolInfo,
      lastBar: history[symbolInfo.name].lastBar,
      listener: updateCb
    }
    _subs.push(newSub)
    // resetCache()
  },
  unsubscribeBars: function (uid) {
    var subIndex = _subs.findIndex(e => e.uid === uid)
    if (subIndex === -1) {
    // console.log("No subscription found for ",uid)
      return
    }
    var sub = _subs[subIndex]
    socket.emit('un_get_kline', param)
    window.sub_index -= 1
    //   socket.emit('SubRemove', {subs: [sub.channelString]})
    _subs.splice(subIndex, 1)
  }
}
socket.on('connect', data => {
  console.log('socket,connect')
})
socket.on('kline_update', data => {
  let obj = {}
  let time = data.time
  if (data.time_type === param.time_type && data.symbol === param.symbol) {
    obj.time = time // TradingView requires bar time in ms
    obj.low = Number(data.low)
    obj.high = Number(data.high)
    obj.open = Number(data.open)
    obj.close = Number(data.close)
    obj.volume = Number(data.volume)
    const sub = _subs[_subs.length - 1] || {}
    sub.listener && sub.listener(obj)
    // sub.lastBar = obj
  }
})

socket.on('kline_history', data => {
  console.log('data', data)
  bars = data.map(el => {
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
  if (len) {
    if (ws_to * 1000 > bars[len - 1].time) {
      ws_onHistoryCallback(bars, {noData: false})
    } else {
      ws_onHistoryCallback([], {noData: true})
    }
  } else {
    ws_onHistoryCallback(bars, {noData: true})
  }
})
