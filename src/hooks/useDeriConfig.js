import { useState,useEffect } from 'react'
import { getContractAddressConfig } from '../lib/web3js';
import {DeriEnv} from '../lib/web3js/index'
import { eqInNumber } from '../utils/utils';

export default function useDeriConfig(wallet){
  const [deriConfig, setDeriConfig]= useState([]);

  const loadConfig = async (wallet) => {
    const configs = await getContractAddressConfig(DeriEnv.get())
    if(wallet.detail.account){
      const filtered = configs.filter(config => eqInNumber(config.chainId,wallet.detail.chainId))
      setDeriConfig(filtered);
    } else {
      setDeriConfig(configs)
    }
  }

  useEffect(() => {
    loadConfig(wallet);
    return () => {}
  }, [wallet.detail.account]);

  return deriConfig;
}