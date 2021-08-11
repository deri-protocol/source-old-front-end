import { getPositionInfo } from "../lib/web3js/indexV2"

export default class Position {

  callback = () => {}
   wallet = null;
   spec = null
   isOptions =null;
 
   mockPositionInfo = {
    averageEntryPrice: "",
    liquidationPrice: "",
    margin: "20000",
    marginHeld: "10068.26538",
    marginHeldBySymbol : "293.16152",
    unrealizedPnl: "3.1311",
    volume: "800",
    premiumFundingAccrued:'',
    deltaFundingAccrued:'',
   }

   async load(wallet,spec,callback,isOptions){
     this.isOptions = isOptions
     if(wallet && wallet.isConnected() && wallet.isSupportChain(isOptions) && spec && spec.pool){
      const position = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.symbolId)
      // const fundingFee = await getFun
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
     if(this.interval !== null){
       clearInterval(this.interval);
     }
    this.interval = window.setInterval(() => this.load(wallet,spec,callback,this.isOptions),3000)      
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

   pause(){
    clearInterval(this.interval);
    this.interval = null;
   }

   resume(wallet,spec,callback){
     this.start(wallet,spec,callback || this.callback)
   }

   


 
}