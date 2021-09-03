import {useEffect,useState} from 'react'
import {useParams} from "react-router-dom";
import LiquidityMining from "../../../components/Mining/Liquidity/LiquidityMining";
import TradeMining from "../../../components/Mining/Trade/TradeMining";
import {DeriEnv,isPoolController,openConfigListCache} from '../../../lib/web3js/indexV2'
import config from '../../../config.json'
import classnames from "classnames";
import { inject, observer } from 'mobx-react';
import useQuery from '../../../hooks/useQuery'
import './mining.less'
import './de-mining.less'

const env = DeriEnv.get();
const {chainInfo} = config[env]

function Mining({wallet,lang}){
	const [currentTab,setCurrentTab] = useState('liquidity')
	const {version,chainId,baseToken,address,type} =  useParams();
	const query = useQuery();
	const networkText = chainInfo[chainId].name;
	const [isController,setIsController] = useState(false)
	const props = {version,chainId,baseToken,address,wallet,type,lang}
	const poolInfoClass = classnames('mining-info',currentTab)
	if(query.has('baseTokenId')) {
		props['baseTokenId'] = query.get('baseTokenId')
	}
	if(query.has('symbolId')){
		props['symbolId'] = query.get('symbolId')
	}
	const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

	const PoolController = async () => {
		let res = await isPoolController(wallet.detail.chainId,address,wallet.detail.account)
		setIsController(res)
	}

	const gotoMining = ()=>{
		alert(lang['please-operat'])
	}

	const openConfigList = async ()=>{
		await openConfigListCache.update()
	}

	useEffect(()=>{
		if(hasConnectWallet()){
			PoolController()
			if(version === 'v2_lite_open'){
				openConfigList()
			}
		}
	},[wallet,wallet.detail,address])
	
	return(
    <div className={poolInfoClass}>
			<div className="pool-header">
					<div className="pool-network">
							{baseToken} @ {networkText}
					</div>
					{version !== 'v2_lite_open' && <div className="check-trade-liquidity">
							<div className='liquidity-mining' onClick={() => setCurrentTab('liquidity')} >
								{lang['liquidity-mining']}
							</div>
					</div>}
			</div>
			<div className='pool-info'>
					<LiquidityMining {...props}/>
			</div>
			{isController && <>
				<div className='add-symbol'>
					<button onClick={() => gotoMining()} >
						{lang['add-symbol']}
					</button>
				</div>
			</>}
		</div>
	)
}

export default inject('wallet')(observer(Mining))