import { getTradeHistory } from "../lib/web3js/indexV2";


export default class History {

   async load(wallet,config){
    const all = await getTradeHistory(wallet.detail.chainId,config.pool,wallet.detail.account);    
    return all;
   }
}