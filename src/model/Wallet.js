
import {getUserWalletBalance ,DeriEnv,connectWallet} from "../lib/web3js";
import config from '../config.json'
import { formatBalance } from "../utils/utils";
import { observable, computed, action, makeAutoObservable } from "mobx";

const walletKey = 'mm_wallet_key'
const env = DeriEnv.get();
const {chainInfo} = config[env]


class Wallet {
  
  detail = {}
  
  constructor(){
    makeAutoObservable(this,{
      detail : observable,
      set : action,
      connect : action      
    })
  }

  isConnected = () => !!this.detail.account;

  connect =  async () => {
    const res = await connectWallet();
    return new Promise(async (resolve,reject) => {
      if(res.success){
        const {chainId,account} = res
        const wallet = await this.set(chainId,account);        
        resolve(wallet)
      } else {
        reject(null)
      }
    })
  }

  set = async (chainId,account) => {
    const balance = await getUserWalletBalance(chainId,account)
    const detail = {chainId,account,balance,formatBalance : formatBalance(balance)}
    if(chainInfo[chainId]){
      Object.assign(detail,{...chainInfo[chainId],supported : true})
    }
    this.detail = detail;
    // sessionStorage.setItem(walletKey,JSON.stringify(wallet))
    return detail;
  }

  get = () => {
    return this.detail;
  }

  remove = () => {
    this.detail = null;
    sessionStorage.removeItem(walletKey);
    window.location.reload();
  }
}

export default Wallet;