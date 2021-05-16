import { makeAutoObservable, observable, action } from "mobx"
import { getPositionInfo } from "../lib/web3js/indexV2"

export default class Position {
   // contract info
   info = {}
 
   constructor(){
     makeAutoObservable(this,{
        info : observable,
        setInfo : action,
       }
     )
   }

   async load(wallet,spec){
    const position = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account)
    if(position){
      this.setInfo(position);
    }
    return position;
   }

   start(wallet,spec){
     if(!this.interval){
      this.interval = window.setInterval(() => this.load(wallet,spec),3000)
     }
   }

   pause(){
    clearInterval(this.interval);
    this.interval = null;
   }

   resume(){
     
   }

   setInfo(info){
     this.info = info;
   }


 
}