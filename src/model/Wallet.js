
import {getUserWalletBalance ,DeriEnv,connectWallet} from "../lib/web3js/indexV2";
import config from '../config.json'
import { formatBalance, eqInNumber } from "../utils/utils";
import { observable, computed, action, makeAutoObservable } from "mobx";


class Wallet {
  
  detail = {}
  
  constructor(){
    makeAutoObservable(this,{
      detail : observable,
      setDetail : action,
      supportV2 : computed,
      supportChain : computed   
    })
  }

  isConnected = () => !!this.detail.account;

  connect =  async () => {
    const res = await connectWallet();
    return new Promise(async (resolve,reject) => {
      if(res.success){
        const {chainId,account} = res
        const wallet = await this.loadWalletBalance(chainId,account);        
        resolve(wallet)
      } else {
        reject(null)
      }
    })
  }

  loadWalletBalance = async (chainId,account) => {
    const balance = await getUserWalletBalance(chainId,account)
    const detail = {chainId,account,balance,formatBalance : formatBalance(balance)}
    const env = DeriEnv.get();
    const {chainInfo} = config[env]
    
    if(chainInfo[chainId]){
      Object.assign(detail,{...chainInfo[chainId],supported : true})
    }
    this.setDetail(detail)
    return detail;
  }

  get = () => {
    return this.detail;
  }

  setDetail(detail){
    this.detail = detail;
  }

  get supportV2() {
    return eqInNumber(this.detail.chainId,56) || eqInNumber(this.detail.chainId,97)
  }

  get supportChain(){
    return this.detail.supported
  }

}

export default Wallet;