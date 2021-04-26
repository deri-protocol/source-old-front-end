import { useState, useEffect } from 'react'
import { getSpecification } from "../lib/web3js";

export default function useSpecification({wallet,address}){
  const [spec, setSpec] = useState({});

  const getSpec = async () => {
    if(wallet && wallet.account && address){
      const spec =  await getSpecification(wallet.chainId,address,wallet.account);
      setSpec(spec);
    }
  }

  useEffect(() => {
    getSpec();
    return () => {
      
    }
  }, []);

  return spec;
}