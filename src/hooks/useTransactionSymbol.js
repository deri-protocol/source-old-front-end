import { useState,useEffect } from 'react'
import { getContractAddressConfig } from '../lib/web3js';
import {DeriEnv} from '../lib/web3js/index'

export default function useTransactionSymbol(wallet){
  const [transactionSymbols, setTransactionSymbols]= useState([]);

  const loadContractConfig = async () => {
    const contractConfigs = await getContractAddressConfig(DeriEnv.get())
    const filtered = contractConfigs.filter(config => config.chainId == wallet.chainId)
    setTransactionSymbols(filtered);
  }

  useEffect(() => {
    wallet && wallet.account && loadContractConfig();
    return () => {

    }
  }, [wallet]);

  return transactionSymbols;
}