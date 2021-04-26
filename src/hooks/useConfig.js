import config from '../config.json'
import {DeriEnv} from '../lib/web3js/index'
export default function useConfig(chainId,type = 'chainInfo'){
  return config[DeriEnv.get()][type][chainId];
}