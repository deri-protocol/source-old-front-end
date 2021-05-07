import React, { useState, useEffect} from 'react'
import {
	getLiquidityInfo,getPoolInfoApy,isUnlocked,unlock,getPoolLiquidity
} from '../../../lib/web3js/index'
import AddLiquidity from './Dialog/AddLiquidity';
import RemoveLiquidity from './Dialog/RemoveLiquidity';
import Button from '../../Button/Button';
import { inject, observer } from 'mobx-react';
import withModal from '../../hoc/withModal';

function Liquidity({wallet,chainId,baseToken,address}) {
  const [liquidity,setLiquidity] = useState({})

	const loadLiquidityInfo = async () => {
		const apyPool = await getPoolInfoApy(chainId,baseToken)
		if(wallet.isConnected() && chainId == wallet.detail.chainId){
			const info = await getLiquidityInfo(chainId,address,wallet.detail.account);
			if(info){
				setLiquidity({
					total :  (+info.poolLiquidity),
					apy : (+apyPool.apy),
					shareValue : (+info.shareValue).toFixed(6),
					percent : (((info.shares * info.shareValue) / info.poolLiquidity) * 100).toFixed(2) + '%',
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
						<div className="text-num"> { liquidity.total || '--'} { baseToken }</div>
				</div>
				<div className="odd text">
						<div className="text-title">APY</div>
						<div className="text-num">{ liquidity.apy || '--' }</div>
				</div>
				<div className="odd text">
						<div className="text-title">Liquidity Share Value</div>
						<div className="text-num">{ liquidity.shareValue || '--'} { baseToken }</div>
				</div>
				<div className="odd text">
						<div className="text-title">My Liquidity Pencentage</div>
						<div className="text-num">{ liquidity.percent || '--' }</div>
				</div>
				<div className="odd text">
						<div className="text-title">Staked Balance </div>
						<div className="text-num">{ liquidity.shares || '--' }  <span>Shares</span> </div>
				</div>
				<div className="odd claim-network">
					<div className="text-title money">{liquidity.values} { baseToken }</div>
						
				</div>
				<div className="title-check">
				</div>
				 <Operator wallet={wallet} chainId={chainId} address={address} baseToken={baseToken} loadLiquidity={loadLiquidityInfo}/>
	</div>
  )
}




const dialogStyles = {
  overlay: {
    position: 'fixed',
    background: 'none'
  },
  content: {
    position: 'absolute',
    border : 0,
    background : 'none',
		inset : 0,
		overflow : 'initial'
  }
};

//操作区
const Operator = ({wallet,chainId,address,baseToken,loadLiquidity})=> {
	const [isApproved,setIsApproved] = useState(false)
	const [btnType, setBtnType] = useState('add')
	const [isOpen, setIsOpen] = useState(false)
	const [btnText, setBtnText] = useState('Collect Wallet')

	const isApprove = async () => {
		const result = await isUnlocked(chainId,address,wallet.detail.account) 
		return result
  }

	const approve = async () => {
		const res = await unlock(chainId,address,wallet.detail.account);
		if(res.success){
			setIsApproved(true)
		}
  }


  const click = async () => {
    if(wallet.isConnected()){
      approve()
    } else {
			wallet.connect();
    }
	}
	
	const addLiquidity = () => {
		setIsOpen(true);
		setBtnType('add')
	}

	const afterClick = () => {
		setIsOpen(false);
		loadLiquidity()
	}

	const removeLiquidity = () => {
		setIsOpen(true);
		setBtnType('remove')
	}


  
  useEffect(() => {
		//todo 判断网络
    if(wallet.isConnected()){
			// eslint-disable-next-line eqeqeq
			if(wallet.detail.chainId == chainId){
				const result = isApprove();
				setIsApproved(result);
				if(!result){
					setBtnText('APPROVE')
				}
			} else {
				setBtnText(<span className='red-color-font'>Wrong Network</span>)
			}
    } else {
      setBtnText('Collect Wallet')
		}
		return () => {
			
		}
	}, [wallet.detail.account])

	const AddDialog = withModal(AddLiquidity)
	const RemoveDialog = withModal(RemoveLiquidity)
  return (
    <div className="liquidity-btn">
			{
				btnType === 'add' 
				? <AddDialog  modalIsOpen={isOpen} onClose={afterClick} chainId={chainId} address={address} wallet={wallet} baseToken={baseToken} afterAdd={afterClick}/> 
				: <RemoveDialog  modalIsOpen={isOpen} onClose={afterClick} chainId={chainId} address={address} wallet={wallet} baseToken={baseToken} afterRemove={afterClick}/>
			}
      {isApproved &&<div className="add-remove-liquidity">
      <button 
          className="add-liquidity"
          onClick={addLiquidity}>
          ADD LIQUIDITY
      </button>
      <button className="remove-liquidity" onClick={removeLiquidity}>
          REMOVE LIQUIDITY
      </button>
    </div>}
    {!isApproved &&<div className="approve" >
			<Button className='approve-btn' click={click} btnText={btnText}></Button>
    </div>}
  </div>
  )
}

export default inject('wallet')(observer(Liquidity))