import { makeAutoObservable, observable, action} from "mobx";
import WebSocket from "socket.io-client";

export default class Oracle {
  symbol = 'BTCUSD'
  index = 0.00
  kData = []
  ws = null
  paused = false;

  constructor(){
    makeAutoObservable(this,{
      index : observable,
      kData : observable,
      setIndex : action,
    })
  }

  initWebSocket(){
    if(this.ws === null) {
      this.ws = new WebSocket('wss://api.deri.finance', {
        transports: ['websocket'],
        path: '/kline'
      })
      this.ws.on('connect',() => console.log('ws is already connected'));
      this.ws.on('kline_update',data => {
        const obj = {}
        let time = data.time
        if (data.symbol === this.symbol) {
          obj.time = time 
          obj.low = Number(data.low)
          obj.high = Number(data.high)
          obj.open = Number(data.open)
          obj.close = Number(data.close)
          obj.volume = Number(data.volume)
          this.setIndex(obj.close)
        }
      })
  
    }    
  }

  loadIndex(symbol){
    this.resume();
    this.setSymbol(symbol)
    this.ws.emit('get_kline', {'symbol': symbol, 'time_type': 'min', 'bars': 10})
  }

  start(symbol){
    this.initWebSocket();
    this.loadIndex(symbol);
  }

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

  setPause(paused){
    this.paused = paused
  }


}