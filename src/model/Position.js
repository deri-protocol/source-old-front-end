import { getPositionInfo ,bg,getPositionInfos} from "../lib/web3js/indexV2"
import { eqInNumber } from '../utils/utils';

export default class Position {

   callback = () => {}
   callbackALL = ()=>{}
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
      let res  = await getPositionInfos(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.symbolId)
      let positions = [] 
      if(res.length){
        positions = res.map(item=>{
          item.balanceContract = bg(item.margin).plus(item.unrealizedPnl).toString()
          item.direction = (+item.volume) > 0 ? 'LONG' : (!item.volume || eqInNumber(item.volume, 0) || !item.volume ? '--' : 'SHORT')
          return item
        })
      }
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
    if(this.intervalAll !== null){
      clearInterval(this.intervalAll);
    }
   this.intervalAll = window.setInterval(() => this.loadAll(wallet,spec,callback,this.isOptions),3000)      
   if(wallet){
     this.wallet= wallet; 
   }
   if(spec){
     this.spec = spec
   }
   if(callback){
     this.callbackALL = callback;
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