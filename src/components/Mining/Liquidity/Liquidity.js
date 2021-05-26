import React, { useState, useEffect} from 'react'
import {
	getLiquidityInfo,getPoolInfoApy,isUnlocked,unlock,getPoolLiquidity, getWalletBalance, unlockLp, isLpUnlocked, getLpWalletBalance, getLpLiquidityInfo,getLpPoolInfoApy
} from '../../../lib/web3js/indexV2'
import AddLiquidity from './Dialog/AddLiquidity';
import RemoveLiquidity from './Dialog/RemoveLiquidity';
import Button from '../../Button/Button';
import { inject, observer } from 'mobx-react';
import withModal from '../../hoc/withModal';
import { eqInNumber, isCakeLP, isLP, isSushiLP } from '../../../utils/utils';
import DeriNumberFormat from '../../../utils/DeriNumberFormat';

function Liquidity({wallet,chainId,baseToken,address,type,baseTokenId,symbolId}) {
  const [liquidity,setLiquidity] = useState({})
  const [bToken,setBToken] = useState(baseToken)

	const isLpPool = (type === 'lp')
	

	const loadLiquidityInfo = async () => {
		const apyPool = await getPoolInfoApy(chainId,address)
		const pooLiquidity = await getPoolLiquidity(chainId,address,baseTokenId,symbolId);
		if(wallet.isConnected() && eqInNumber(chainId , wallet.detail.chainId)){
			let info = null;
			if(isLpPool){
				info = await getLpLiquidityInfo(chainId,address,wallet.detail.account)
			} else {
				info = await getLiquidityInfo(chainId,address,wallet.detail.account,baseTokenId,symbolId);
			}
			let lpApy ;
			if(isLP(address)){
				let lapy = await getLpPoolInfoApy(chainId,address)
				lpApy = (+lapy.apy2) * 100;                     						
				if(!info.shareValue){
					info.shareValue = 1; 
				}
			}

			if(info){
				setLiquidity({
					total :  (+info.poolLiquidity),
					apy : (+apyPool.apy) * 100,
					shareValue : info.shareValue,
					percent : ((info.shares * info.shareValue) / info.poolLiquidity) * 100 ,
					shares : info.shares,
					values : info.shares * info.shareValue,
					lpApy
				})	
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
	}

	useEffect(() => {
		loadLiquidityInfo();
		if(isCakeLP(address)){
			setBToken('CAKE-LP')
		}
		return () => {}
	}, [wallet.detail.account,baseToken])


  return (
    <div className="liquidity-box">
      <div className="odd title">Provide { bToken } Earn DERI</div>
				<div className="odd text">
						<div className="text-title">Pool Total Liquidity</div>
						<div className="text-num"><DeriNumberFormat allowZero={true} value={ liquidity.total} suffix={` ${ bToken}`  } thousandSeparator={true}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">APY</div>
						<div className='text-num' >
							<span title={isLP(address) && 'DERI-APY'} className={`${isLP(address) && 'sushi-apy-underline'}`}><DeriNumberFormat value={ liquidity.apy } decimalScale={2} suffix='%'/></span>
							{isLP(address) && <><span> +</span> <span className="sushi-apy-underline text-num" title={isSushiLP(address) ? 'SUSHI-APY' : 'CAKE-APY'}> 
							<DeriNumberFormat value={ liquidity.lpApy } allowZero={true}  decimalScale={2} suffix='%'/></span></>}
						</div>						
				</div>	
				<div className="odd text">
						<div className="text-title">Liquidity Share Value</div>
						<div className="text-num"><DeriNumberFormat  allowZero={true} decimalScale={6} value={ liquidity.shareValue} suffix={ ' '+ bToken } thousandSeparator={true}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">My Liquidity Pencentage</div>
						<div className="text-num"><DeriNumberFormat allowZero={true} value={ liquidity.percent } decimalScale={2} suffix={'%'}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">Staked Balance </div>
						<div className="text-num"><DeriNumberFormat allowZero={true}  value={ liquidity.shares  } decimalScale={2} /> <span>Shares</span> </div>
				</div>
				<div className="odd claim-network">
					<div className="text-title money"><DeriNumberFormat allowZero={true}   value={liquidity.values} suffix ={' '+ bToken } decimalScale={2}/></div>
						
				</div>
				<div className="title-check">
				</div>
				<Operator wallet={wallet} chainId={chainId} address={address} liqInfo={liquidity} baseToken={bToken} loadLiquidity={loadLiquidityInfo} isLpPool={isLpPool} loadLiqidityInfo={loadLiquidityInfo} symbolId={symbolId} baseTokenId={baseTokenId}/>
	</div>
  )
}


const AddDialog = withModal(AddLiquidity)
const RemoveDialog = withModal(RemoveLiquidity)

//操作区
const Operator = ({wallet,chainId,address,baseToken,loadLiquidity,isLpPool,liqInfo,loadLiqidityInfo,baseTokenId,symbolId})=> {
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
			alert(res.error ?  res.error.message || 'Approve failed' : 'Approve failed')
		}
  }


	const connect =  async () => {
		await wallet.connect();
	}
	
	const addLiquidity = () => {
		setIsOpen(true);
		setBtnType('add')
	}

	const afterClick = () => {
		setIsOpen(false);
		loadLiquidity()
		loadBalance();
		loadLiqidityInfo();
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
					ADD LIQUIDITY
			</button>
			<button className="remove-liquidity" onClick={removeLiquidity}>
					REMOVE LIQUIDITY
			</button>
		</div>))
		} else {
			let el = null
			if(!wallet.isConnected()){
				el = <div className='approve'><Button className='approve-btn' click={connect} btnText='Connect Wallet'></Button></div>
			} else if(!eqInNumber(wallet.detail.chainId,chainId)) {
				el = <div className="approve" ><Button className='approve-btn wrong-network' btnText='Wrong Network'></Button></div>				
			} else if(!isApproved) {
				el = <div className='approve'><Button className='approve-btn' click={approve} btnText='APPROVE'></Button></div>
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
										  address={address} wallet={wallet} baseToken={baseToken} afterAdd={afterClick} baseTokenId={baseTokenId}  symbolId={symbolId}/> 
				: <RemoveDialog  modalIsOpen={isOpen} isLpPool={isLpPool} onClose={afterClick} liqInfo={liqInfo} 
											address={address} wallet={wallet} baseToken={baseToken} afterRemove={afterClick} baseTokenId={baseTokenId} symbolId={symbolId}/>
			}			
			{buttonElment}
  </div>
  )
}

export default inject('wallet')(observer(Liquidity))