import config from '../config.json'
import {DeriEnv} from '../lib/web3js/index'
export default function useConfig(chainId){
  return config[DeriEnv.get()][chainId];
}