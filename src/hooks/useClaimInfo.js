import { useState, useEffect } from 'react'
import { getUserInfoAll ,deriToNatural} from '../lib/web3js';


export default function useClaimInfo(wallet = {}){
  const [claimInfo, setClaimInfo] = useState({});
  let interval = null;

  const loadClaimInfo =  async () => {
    if(wallet && wallet.account){
      const claimInfo  = await getUserInfoAll(wallet.account);
      const claimed = deriToNatural(claimInfo.total).toFixed(2);
      const unclaimed = claimInfo.valid ? (+claimInfo.amount).toFixed(2) : 0;
      const harvestDeriLp = (+claimInfo.lp).toFixed(2);
      const harvestDeriTrade = (+claimInfo.trade).toFixed(2);
      setClaimInfo({claimed,unclaimed,harvestDeriLp,harvestDeriTrade})
    }
  }

  useEffect(() => {
    interval = window.setInterval(loadClaimInfo,1000 * 60 *3);
    if(wallet.account) {
      loadClaimInfo();
    }
    return () => clearInterval(interval);
  }, [])
  return [claimInfo,interval];
}