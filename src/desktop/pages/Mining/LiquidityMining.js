import React,{useState,useEffect} from 'react';
import {
				getUserInfoAll,
				deriToNatural,
				getLiquidityInfo,
				getPoolInfoApy,
				isUnlocked,
				unlock
			} from '../../../lib/web3js/index'

export default function LiquidityMining({chainId,baseToken,address}){
	const [countDownText, setCountDownText] = useState('')
	const [userInfo,setUserInfo] = useState({})
	const [liquidity,setLiquidity] = useState({})
	const [isApproved,setIsApproved] = useState(false)

  const count = () => {
		let period = 3600 * 8;
		let current = parseInt(Date.now()/1000);
		let epochBegin = parseInt(current / period)*period;
		let dis = (epochBegin + period - current);
		let h = parseInt(dis / 3600);
		let m = parseInt((dis % 3600)/60)
		let s = parseInt(dis % 60) 
		setCountDownText(`${h} h ${m} m ${s} s`);
	}

	useEffect(() => {
		const interval = window.setInterval(count,1000);
		const isApprove = async () => {
			setIsApproved(await isUnlocked(chainId,baseToken,address))
		}
		const getUserInfo = async () => {
			const userInfo  = await getUserInfoAll(address);
			const claimed = deriToNatural(userInfo.total).toFixed(2);
			const unclaimed = userInfo.valid ? (+userInfo.amount).toFixed(2) : 0;
			const harvestDeriLp = (+userInfo.lp).toFixed(2);
			const harvestDeriTrade = (+userInfo.trade).toFixed(2);
			setUserInfo({
				claimed,
				unclaimed,
				harvestDeriLp,
				harvestDeriTrade
			})
		}
		const loadLiquidityInfo = async () => {
			const info = await getLiquidityInfo(chainId,baseToken,address);
			const apyPool = await getPoolInfoApy(chainId,baseToken)
			setLiquidity({
				total : (+info.poolLiquidity),
				apy : apyPool.apy,
				shareValue : info.shareValue,
				percent : ((info.shares * info.shareValue) / info.poolLiquidity) * 100 ,
				shares : info.shares
			})
		}
		isApprove();
		getUserInfo();
		loadLiquidityInfo();
		return () => {
			clearInterval(interval);
		};
	}, [])

	const approve = async () => {
		const res = await unlock(chainId,baseToken,address);
		if(res.success){
			setIsApproved(true)
		}
	}

  return (
    <div className="liquidity-info">
      <div className="claim-box">
				<div className="odd title">My Liquidity-Providing Harvest in Current Epoch</div>
				<div className="odd text">
						<div className="text-title">Current Epoch Remaining Time</div>
						<div className="text-num">{ countDownText }</div>
				</div>
				<div className="odd text">
						<div className="text-title">My Harvest in Current Epoch (estimated)</div>
						<div className="text-num">{ userInfo.harvestDeriLp } DERI</div>
				</div>
				<div className="odd text">
						<div className="text-title">Claimed DERI</div>
						<div className="text-num">{ userInfo.claimed }</div>
				</div>
				<div className="odd text">
						<div className="text-title"></div>
						<div className="text-num"></div>
				</div>
				<div className="odd text">
						<div className="text-title">Unclaimed DERI</div>
						<div className="text-num">{ userInfo.unclaimed }</div>
				</div>
				<div className="odd claim-network">
						{/* <div className="text-title">Your DERI is on { claimenetwork } . Connect to { claimenetwork } to claim.</div> */}
				</div>
				<div className="claim-btn">
						<button className="claim"
						id="claimmyderi">
						<span
							className="spinner spinner-border spinner-border-sm"
							role="status"
							aria-hidden="true"
							style={{display: 'none'}}></span>
								CLAIM
						</button>
				</div>
      </div>
      <div className="liquidity-box">
      <div className="odd title">Provide { baseToken } Earn DERI</div>
				<div className="odd text">
						<div className="text-title">Pool Total Liquidity</div>
						<div className="text-num"> { liquidity.total || '--'} { baseToken }</div>
				</div>
				<div className="odd text">
						<div className="text-title">APY</div>
						<div className="text-num">{ liquidity.apy|| '--' }</div>
				</div>
				<div className="odd text">
						<div className="text-title">Liquidity Share Value</div>
						<div className="text-num">{ liquidity.shareValue || '--'} { baseToken }</div>
				</div>
				<div className="odd text">
						<div className="text-title">My Liquidity Pencentage</div>
						<div className="text-num">{ liquidity.percent || '--' }</div>
				</div>
				<div className="odd text">
						<div className="text-title">Staked Balance </div>
						<div className="text-num">{ liquidity.shares || '--' }  <span>Shares</span> </div>
				</div>
				<div className="odd claim-network">
					<div className="text-title money">{ baseToken }</div>
						
				</div>
				<div className="title-check">
					{}
				</div>
				<div className="liquidity-btn">
						{isApproved &&<div className="add-remove-liquidity">
						<button 
								className="add-liquidity"
								data-toggle="modal"
								data-target="#addLiquidity"
						>
								ADD LIQUIDITY
						</button>
						<button 
								className="remove-liquidity"
								data-toggle="modal"
								data-target="#removeLiquidity"
						>
								REMOVE LIQUIDITY
						</button>
					</div>}
					{!isApproved &&<div className="approve" >
						<button className="approve-btn" onClick={approve} >
							<span
								className="spinner spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"
								style={{display: 'none'}}
							></span>
								APPROVE
						</button>
					</div>}
			</div>
	</div>
</div>)
}