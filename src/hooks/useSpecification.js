import { useState, useEffect } from 'react'
import { getSpecification } from "../lib/web3js/indexV2";

export default function useSpecification({wallet,address}){
  const [spec, setSpec] = useState({});

  const loadSpec = async () => {
    if(wallet.isConnected() && address){
      const spec =  await getSpecification(wallet.detail.chainId,address,wallet.detail.account);
      setSpec(spec);
    }
  }

  useEffect(() => {
    loadSpec();
    return () => {      
    }
  }, wallet.detail.account,address);

  return spec;
}