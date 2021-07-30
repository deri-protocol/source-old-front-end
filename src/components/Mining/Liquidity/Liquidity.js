import React, { useState, useEffect} from 'react'
import {
	getLiquidityInfo,getPoolInfoApy,isUnlocked,unlock,getPoolLiquidity, getWalletBalance, unlockLp, isLpUnlocked, getLpWalletBalance, getLpLiquidityInfo,getLpPoolInfoApy, bg
} from '../../../lib/web3js/indexV2'
import AddLiquidity from './Dialog/AddLiquidity';
import RemoveLiquidity from './Dialog/RemoveLiquidity';
import Button from '../../Button/Button';
import { inject, observer } from 'mobx-react';
import withModal from '../../hoc/withModal';
import { eqInNumber, isCakeLP, isLP, isSushiLP } from '../../../utils/utils';
import DeriNumberFormat from '../../../utils/DeriNumberFormat';

function Liquidity({wallet,version,chainId,baseToken,address,type,baseTokenId,symbolId,lang,loading}) {
  const [liquidity,setLiquidity] = useState({})
  const [bToken,setBToken] = useState(baseToken)
	const isLpPool = (type === 'lp')
	const loadLiquidityInfo = async () => {
		loading.loading();
		const apyPool = await getPoolInfoApy(chainId,address,baseTokenId)
		const pooLiquidity = await getPoolLiquidity(chainId,address,baseTokenId);
		if(wallet.isConnected() && eqInNumber(chainId , wallet.detail.chainId)){
			let info = null;
			if(isLpPool){
				info = await getLpLiquidityInfo(chainId,address,wallet.detail.account)
			} else {
				info = await getLiquidityInfo(chainId,address,wallet.detail.account,baseTokenId);
			}
			let lpApy ;
			if(isLP(address)){
				let lapy = await getLpPoolInfoApy(chainId,address)
				lpApy = (+lapy.apy2) * 100;                     						
				// if(!info.shareValue){
				// 	info.shareValue = 1; 
				// }
			}
			if(info){
				const shares = info.shares ? bg(info.shares) : bg(0)
				if(version === 'v1' || version === 'v2_lite') {
					const total = shares.isNaN() ? bg(0) : shares.multipliedBy(info.shareValue) 
					setLiquidity({
						total :  info.poolLiquidity,
						apy : ((+apyPool.apy) * 100).toFixed(2),
						shareValue : info.shareValue,
						percent : info.poolLiquidity > 0 ? total.dividedBy(info.poolLiquidity).multipliedBy(100).toFixed(2) : 0,
						shares : shares.toFixed(2),
						formatShares : shares.toFixed(2),
						totalShares : bg(shares).toString(),
						values : total.toFixed(2),
						lpApy,
						unit : lang['shares'],
						sharesTitle : lang['staked-balance']
					})
				} else {
					setLiquidity({
						total : info.poolLiquidity,
						apy : ((+apyPool.apy) * 100).toFixed(2),
						pnl : (+info.pnl).toFixed(2),
						shares : shares.toString(),
						formatShares : bg(shares).plus(info.pnl).toFixed(2),
						totalShares : bg(shares).plus(info.pnl).toString(),
						percent : info.poolLiquidity > 0 ? shares.dividedBy(info.poolLiquidity).multipliedBy(100).toFixed(2) : 0,
						unit : baseToken,
						sharesTitle : lang['my-Liquidity'],
						multiplier : `${apyPool.multiplier}x`
					})
				}	
			}
		} else {
			
			let lpApy ;
			if(isLP(address)){
				let lapy = await getLpPoolInfoApy(chainId,address)
        		lpApy = (+lapy.apy2) * 100;                           
			}
			if(pooLiquidity){
				setLiquidity({
					total : pooLiquidity.liquidity,
					apy : (+apyPool.apy) * 100,
					lpApy
				})
			}
		}
		loading.loaded()
	}

	useEffect(() => {
		loadLiquidityInfo();
		//cake 显示的baseToken 不一致，特殊处理
		if(isCakeLP(address)){
			setBToken('CAKE-LP')
		}
		return () => {}
	}, [wallet.detail.account,baseToken])


  return (
    <div className="liquidity-box">
      <div className="odd title">{lang['provide']} { bToken } {lang['earn-deri']}</div>
				<div className="odd text">
						<div className="text-title">{lang['pool-total-liquidity']}</div>
						<div className="text-num"><DeriNumberFormat allowZero={true} value={ liquidity.total} suffix={` ${ bToken}`  } thousandSeparator={true}/></div>
				</div>
				{version === 'v2' && <div className='odd text'>
					<div className='text-title'>{lang['multiplier']}</div>
					<div className='text-num multiplier' title={lang['multiplier-tip']}>{liquidity.multiplier}</div>
				</div>	}
				<div className="odd text">
						<div className="text-title">{lang['apy']}</div>
						<div className='text-num' >
							<span title={isLP(address) && 'DERI-APY'} className={`${isLP(address) && 'sushi-apy-underline'}`}>
								<DeriNumberFormat value={ liquidity.apy } decimalScale={2} suffix='%'/></span>
								{isLP(address) && <><span> +</span> <span className="sushi-apy-underline text-num" title={isSushiLP(address) ? lang['sushi-apy'] : lang['cake-apy']}> 
								<DeriNumberFormat value={  liquidity.lpApy } allowZero={true}  decimalScale={2} suffix='%'/></span></>}
						</div>						
				</div>
				{(version === 'v1' || version === 'v2_lite') && <div className="odd text">
					<div className="text-title">{lang['liquidity-share-value']}</div>
					<div className="text-num"><DeriNumberFormat  allowZero={true} decimalScale={6} value={ liquidity.shareValue} suffix={ ' '+ bToken } thousandSeparator={true}/></div>						
				</div>}
				<div className="odd text">
						<div className="text-title">{lang['my-liquidity-pencentage']}</div>
						<div className="text-num"><DeriNumberFormat allowZero={true} value={ liquidity.percent } decimalScale={2} suffix={'%'}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">{liquidity.sharesTitle} </div>
						<div className="text-num"><DeriNumberFormat allowZero={true}  value={ liquidity.formatShares } decimalScale={2} /> <span>{liquidity.unit}</span> </div>
				</div>
				{version === 'v2' && <div className="odd text claim-network">
					<div className='text-title'>{lang['mining-pnl']}</div>
					<div className="text-num">≈ &nbsp;<DeriNumberFormat allowZero={true} prefix=' ' value={ liquidity.pnl } decimalScale={2} suffix ={' '+ bToken }  /></div>
				</div>}
				{(version === 'v1' || version === 'v2_lite' ) && <div className="odd claim-network">
					<div className="text-title money"> <DeriNumberFormat allowZero={true}   value={liquidity.values} suffix ={' '+ bToken } decimalScale={2}/></div>						
				</div>}
				<Operator version={version} wallet={wallet} chainId={chainId} address={address} liqInfo={liquidity} baseToken={bToken} isLpPool={isLpPool} loadLiqidityInfo={loadLiquidityInfo} symbolId={symbolId} baseTokenId={baseTokenId} lang={lang}/>
	</div>
  )
}


const AddDialog = withModal(AddLiquidity)
const RemoveDialog = withModal(RemoveLiquidity)

//操作区
const Operator = ({version,wallet,chainId,address,baseToken,isLpPool,liqInfo,loadLiqidityInfo,baseTokenId,symbolId,lang})=> {
	const [isApproved,setIsApproved] = useState(false)
	const [btnType, setBtnType] = useState('add')
	const [isOpen, setIsOpen] = useState(false)
	const [balance, setBalance] = useState('');
	const [buttonElment, setButtonElment] = useState(null);
	

  const loadBalance = async () => {
    if(wallet.isConnected() && eqInNumber(wallet.detail.chainId,chainId)){
			let total = null;
			if(isLpPool){
				total = await getLpWalletBalance(wallet.detail.chainId,address,wallet.detail.account);
			} else {
				total = await getWalletBalance(wallet.detail.chainId,address,wallet.detail.account,baseTokenId);
			}
			if(typeof total !== 'object'){
				setBalance(total)				
			}
    }
  }

  useEffect(() => {
		loadBalance();
		loadLiqidityInfo();
    return () => {}
  }, [wallet.detail.account])


	const isApprove = async () => {
		if(isLpPool){
			const result = await isLpUnlocked(chainId,address,wallet.detail.account) 			 
			setIsApproved(result);
			return result;
		} else {
			const result = await isUnlocked(chainId,address,wallet.detail.account,baseTokenId) 			 
			setIsApproved(result);
			return result;
		}
	}
	


	const approve = async () => {
		let res = null;
		if(isLpPool){
			res = await unlockLp(chainId,address,wallet.detail.account);
		} else {
			res = await unlock(chainId,address,wallet.detail.account,baseTokenId);
		}		
		if(res && res.success){
			setIsApproved(true)
		} else {
			alert(res.error ?  res.error.message || lang['approve-failed'] : lang['approve-failed'])
		}
  }


	const connect =  async () => {
		try {
			const result = await wallet.connect();
			return result ? true : false
		} catch (e){
			return false
		}
	}
	
	const addLiquidity = () => {
		setIsOpen(true);
		setBtnType('add')
	}

	const afterClick = () => {
		setIsOpen(false);
		// loadLiquidity()
		loadBalance();
		loadLiqidityInfo();
		wallet.refresh()
	}

	const removeLiquidity = () => {
		setIsOpen(true);
		setBtnType('remove')
	}


  
  useEffect(() => {
		//todo 判断网络
    if(wallet.isConnected() && eqInNumber(wallet.detail.chainId, chainId)){
			isApprove()
    }
		return () => {}
	}, [wallet.detail.account])

	useEffect(() => {		
		if(wallet.isConnected() && eqInNumber(wallet.detail.chainId,chainId) && isApproved){
			setButtonElment((<div className="add-remove-liquidity">
			<button 
					className="add-liquidity"
					onClick={addLiquidity}>
					{lang['add-liquidity']}
			</button>
			<button className="remove-liquidity" onClick={removeLiquidity}>
					{lang['remove-liquidity']}
			</button>
		</div>))
		} else {
			let el = null
			if(!wallet.isConnected()){
				el = <div className='approve'><Button className='approve-btn' click={connect} btnText={lang['connect-wallet']} lang={lang}></Button></div>
			} else if(!eqInNumber(wallet.detail.chainId,chainId)) {
				wallet.switchNetwork({id: chainId})
				el = <div className="approve" ><Button className='approve-btn wrong-network' btnText={lang['wrong-network']}  lang={lang} click={() => wallet.switchNetwork({id : chainId})} ></Button></div>				
			} else if(!isApproved) {
				el = <div className='approve'><Button className='approve-btn' click={approve} btnText={lang['approve']} lang={lang}></Button></div>
			} 
			setButtonElment(el)
		}
			
		return () => {};
	}, [wallet.detail.account,isApproved]);

  return (
    <div className="liquidity-btn">
			{
				btnType === 'add' 
				? <AddDialog  modalIsOpen={isOpen} isLpPool={isLpPool} onClose={afterClick} balance={balance}
										  address={address} wallet={wallet} baseToken={baseToken} afterAdd={afterClick} baseTokenId={baseTokenId}  symbolId={symbolId} lang={lang}/> 
				: <RemoveDialog  modalIsOpen={isOpen} isLpPool={isLpPool} onClose={afterClick} liqInfo={liqInfo}  
											address={address} wallet={wallet} version={version} unit={version === 'v1' ? lang['shares'] :baseToken} afterRemove={afterClick} baseTokenId={baseTokenId} symbolId={symbolId} lang={lang}/>
			}			
			{buttonElment}
  </div>
  )
}

export default inject('wallet','loading')(observer(Liquidity))