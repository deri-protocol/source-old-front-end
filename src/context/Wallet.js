
import {getUserWalletBalance ,DeriEnv,connectWallet} from "../lib/web3js";
import config from '../config.json'
import { formatBalance } from "../utils/utils";

const walletKey = 'mm_wallet_key'
const env = DeriEnv.get();
const chainConfig = config[env]

class Wallet {

  constructor(){
    this.wallet = JSON.parse(sessionStorage.getItem(walletKey));
  }

  isConnected = () => window.ethereum.isConnected();


  connect =  async () => {
    const res = await connectWallet(null,account => {
      //如果还有账号，切换这个这个账号，否则清除sessionStorage
      if(account) {
        //@todo
      } else {
        this.remove();
      }
    });
    return new Promise(async (resolve,reject) => {
      if(res.success){
        const {chainId,account} = res
        const wallet = await this.set(chainId,account);
        //add disconnect event
        window.ethereum.on('disconnect',this.remove)
        resolve(wallet)
      } else {
        reject(null)
      }
    })
  }

  set = async (chainId,account) => {
    const balance = await getUserWalletBalance(chainId,account)
    const wallet = {chainId,account,balance,formatBalance : formatBalance(balance)}
    if(chainConfig[chainId]){
      Object.assign(wallet,{...chainConfig[chainId],supported : true})
    }
    this.wallet = wallet;
    sessionStorage.setItem(walletKey,JSON.stringify(wallet))
    return wallet;
  }

  get = () => {
    return this.wallet;
  }

  remove = () => {
    this.wallet = null;
    sessionStorage.removeItem(walletKey);
    window.location.reload();
  }

  
}

export default Wallet;