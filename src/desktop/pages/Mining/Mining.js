import {useState} from 'react'
import {useParams} from "react-router-dom";
import LiquidityMining from "../../../components/Mining/Liquidity/LiquidityMining";
import TradeMining from "../../../components/Mining/Trade/TradeMining";
import {DeriEnv} from '../../../lib/web3js/indexV2'
import config from '../../../config.json'
import './mining.less'
import './zh-mining.less'
import classnames from "classnames";
import { inject, observer } from 'mobx-react';
import useQuery from '../../../hooks/useQuery'

const env = DeriEnv.get();
const {chainInfo} = config[env]

function Mining({wallet,lang}){
	const [currentTab,setCurrentTab] = useState('liquidity')
	const {version,chainId,symbol,baseToken,address,type} =  useParams();
	const query = useQuery();
	const networkText = chainInfo[chainId] && chainInfo[chainId].name;
	const props = {version,chainId,symbol,baseToken,address,wallet,type,lang}
	if(query.has('baseTokenId')) {
		props['baseTokenId'] = query.get('baseTokenId')
	}
	if(query.has('symbolId')){
		props['symbolId'] = query.get('symbolId')
	}
	const poolInfoClass = classnames('mining-info',currentTab)
	return(
    <div className={poolInfoClass}>
			<div className="pool-header">
					<div className="pool-network">
						{type === 'lp' ? `${baseToken} @ ${networkText}` :  (version === 'v2' || version === 'v2_lite' || version === 'option') ? `${baseToken} @ ${networkText}` : `${symbol}/${baseToken} @ ${networkText}` }
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