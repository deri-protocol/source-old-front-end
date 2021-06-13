import { makeObservable, observable, action } from "mobx";
import { getContractAddressConfig, DeriEnv } from "../lib/web3js/indexV2";

export default class Config {
  all = []

  constructor(){
    makeObservable(this,{
      all : observable,
      setAll : action
    })
  }

  load(version){
    const current = version && version.current;
    let configs = getContractAddressConfig(DeriEnv.get(),current)
    if(version){
      configs = configs.filter(c => c.version === version.current)
      //v2 不需要展示base token,需要合并相同的base token
      if(version.isV2){
        configs = configs.reduce((total,cur) => {
          const pos = total.findIndex(c => c.symbol === cur.symbol);
          const poolPos = total.findIndex(c => c.pool === cur.pool)
          if(pos === -1 || poolPos === -1){
            total.push(cur)
          }
          return total;
        },[])
      }
    }
    this.setAll(configs)
    return this.all;
  }

  setAll(all){
    this.all = all;
  }
  
}