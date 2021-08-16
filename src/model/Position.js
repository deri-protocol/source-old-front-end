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
    strikePrice:0,
    timePrice:0,
    volatility:0,
    isCall:false,
   }

   async load(wallet,spec,callback,isOptions){
     this.isOptions = isOptions
     if(wallet && wallet.isConnected() && wallet.isSupportChain(isOptions) && spec && spec.pool){
      const position = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.symbolId)
      // const fundingFee = await getFun
      position.unrealizedPnlList = position.unrealizedPnlList.filter(item => (item[1] != '0'))
      if(position){
        if(callback){
          callback(position)
        }
      }
      this.start(wallet,spec,callback)
      return position;
     }
   }

   async loadAll(wallet,spec,callback,isOptions){
    this.isOptions = isOptions
    if(wallet && wallet.isConnected() && wallet.isSupportChain(isOptions) && spec && spec.pool){
      // const positions = await getPositionInfo(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.symbolId)
      const positions = [
        {
          volume:0.11,
          symbolId:0,
          averageEntryPrice:100,
          direction:"LONG",
          balanceContract:100,
          symbol:'BTCUSD-20000-C',
          marginHeld:10,
          unrealizedPnl:0.11,
          fundingFee:0.11,
          premiumFundingAccrued:0.11,
          deltaFundingAccrued:0.11,
          liquidationPrice:2000,
        },
        {
          volume:0.13,
          symbolId:1,
          direction:"LONG",
          symbol:'BTCUSD-30000-C',
          averageEntryPrice:100,
          balanceContract:100,
          marginHeld:10,
          unrealizedPnl:0.11,
          fundingFee:0.11,
          premiumFundingAccrued:0.11,
          deltaFundingAccrued:0.11,
          liquidationPrice:2000,
        },
        {
          volume:0.15,
          symbolId:2,
          direction:"SHORT",
          symbol:'BTCUSD-40000-C',
          averageEntryPrice:100,
          balanceContract:100,
          marginHeld:10,
          unrealizedPnl:0.11,
          fundingFee:0.11,
          premiumFundingAccrued:0.11,
          deltaFundingAccrued:0.11,
          liquidationPrice:2000,
        },
      ]
      if(positions){
        if(callback){
          callback(positions)
        }
      }
      this.startAll(wallet,spec,callback)
      return positions;
     }
   }

   startAll(wallet,spec,callback){
    if(this.interval !== null){
      clearInterval(this.interval);
    }
   this.interval = window.setInterval(() => this.loadAll(wallet,spec,callback,this.isOptions),3000)      
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