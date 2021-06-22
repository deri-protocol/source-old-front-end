
import {getUserWalletBalance ,DeriEnv,connectWallet, isUnlocked, unlock } from "../lib/web3js/indexV2";
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

  supportWeb3 = () => !!window.ethereum

  isConnected = () => !!this.detail.account;


  async isApproved(pool,bTokenId){
    if(this.detail.chainId && this.supportChain){
      const isApproved = await isUnlocked(this.detail.chainId,pool,this.detail.account,bTokenId).catch(e => console.error('load approve error'))
      this.detail.isApproved = isApproved;
      this.setDetail(this.detail)
      return isApproved;
    }
  }

  approve = async (pool,bTokenId) => {
    if(this.detail.chainId){
      const approved = await unlock(this.detail.chainId,pool,this.detail.account,bTokenId);
      return approved
    }
  }

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
    return this.detail.supportV2
  }

  get supportChain(){
    return this.detail.supported
  }


}

export default Wallet;