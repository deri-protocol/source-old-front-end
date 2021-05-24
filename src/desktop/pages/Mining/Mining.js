import {useState} from 'react'
import {useParams} from "react-router-dom";
import LiquidityMining from "../../../components/Mining/Liquidity/LiquidityMining";
import TradeMining from "../../../components/Mining/Trade/TradeMining";
import {DeriEnv} from '../../../lib/web3js/indexV2'
import config from '../../../config.json'
import './mining.less'
import classnames from "classnames";
import { inject, observer } from 'mobx-react';
import useQuery from '../../../hooks/useQuery'

const env = DeriEnv.get();
const {chainInfo} = config[env]

function Mining({wallet}){
	const [currentTab,setCurrentTab] = useState('liquidity')
	const {chainId,symbol,baseToken,address,type} =  useParams();
	const query = useQuery();
	const networkText = chainInfo[chainId].text;
	const props = {chainId,symbol,baseToken,address,wallet,type,baseTokenId,symbolId}
	const poolInfoClass = classnames('mining-info',currentTab)
	return(
    <div className={poolInfoClass}>
			<div className="pool-header">
					<div className="pool-network">
						{type === 'lp' ? `${baseToken} @ ${networkText}` : `${symbol}/${baseToken} @ ${networkText}`}
					</div>
					<div className="check-trade-liquidity">
							<div className='liquidity-mining' onClick={() => setCurrentTab('liquidity')} >
									LIUQIDITY MINING
							</div>
							<div className='trade-mining' onClick={() => setCurrentTab('trade')} >
									TRADING MINING
							</div>
					</div>
			</div>
			<div className='pool-info'>
					<LiquidityMining {...props}/>
					<TradeMining {...props}/>
			</div>
		</div>
	)
}

export default inject('wallet')(observer(Mining))