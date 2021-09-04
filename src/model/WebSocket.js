import { io } from "socket.io-client";
import {equalIgnoreCase } from "../utils/utils";

class WebSocket {
  constructor(){
    this.socket = io(process.env.REACT_APP_WSS_URL, {
      transports: ['websocket'],
      withCredentials: true
    })
    this.events = [];
    this.socket.on('connect', () => {
      console.log('connect')
      this.events.forEach(event => {
        this.socket.emit(event[0],event[1]);
      })
    })
    this.socket.on('disconnect',event => {
      console.log('web socket disconnect,will reconnect auto')
    })
  }

  subscribe(event = 'get_kline_update',params = {},onMessage){
    this.socket.on('kline_update',data => {
      if (data.time_type === params.time_type && equalIgnoreCase(data.symbol,params.symbol) && onMessage) {
        onMessage(data)
      }
    })
    this.socket.emit(event, params)
    if(this.events.findIndex(item => item[0] === event && item[1].symbol === params.symbol && item[1].time_type === params.time_type) === -1){
      this.events.push([event,params])
    }
  }

  unsubscribe(event,params = {}){
    this.socket.emit(event,params)
  }
}
export default new WebSocket()