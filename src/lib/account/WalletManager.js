import { getUserWalletBalance ,DeriEnv} from "../web3js";
import config from '../../config.json'
import { formatBalance } from "../../utils/utils";

const walletKey = 'mm_wallet_key'
const env = DeriEnv.get();
const {chainInfo} = config[env]

class WalletManager {

  //是否已连接
  isConnected = () => window.ethereum.isConnected();

  //设置钱包
  setWallet = async (chianId,account) => {
    if(chainInfo[chianId]){
      const balance = await getUserWalletBalance(chianId,account)
      const symbol = chainInfo[chianId].symbol
      const wallet = {
        chianId,
        account,
        balance : formatBalance(balance),
        symbol
      }
      sessionStorage.setItem(walletKey,JSON.stringify(wallet))
      return wallet;
    }
    return null;
  }

  getWallet = () => sessionStorage.getItem(walletKey) ? JSON.parse(sessionStorage.getItem(walletKey)) : undefined;

  removeWallet = () =>sessionStorage.removeItem(walletKey)

}

export default new WalletManager();