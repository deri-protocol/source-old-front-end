import { useState,useEffect } from 'react'
import { getContractAddressConfig } from '../lib/web3js';
import {DeriEnv} from '../lib/web3js/index'

export default function useDeriConfig(wallet){
  const [deriConfig, setDeriConfig]= useState([]);

  const loadConfig = async (wallet) => {
    const configs = await getContractAddressConfig(DeriEnv.get())
    if(wallet.account){
      const filtered = configs.filter(config => (+config.chainId) === (+wallet.chainId))
      setDeriConfig(filtered);
    } else {
      setDeriConfig(configs)
    }
  }

  useEffect(() => {
    loadConfig(wallet);
    return () => {}
  }, [wallet.account]);

  return deriConfig;
}