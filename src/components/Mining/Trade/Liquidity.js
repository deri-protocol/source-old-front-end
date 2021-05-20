import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { getUserInfoAll,getUserInfoInPool ,getPoolInfoApy} from '../../../lib/web3js/indexV2';
import { useHistory } from 'react-router-dom';



export default function Liquidity({wallet = {},chainId,address}) {
  const [userInfoInPool,setUserInfoInPool] = useState({})
  const [tradeSummary, setTradeSummary] = useState({});
  const history = useHistory();

	const loadUserInfoInPool = async () => {
		const userInfo = await getUserInfoAll(wallet.account);
		const userInfoPool = await getUserInfoInPool(chainId,address,wallet.account);
		const harvestDeriTrade = (+userInfo.trade).toFixed(2);
		const myTradingVolumeCurrent = userInfoPool.volume1h
		setUserInfoInPool({harvestDeriTrade,myTradingVolumeCurrent})
	}

	const getTradeInfo = async () => {
		const poolInfo = await getPoolInfoApy(chainId,address);
		const totalTradingVolumeCurrent = poolInfo.volume1h
		setTradeSummary({totalTradingVolumeCurrent})
  }
  
  const toTrade = () => history.push('/lite')

	useEffect(() => {
		if(wallet && wallet.account){
			loadUserInfoInPool();
			getTradeInfo();
		}
		return () => {};
	}, []);

  return(
    <div className="liquidity-box">
      <div className="odd title">Trade to Earn DERI</div>
        <div className="odd text">
            <div className="text-title">Total Trading Volume in Current Hour</div>
            <div className="text-num">{ tradeSummary.totalTradingVolumeCurrent || 0}</div>
        </div>
        <div className="odd text">
            <div className="text-title">My Trading Volume in Current Hour</div>
            <div className="text-num">{ userInfoInPool.myTradingVolumeCurrent || 0 }</div>
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
            <button className="claim" onClick={toTrade}>
              TRADE
            </button>
        </div>
    </div> 
  )
}