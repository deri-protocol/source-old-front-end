import { makeAutoObservable, observable, action } from "mobx";
import axios from "axios";
import { DeriEnv,deriToNatural } from "../lib/web3js";
import config from '../config.json'

const oracleConfig = config[DeriEnv.get()]['oracle']

const CancelToken = axios.CancelToken;

export default class IndexPrice {
  index = 0.00
  source = CancelToken.source();
  cancel = false

  constructor(){
    makeAutoObservable(this,{
      index : observable,
      start : action,
      loadIndex : action,
      pause : action,
      resume : action
    })
  }

  async loadIndex(symbol) {
    if(symbol){
      const url = oracleConfig[symbol.toUpperCase()]
      const res = await axios.get(url,{ 
        params : {
          symbol : symbol
        },
        cancelToken: this.source.token,
      }
      );
      if(res && res.data && this.cancel === false){
        this.index = deriToNatural(res.data.price).toNumber();
      } 
    }     
  }

  start(symbol){
    if(!this.inteval) {
      this.cancel = false;
      this.source = CancelToken.source();
      this.inteval = setInterval(() => this.loadIndex(symbol),1000)
    }
  }


  pause() {
    this.cancel = true
    this.source.cancel();
    clearInterval(this.inteval)
    this.inteval = null;
  }
}