import React,{useState,useEffect} from 'react';
import {Link} from 'react-router-dom'
import {
	getUserInfoAll,
	getUserInfoInPool,
	deriToNatural,
	getLiquidityInfo,
	getPoolInfoApy,
	isUnlocked,
	unlock
} from '../../../lib/web3js/index'

export default function TradeMining({chainId,baseToken,address}){
	const [userInfoInPool,setUserInfoInPool] = useState({})
	const [tradeSummary, setTradeSummary] = useState({});

	useEffect(() => {
		const loadUserInfoInPool = async () => {
			const userInfo = await getUserInfoAll(address);
			const unclaimed = userInfo.valid ? (+userInfo.amount).toFixed(2) : 0;
			const harvestDeriLp = (+userInfo.lp).toFixed(2);
			const harvestDeriTrade = (+userInfo.trade).toFixed(2);
			const userInfoPool = await getUserInfoInPool(chainId,baseToken,address);
			const myTradingVolumeCurrent = userInfoPool.volume1h
			setUserInfoInPool({
				unclaimed,
				harvestDeriLp,
				harvestDeriTrade,
				myTradingVolumeCurrent
			})
		}

		const getTradeInfo = async () => {
			const poolInfo = await getPoolInfoApy(chainId,baseToken);
			const totalTradingVolumeCurrent = poolInfo.volume1h
			setTradeSummary({
				totalTradingVolumeCurrent,
			})
		}
		loadUserInfoInPool();
		getTradeInfo();
		return () => {};
	}, []);
  return(
    <div className="trade-info">
      <div className="claim-box">
        <div className="odd title">My Trading Harvest in Current Epoch</div>
        <div className="odd text">
            <div className="text-title">My Trading Harvest in Current Epoch (Est)</div>
            <div className="text-num">{ userInfoInPool.harvestDeriTrade } DERI</div>
        </div>
        <div className="odd text">
            <div className="text-title">Claimed DERI</div>
            <div className="text-num">{ userInfoInPool.claimed }</div>
        </div>
        <div className="odd text">
            <div className="text-title"></div>
            <div className="text-num"></div>
        </div>
        
        <div className="odd text">
            <div className="text-title"></div>
            <div className="text-num"></div>
        </div>
        <div className="odd text">
            <div className="text-title">Unclaimed DERI</div>
            <div className="text-num">{ userInfoInPool.unclaimed }</div>
        </div>
        <div className="odd claim-network">
            <div className="text-title"></div>
        </div>
        <div className="claim-btn">
            <button className="claim" id="tradeclaimmyderi" >
              <span
                className="spinner spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
                style={{display: 'none'}}
              ></span>
                CLAIM
            </button>
        </div>
    </div>
    <div className="liquidity-box">
      <div className="odd title">Trade to Earn DERI</div>
        <div className="odd text">
            <div className="text-title">Total Trading Volume in Current Hour</div>
            <div className="text-num">{ tradeSummary.totalTradingVolumeCurrent }</div>
        </div>
        <div className="odd text">
            <div className="text-title">My Trading Volume in Current Hour</div>
            <div className="text-num">{ userInfoInPool.myTradingVolumeCurrent }</div>
        </div>
        <div className="odd text">
            <div className="text-title"></div>
            <div className="text-num"></div>
        </div>
        <div className="odd text">
            <div className="text-title"></div>
            <div className="text-num"></div>
        </div>
        <div className="odd text">
            <div className="text-title"></div>
            <div className="text-num"></div>
        </div>
        <div className="odd claim-network">
              
        </div>
        <div className="claim-btn">
            <Link to='/lite'>
                <button className="claim">
                  TRADE
                </button>
              </Link>
        </div>
    </div>
  </div>
  )
}