import { useState, useEffect} from 'react'

import useClaimInfo from "../../hooks/useClaimInfo";
import useConfig from "../../hooks/useConfig";
import { mintDToken } from "../../lib/web3js/indexV2";
import Button from '../Button/Button';
import { eqInNumber } from '../../utils/utils';

export default function Claim({wallet,miningClaim,tradingClaim,lang}){
	const [btnText, setBtnText] = useState('Collect Wallet')
	const [claimed, setClaimed] = useState(false);
	const [claimInfo,claimInfoInterval] = useClaimInfo(wallet);
	const [remainingTime, setRemainingTime] = useState('')
	const config = useConfig(claimInfo.chainId) 

  //claim deri
	const claim = async () => {
		if(!eqInNumber(wallet.detail.chainId,claimInfo.chainId)) {
			alert(`${lang['your-deri-is-on']} ${ config.text } . ${lang['connect-to']} ${ config.text } ${lang['to-claim']}.`)
			return ;
		}
		if ((+claimInfo.unclaimed) === 0) {
			alert(lang['no-deri-to-claim-yet']);
			return;
		}
		let now = parseInt(Date.now() / 1000) % (3600 * 8);
		if (now < 1800) {
			alert(lang['claiming-DERI-is-disabled-during-first-30-minutes-of-each-epoch']);
			return;
		}
		const res = await mintDToken(wallet.detail.chainId,wallet.detail.account)
		if(res.success){
			clearInterval(claimInfoInterval);
			return true;
		} else {
			alert(lang['claim-failed'])
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
			setBtnText(lang['claim'])
		} else {
			setBtnText(lang['collect-wallet'])
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
				setRemainingTime(`${h} ${lang['h']} ${m} ${lang['m']} ${s} ${lang['s']}`);
			},1000);
		}    

		initButton();		
    return () => {
      interval && clearInterval(interval);
		};
		
  }, [wallet.detail.account]);


  return (
    <div className='claim-box'>
				<div className='odd title'>{miningClaim ?  lang['my-liquidity-providing-harvest-in-current-epoch'] : lang['my-trading-harvest-in-current-epoch']}</div>
				{miningClaim && <div className='odd text'>
						<div className='text-title'>{lang['current-epoch-remaining-time']}</div>
						<div className='text-num'>{ remainingTime }</div>
				</div>}				
				<div className='odd text'>
						{miningClaim && <div className='text-title'>{lang['my-harvest-in-current-epoch-estimated']}</div>}
						{tradingClaim && <div className='text-title'>{lang['my-trading-harvest-in-current-epoch-Est']}</div>}
						<div className='text-num'>{ miningClaim ? claimInfo.harvestDeriLp : claimInfo.harvestDeriTrade} {lang['deri']}</div>
				</div>
				<div className='odd text'>
						<div className='text-title'>{lang['claimed-deri']}</div>
						<div className='text-num'>{claimed ? ((+claimInfo.claimed) + (+claimInfo.unclaimed)).toFixed(2) : claimInfo.claimed }</div>
				</div>
				<div className='odd text'>
						<div className='text-title'></div>
						<div className='text-num'></div>
				</div>
				<div className='odd text'>
						<div className='text-title'>{lang['unclaimed-deri']}</div>
						<div className='text-num'>{ claimed ? 0 : (+claimInfo.unclaimed).toFixed(2) }</div>
				</div>
				{tradingClaim && 
				<div className='odd text'>
						<div className='text-title'></div>
						<div className='text-num'></div>
				</div>}
				<div className='odd claim-network'>
						{miningClaim && <div className='text-title'>{lang['your-deri-is-on']} { config.text } . {lang['connect-to']} { config.text } {lang['to-claim']}.</div>}
				</div>
				<div className='claim-btn'>
					<Button btnText={btnText} click={click} className='claim' lang={lang}/>					
				</div>
      </div>
  ) 
}