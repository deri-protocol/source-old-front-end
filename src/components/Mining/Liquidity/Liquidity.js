import React, { useState, useEffect} from 'react'
import {
	getLiquidityInfo,getPoolInfoApy,isUnlocked,unlock,getPoolLiquidity, getWalletBalance
} from '../../../lib/web3js/indexV2'
import AddLiquidity from './Dialog/AddLiquidity';
import RemoveLiquidity from './Dialog/RemoveLiquidity';
import Button from '../../Button/Button';
import { inject, observer } from 'mobx-react';
import withModal from '../../hoc/withModal';
import { eqInNumber } from '../../../utils/utils';
import DeriNumberFormat from '../../../utils/DeriNumberFormat';

function Liquidity({wallet,chainId,baseToken,address}) {
  const [liquidity,setLiquidity] = useState({})

	const loadLiquidityInfo = async () => {
		const apyPool = await getPoolInfoApy(chainId,baseToken)
		if(wallet.isConnected() && eqInNumber(chainId , wallet.detail.chainId)){
			const info = await getLiquidityInfo(chainId,address,wallet.detail.account);
			if(info){
				setLiquidity({
					total :  (+info.poolLiquidity),
					apy : (+apyPool.apy),
					shareValue : (+info.shareValue).toFixed(6),
					percent : (((info.shares * info.shareValue) / info.poolLiquidity) * 100).toFixed(2) ,
					shares : (+info.shares).toFixed(2),
					values : (+info.shares * info.shareValue).toFixed(2)
				})	
			}
		} else {
			const info = await getPoolLiquidity(chainId,address);
			if(info){
				setLiquidity({
					total : (+info.liquidity),
					apy : (+apyPool.apy)
				})
			}
		}
	}

	useEffect(() => {
		loadLiquidityInfo();
		return () => {}
	}, [wallet.detail.account])


  return (
    <div className="liquidity-box">
      <div className="odd title">Provide { baseToken } Earn DERI</div>
				<div className="odd text">
						<div className="text-title">Pool Total Liquidity</div>
						<div className="text-num"><DeriNumberFormat value={ liquidity.total} suffix={ baseToken } thousandSeparator={true}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">APY</div>
						<div className="text-num">{ liquidity.apy || '--' }</div>
				</div>
				<div className="odd text">
						<div className="text-title">Liquidity Share Value</div>
						<div className="text-num"><DeriNumberFormat value={ liquidity.shareValue} suffix={ ' '+ baseToken } thousandSeparator={true}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">My Liquidity Pencentage</div>
						<div className="text-num"><DeriNumberFormat value={ liquidity.percent } suffix={'%'}/></div>
				</div>
				<div className="odd text">
						<div className="text-title">Staked Balance </div>
						<div className="text-num"><DeriNumberFormat value={ liquidity.shares  } decimalScale={2} /> <span>Shares</span> </div>
				</div>
				<div className="odd claim-network">
					<div className="text-title money"><DeriNumberFormat value={liquidity.values} suffix ={' '+ baseToken } decimalScale={2}/></div>
						
				</div>
				<div className="title-check">
				</div>
				 <Operator wallet={wallet} chainId={chainId} address={address} baseToken={baseToken} loadLiquidity={loadLiquidityInfo}/>
	</div>
  )
}


const AddDialog = withModal(AddLiquidity)
const RemoveDialog = withModal(RemoveLiquidity)

//操作区
const Operator = ({wallet,chainId,address,baseToken,loadLiquidity})=> {
	const [isApproved,setIsApproved] = useState(false)
	const [btnType, setBtnType] = useState('add')
	const [isOpen, setIsOpen] = useState(false)
	const [btnText, setBtnText] = useState('Collect Wallet')
	const [balance, setBalance] = useState('');
	const [liqInfo, setLiqInfo] = useState({})
	const [buttonElment, setButtonElment] = useState(null);
	
	const loadLiqidityInfo = async () => {
    if(wallet.isConnected() && eqInNumber(wallet.detail.chainId,chainId)){
      const info = await getLiquidityInfo(wallet.detail.chainId,address,wallet.detail.account);	
      setLiqInfo({shares : info.shares})
    }
  }


  const loadBalance = async () => {
    if(wallet.isConnected() && eqInNumber(wallet.detail.chainId,chainId)){
      const total = await getWalletBalance(wallet.detail.chainId,address,wallet.detail.account);
      setBalance(total)
    }
  }

  useEffect(() => {
		loadBalance();
		loadLiqidityInfo();
    return () => {}
  }, [wallet.detail.account])


	const isApprove = async () => {
		const result = await isUnlocked(chainId,address,wallet.detail.account) 
		setIsApproved(result);
		return result;
  }

	const approve = async () => {
		const res = await unlock(chainId,address,wallet.detail.account);
		if(res.success){
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
				? <AddDialog  modalIsOpen={isOpen} onClose={afterClick} balance={balance} address={address} wallet={wallet} baseToken={baseToken} afterAdd={afterClick}/> 
				: <RemoveDialog  modalIsOpen={isOpen} onClose={afterClick} liqInfo={liqInfo} address={address} wallet={wallet} baseToken={baseToken} afterRemove={afterClick}/>
			}			
			{buttonElment}
  </div>
  )
}

export default inject('wallet')(observer(Liquidity))