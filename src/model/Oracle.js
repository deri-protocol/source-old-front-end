import { makeAutoObservable, observable, action} from "mobx";
import WebSocket from "socket.io-client";

class Oracle {
  symbol = 'BTCUSD'
  timeType = 'min'
  index = 0.00
  kData = []
  ws = null
  paused = false;
  listeners = {}
  already = false

  constructor(){
    makeAutoObservable(this,{
      index : observable,
      kData : observable,
      setIndex : action,
    })
    this.initWebSocket()
  }


  initWebSocket(){
    if(this.ws === null) {
      this.ws = new WebSocket(process.env.REACT_APP_WSS_URL, {        
        transports: ['websocket'],
        withCredentials: true
      })
      this.ws.on('connect',() => {
        if(this.already){
          this.ws.emit('get_kline_update', {'symbol': this.symbol, 'time_type': this.timeType})
          console.log('ws is reconnected already')
        }
        console.log('ws is already connected');
      });
    }    
  }


  load(symbol,timeType = 'min'){
    // symbol = symbol+'_V2'
    this.ws.on('kline_update',data => {
      const obj = {}
      let time = data.time
      if (data.symbol.toUpperCase() === this.symbol.toUpperCase()) {
        obj.time = time 
        obj.low = Number(data.low)
        obj.high = Number(data.high)
        obj.open = Number(data.open)
        obj.close = Number(data.close)
        obj.volume = Number(data.volume)
        obj.time_type = data.time_type
        obj.symbol = data.symbol
        if(!this.paused) {
          this.setIndex(obj.close)
          for(const key of Object.keys(this.listeners)){
            if(typeof this.listeners[key] === 'function'){
              this.listeners[key](obj)
            }
          }
        }
      }
    })
    if(symbol !== this.symbol){
      this.unsubscribeBars(this.symbol);
    }
    this.setSymbol(symbol)
    this.setTimeType(timeType);
    this.ws.emit('get_kline_update', {'symbol': this.symbol, 'time_type': this.timeType})
    this.already = true
  }

  addListener(id,listener){
    if(!this.listeners[id]) {
      this.listeners[id] = listener
    }    
  }



  unsubscribeBars(symbol){
    this.ws.emit('un_get_kline_update', {
      symbol : symbol, 'time_type' : 'min'
    })
  }


  //暂不用
  loadHistory(symbol,timeType,callback){
    this.ws.on('kline_history', data => {
      const history = data.map(el => {
        return {
          time: el.time,
          low: Number(el.low),
          high: Number(el.high),
          open: Number(el.open),
          close: Number(el.close),
          volume: Number(el.volume)
        }
      })
      if(callback){
        console.log('history ->',history[history.length-1].time)
        callback(history)
      }
    })
    this.ws.emit('get_kline', {'symbol': symbol, 'time_type': timeType, 'bars': 1000})
    // this.emit(symbol);
  }

  // start(symbol){
  //   this.initWebSocket();
  //   this.loadIndex(symbol);
  //   this.ws.on('kline_update',data => {
  //     const obj = {}
  //     let time = data.time
  //     if (data.symbol === this.symbol) {
  //       obj.time = time 
  //       obj.low = Number(data.low)
  //       obj.high = Number(data.high)
  //       obj.open = Number(data.open)
  //       obj.close = Number(data.close)
  //       obj.volume = Number(data.volume)
  //       this.setIndex(obj.close)
  //     }
  //   })
  // }

  resume(){
    this.setPause(false)
  }

  pause(){
    this.setPause(true)
  }

  setIndex(index){
    if(!this.paused) {
      this.index = index;
    }
  }

  setSymbol(symbol){
    this.symbol = symbol
  }

  setTimeType(timeType){
    this.timeType = timeType;
  }
  setPause(paused){
    this.paused = paused
  }
}

export default Oracle