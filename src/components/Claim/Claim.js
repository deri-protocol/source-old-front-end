import { useState, useEffect,useContext } from 'react'

import useClaimInfo from "../../hooks/useClaimInfo";
import useConfig from "../../hooks/useConfig";
import { mintDToken ,connectWallet } from "../../lib/web3js";
import { WalletContext } from '../../context/WalletContext';

export default function Claim({wallet = {}}){
	const [btnText, setBtnText] = useState('Collect Wallet')
	const [claimInfo,claimInfoInterval] = useClaimInfo(wallet);
	const [remainingTime, setRemainingTime] = useState('')
	const config = useConfig(wallet.chainId) || {}
	const {walletContext} =  useContext(WalletContext)

  //claim deri
	const claim = async () => {
		if (claimInfo.unclaimed == 0) {
			alert('Sorry,no DERI to claim yet');
			return;
		}
		let now = parseInt(Date.now() / 1000) % (3600 * 8);
		if (now < 1800) {
			alert('Claiming DERI is disabled during first 30 minutes of each epoch');
			return;
		}
		const res = await mintDToken(wallet.chainId,wallet.account)
		if(res.success){
      clearInterval(claimInfoInterval);
		} else {
			alert('Claim failed')
		}
  }

	const cw = async () => {
		walletContext.connect();
	}

  //
	const click = async () => {
		if(wallet && wallet.account){
			claim();
		} else {
			cw();
		}
	}


	
	//初始化按钮文案和事件
	const initButton = () => {
		if(wallet && wallet.account){
			setBtnText('CLAIM')
		} else {
			setBtnText('Collect Wallet')
		}
	}
  
  useEffect(() => {
    //计数器
    const interval = window.setInterval(() => {
      let period = 3600 * 8;
      let current = parseInt(Date.now()/1000);
      let epochBegin = parseInt(current / period)*period;
      let dis = (epochBegin + period - current);
      let h = parseInt(dis / 3600);
      let m = parseInt((dis % 3600)/60)
      let s = parseInt(dis % 60) 
      setRemainingTime(`${h} h ${m} m ${s} s`);
		},1000);

		initButton();		
    return () => {
      clearInterval(interval);
		};
		
  }, []);


  return (
    <div className='claim-box'>
				<div className='odd title'>My Liquidity-Providing Harvest in Current Epoch</div>
				<div className='odd text'>
						<div className='text-title'>Current Epoch Remaining Time</div>
						<div className='text-num'>{ remainingTime }</div>
				</div>
				<div className='odd text'>
						<div className='text-title'>My Harvest in Current Epoch (estimated)</div>
						<div className='text-num'>{ claimInfo.harvestDeriLp } DERI</div>
				</div>
				<div className='odd text'>
						<div className='text-title'>Claimed DERI</div>
						<div className='text-num'>{ claimInfo.claimed }</div>
				</div>
				<div className='odd text'>
						<div className='text-title'></div>
						<div className='text-num'></div>
				</div>
				<div className='odd text'>
						<div className='text-title'>Unclaimed DERI</div>
						<div className='text-num'>{ claimInfo.unclaimed }</div>
				</div>
				<div className='odd claim-network'>
						<div className='text-title'>Your DERI is on { config.text } . Connect to { config.text } to claim.</div>
				</div>
				<div className='claim-btn'>
					<button className='claim' onClick={click}
						id='claimmyderi'>
						<span
							className='spinner spinner-border spinner-border-sm'
							role='status'
							aria-hidden='true'
							style={{display: 'none'}}></span>
								{btnText}
						</button>
				</div>
      </div>
  ) 
}