import { useState, useEffect} from 'react'

import useClaimInfo from "../../hooks/useClaimInfo";
import useConfig from "../../hooks/useConfig";
import { mintDToken } from "../../lib/web3js/indexV2";
import Button from '../Button/Button';
import { eqInNumber } from '../../utils/utils';

export default function Claim({wallet,miningClaim,tradingClaim}){
	const [btnText, setBtnText] = useState('Collect Wallet')
	const [claimed, setClaimed] = useState(false);
	const [claimInfo,claimInfoInterval] = useClaimInfo(wallet);
	const [remainingTime, setRemainingTime] = useState('')
	const config = useConfig(claimInfo.chainId) 

  //claim deri
	const claim = async () => {
		if(!eqInNumber(wallet.detail.chainId,claimInfo.chainId)) {
			alert(`Your DERI is on ${ config.text } . Connect to ${ config.text } to claim.`)
			return ;
		}
		if (claimInfo.unclaimed === 0) {
			alert('Sorry,no DERI to claim yet');
			return;
		}
		let now = parseInt(Date.now() / 1000) % (3600 * 8);
		if (now < 1800) {
			alert('Claiming DERI is disabled during first 30 minutes of each epoch');
			return;
		}
		const res = await mintDToken(wallet.detail.chainId,wallet.detail.account)
		if(res.success){
			clearInterval(claimInfoInterval);
			return true;
		} else {
			alert('Claim failed')
			return false;
		}
  }

	const click = async () => {
		if(wallet.isConnected()){
			const res = await claim();
			if(res){
				setClaimed(true)
			}
		} 
	}


	
	//初始化按钮文案和事件
	const initButton = () => {
		if(wallet.isConnected()){
			setBtnText('CLAIM')
		} else {
			setBtnText('Collect Wallet')
		}
	}
  
  useEffect(() => {
		let interval = null;
		if(miningClaim){
			//计数器
			interval = window.setInterval(() => {
				let period = 3600 * 8;
				let current = parseInt(Date.now()/1000);
				let epochBegin = parseInt(current / period)*period;
				let dis = (epochBegin + period - current);
				let h = parseInt(dis / 3600);
				let m = parseInt((dis % 3600)/60)
				let s = parseInt(dis % 60) 
				setRemainingTime(`${h} h ${m} m ${s} s`);
			},1000);
		}    

		initButton();		
    return () => {
      interval && clearInterval(interval);
		};
		
  }, [wallet.detail.account]);


  return (
    <div className='claim-box'>
				<div className='odd title'>{miningClaim ?  'My Liquidity-Providing Harvest in Current Epoch' : 'My Trading Harvest in Current Epoch'}</div>
				{miningClaim && <div className='odd text'>
						<div className='text-title'>Current Epoch Remaining Time</div>
						<div className='text-num'>{ remainingTime }</div>
				</div>}				
				<div className='odd text'>
						{miningClaim && <div className='text-title'>My Harvest in Current Epoch (estimated)</div>}
						{tradingClaim && <div className='text-title'> My Trading Harvest in Current Epoch (Est)</div>}
						<div className='text-num'>{ miningClaim ? claimInfo.harvestDeriLp : claimInfo.harvestDeriTrade} DERI</div>
				</div>
				<div className='odd text'>
						<div className='text-title'>Claimed DERI</div>
						<div className='text-num'>{claimed ? ((+claimInfo.claimed) + (+claimInfo.unclaimed)).toFixed(2) : claimInfo.claimed }</div>
				</div>
				<div className='odd text'>
						<div className='text-title'></div>
						<div className='text-num'></div>
				</div>
				<div className='odd text'>
						<div className='text-title'>Unclaimed DERI</div>
						<div className='text-num'>{ claimed ? 0 : (+claimInfo.unclaimed).toFixed(2) }</div>
				</div>
				{tradingClaim && 
				<div className='odd text'>
						<div className='text-title'></div>
						<div className='text-num'></div>
				</div>}
				<div className='odd claim-network'>
						{miningClaim && <div className='text-title'>Your DERI is on { config.text } . Connect to { config.text } to claim.</div>}
				</div>
				<div className='claim-btn'>
					<Button btnText={btnText} click={click} className='claim'/>					
				</div>
      </div>
  ) 
}