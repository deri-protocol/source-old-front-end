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

function Mining({wallet,lang}){
	const [currentTab,setCurrentTab] = useState('liquidity')
	const {version,chainId,baseToken,address,type} =  useParams();
	const query = useQuery();
	const networkText = chainInfo[chainId].text;
	const props = {version,chainId,baseToken,address,wallet,type,lang}
	const poolInfoClass = classnames('mining-info',currentTab)
	if(query.has('baseTokenId')) {
		props['baseTokenId'] = query.get('baseTokenId')
	}
	if(query.has('symbolId')){
		props['symbolId'] = query.get('symbolId')
	}
	
	return(
    <div className={poolInfoClass}>
			<div className="pool-header">
					<div className="pool-network">
							{baseToken} @ {networkText}
					</div>
					<div className="check-trade-liquidity">
							<div className='liquidity-mining' onClick={() => setCurrentTab('liquidity')} >
								{lang['liquidity-mining']}
							</div>
					</div>
			</div>
			<div className='pool-info'>
					<LiquidityMining {...props}/>
			</div>
		</div>
	)
}

export default inject('wallet')(observer(Mining))