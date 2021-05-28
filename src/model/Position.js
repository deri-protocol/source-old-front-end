import { getPositionInfo } from "../lib/web3js/indexV2"

export default class Position {

  callback = () => {}
   wallet = null;
   spec = null
 

   async load(wallet,spec,callback){
     if(wallet && wallet.isConnected() && wallet.supportChain && spec && spec.pool){
      const position = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.symbolId)
      if(position){
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
      if(wallet){
        this.wallet= wallet; 
      }
      if(spec){
        this.spec = spec
      }
      if(callback){
        this.callback = callback;
      }
     }
   }

   pause(){
    clearInterval(this.interval);
    this.interval = null;
   }

   resume(wallet,spec,callback){
     this.start(wallet,spec,callback || this.callback)
   }

   


 
}