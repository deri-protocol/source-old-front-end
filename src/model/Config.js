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

  async load(version){
    const configs = await getContractAddressConfig(DeriEnv.get(),version)
    this.setAll(configs)
    return configs;
  }

  setAll(all){
    this.all = all;
  }
  
}