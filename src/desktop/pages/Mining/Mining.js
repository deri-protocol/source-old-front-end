import {useEffect, useState} from 'react'
import {useParams,useHistory} from "react-router-dom";
import LiquidityMining from "../../../components/Mining/Liquidity/LiquidityMining";
import TradeMining from "../../../components/Mining/Trade/TradeMining";
import {DeriEnv,isPoolController,openConfigListCache} from '../../../lib/web3js/indexV2'
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
	const history = useHistory();
	const [isController,setIsController] = useState(false)
	const {version,chainId,symbol,baseToken,address,type} =  useParams();
	const query = useQuery();
	const networkText = chainInfo[chainId] && chainInfo[chainId].name;
	const props = {version,chainId,symbol,baseToken,address,wallet,type,lang}
	const url = `/addsymbol/${version || 'v1'}/${chainId}/${type}/${symbol}/${baseToken}/${address}`
	if(query.has('baseTokenId')) {
		props['baseTokenId'] = query.get('baseTokenId')
	}
	if(query.has('symbolId')){
		props['symbolId'] = query.get('symbolId')
	}
	const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

	const isPoolAdmin = async () => {
		let res = await isPoolController(wallet.detail.chainId,address,wallet.detail.account).catch(e => console.log(e))
		setIsController(res)
	}

	const openConfigList = async ()=>{
		await openConfigListCache.update()
	}

	const gotoMining = (url)=>{
		history.push(url)
	}

	useEffect(()=>{
		if(hasConnectWallet()){
			if(version === 'v2_lite_open'){
				isPoolAdmin()
				openConfigList()
			}
		}
	},[wallet,wallet.detail,address])

	const poolInfoClass = classnames('mining-info',currentTab,{'open-zone' : version === 'v2_lite_open'})
	return(
    <div className={poolInfoClass}>
			<div className="pool-header">
					<div className="pool-network">
						{type === 'lp' ? `${baseToken} @ ${networkText}` :  (version === 'v2' || version === 'v2_lite' || version === 'v2_lite_open' || version === 'option') ? `${baseToken} @ ${networkText}` : `${symbol}/${baseToken} @ ${networkText}` }
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
			{(isController && version === 'v2_lite_open') && <>
				<div className='add-symbol'>
					<button onClick={() => gotoMining(url)} >
						{lang['add-symbol']}
					</button>
				</div>
			</>}
		</div>
	)
}

export default inject('wallet')(observer(Mining))