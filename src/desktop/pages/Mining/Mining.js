import {useState} from 'react'
import {useParams} from "react-router-dom";
import LiquidityMining from "../../../components/Mining/Liquidity/LiquidityMining";
import TradeMining from "../../../components/Mining/Trade/TradeMining";
import {DeriEnv} from '../../../lib/web3js/index'
import config from '../../../config.json'
import './mining.less'
import classnames from "classnames";

const env = DeriEnv.get();
const {chainInfo} = config[env]

export default function Mining(){
	const [currentTab,setCurrentTab] = useState('liquidity')
	const {chainId,baseToken,address} =  useParams();
	const networkText = chainInfo[chainId].text;
	const props = {chainId,baseToken,address}
	const switchTab = () => {
		if(currentTab === 'liquidity') {
			setCurrentTab('trade')
		} else {
			setCurrentTab('liquidity')
		}
	}
	const liqClassName = classnames('liquidity-mining',{
		'selected' : currentTab === 'liquidity',
	})
	const tradeClassName = classnames('trade-mining',{
		'selected' : currentTab === 'trade'
	})
	return(
    <div className="mining-info">
			<div className="pool-header">
					<div className="pool-network">
							{baseToken} @ {networkText}
					</div>
					<div className="check-trade-liquidity">
							<div className={liqClassName} onClick={switchTab} >
									LIUQIDITY MINING
							</div>
							<div className={tradeClassName} onClick={switchTab} >
									TRADING MINING
							</div>
					</div>
			</div>
			<div className="pool-info">
					{currentTab === 'liquidity' &&<LiquidityMining {...props}/>}
					{currentTab === 'trade' &&<TradeMining {...props}/>}
			</div>
		</div>
	)
}