// api/stream.js
import historyProvider from './historyProvider.js.js'
// we use Socket.io client to connect to cryptocompare's socket.io stream
var socket_url = 'wss://xtsocket.xt.pub/websocket'
var socket = new WebSocket(socket_url);

// keep track of subscriptions
var _subs = []

export default {
 subscribeBars: function(symbolInfo, resolution, updateCb, uid, resetCache) {
   
    console.log('subscribebars')
    let now = Date.now()
    let market = 'btc_usdt';
    let since = now;
    let interval = '1min'
    let unp = {"channel":"ex_chart_update","market":market,"since":since,"interval":interval,"event":"addChannel"}
    unp = JSON.stringify(unp)
    socket.send(unp)
  
    var newSub = {
        uid,
        resolution,
        symbolInfo,
        lastBar: historyProvider.history[symbolInfo.name].lastBar,
        listener: updateCb,
    }
    console.log(newSub)
    _subs.push(newSub)
 },
 unsubscribeBars: function(uid) {
  var subIndex = _subs.findIndex(e => e.uid === uid)
  if (subIndex === -1) {
   //console.log("No subscription found for ",uid)
   return
  }
  var sub = _subs[subIndex]
  socket.emit('SubRemove', {subs: [sub.channelString]})
  _subs.splice(subIndex, 1)
 }
}
socket.onopen = function(event){
    
}
socket.onmessage = function(event){
    let data = JSON.parse(event.data)
    if(!data.hasOwnProperty('data')){
        return;
    }
    if(!data.data.hasOwnProperty('records')){
        return;
    }
    if(!data.data.records.length){
        return;
    }
    let obj = {};
    obj.time=data.data.records[0][0] *1000 //TradingView requires bar time in ms
    obj.low=data.data.records[0][3]
    obj.high= data.data.records[0][2]
    obj.open= data.data.records[0][1]
    obj.close=data.data.records[0][4]
    obj.volume= data.data.records[0][5]
    console.log(obj)
    const sub = _subs[_subs.length-1]
    sub.listener(obj)
    sub.lastBar = obj

}

