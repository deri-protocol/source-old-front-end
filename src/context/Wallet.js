
import { getUserWalletBalence as getUserWalletBalance ,DeriEnv,connectWallet} from "../lib/web3js";
import config from '../config.json'
import { formatBalance } from "../utils/utils";

const walletKey = 'mm_wallet_key'
const env = DeriEnv.get();
const chainConfig = config[env]

class Wallet {

  constructor(){
    this.wallet = JSON.parse(sessionStorage.getItem(walletKey));
  }

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
    const wallet = {chainId,account,balance,formatBalance : formatBalance(balance)}
    if(chainConfig[chainId]){
      const {symbol} = chainConfig[chainId]
      Object.assign(wallet,{symbol})
    }
    this.wallet = wallet;
    sessionStorage.setItem(walletKey,JSON.stringify(wallet))
    return wallet;
  }

  get = () => {
    return this.wallet;
  }
}

export default Wallet;