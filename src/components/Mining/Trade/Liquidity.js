import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import { getUserInfoAll,getUserInfoInPool ,getPoolInfoApy} from '../../../lib/web3js/indexV2';
import { useHistory } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { storeConfig, eqInNumber } from '../../../utils/utils';
import Config from '../../../model/Config';

const configInfo = new Config();


function Liquidity({wallet = {},version,chainId,address,symbolId,lang}) {
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
  
  const toTrade = () => {
    const configs = configInfo.load(version);
    const config = version.isV1 ? configs.find(c => eqInNumber(c.pool,address)) : configs.find(c => eqInNumber(c.pool,address) && c.symbolId === symbolId)
    storeConfig(version.current,config)
    history.push('/lite')
  }

	useEffect(() => {
		if(wallet && wallet.account){
			loadUserInfoInPool();
			getTradeInfo();
		}
		return () => {};
	}, []);

  return(
    <div className="liquidity-box">
      <div className="odd title">{lang['trade-to-earn-deri']}</div>
        <div className="odd text">
            <div className="text-title">{lang['total-trading-volume-in-current-hour']}</div>
            <div className="text-num">{ tradeSummary.totalTradingVolumeCurrent || 0}</div>
        </div>
        <div className="odd text">
            <div className="text-title">{lang['my-trading-volume-in-current-hour']}</div>
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
              {lang['trade']}
            </button>
        </div>
    </div> 
  )
}
export default inject('version')(observer(Liquidity))