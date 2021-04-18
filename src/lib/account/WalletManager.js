import { getUserWalletBalence as getUserWalletBalance ,DeriEnv} from "../web3js";
import config from '../../config.json'
import { formatBalance } from "../../utils/utils";

const walletKey = 'mm_wallet_key'
const env = DeriEnv.get();
const cc = config[env]

class WalletManager {

  //是否已连接
  isConnected = () => window.ethereum.isConnected();

  //设置钱包
  setWallet = async (chianId,address) => {
    if(cc[chianId]){
      const balance = await getUserWalletBalance(chianId,address)
      const symbol = cc[chianId].symbol
      const wallet = {
        chianId,
        address,
        balance : formatBalance(balance),
        symbol
      }
      sessionStorage.setItem(walletKey,wallet)
      return wallet;
    }
    return null;
  }

  getWallet = () => sessionStorage.getItem(walletKey);

  removeWallet = () =>sessionStorage.removeItem(walletKey)

}

export default new WalletManager();