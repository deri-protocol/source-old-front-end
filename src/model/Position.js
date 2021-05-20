import { makeAutoObservable, observable, action } from "mobx"
import { getPositionInfo } from "../lib/web3js/indexV2"

export default class Position {
   // contract info
   info = {}

   callback = () => {}
   wallet = null;
   spec = null
 
   constructor(){
     makeAutoObservable(this,{
        info : observable,
        setInfo : action,
       }
     )
   }

   async load(wallet,spec,callback){
     if(spec && spec.pool){
      const position = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account)
      if(position){
        this.setInfo(position);
        if(callback){
          callback(position)
        }
      }
      this.start(wallet,spec,callback)
      return position;
     }
   }

   start(wallet,spec,callback){
     if(!this.interval){
      this.interval = window.setInterval(() => this.load(wallet,spec,callback),3000)
      this.wallet = wallet;
      this.spec = spec;
      this.callback = callback;
     }
   }

   pause(){
    clearInterval(this.interval);
    this.interval = null;
   }

   resume(){
     this.start(this.wallet,this.spec,this.callback)
   }

   setInfo(info){
     this.info = info;
   }


 
}