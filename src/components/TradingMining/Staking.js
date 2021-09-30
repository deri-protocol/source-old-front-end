import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button';
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import AddStake from './Dialog/AddStake';
import RemoveStake from './Dialog/RemoveStake';
import withModal from '../hoc/withModal';
import { eqInNumber } from '../../utils/utils';

function Staking({ wallet={}, lang }) {
  const [poolTotalScored, setPoolTotalScored] = useState(10000)
  const [yourScored, setYourScored] = useState(100)
  const [poolTotalStaked, setPoolTotalStaked] = useState(10)
  const [yourStaked, setYourStaked] = useState(10)

  return (
    <div>
      <div className='staking-title'>
        {lang['staking']}
      </div>
      <div className='staking-provide'>
        {lang['provide-pledged']}
      </div>
      <div className='staking-info'>
        <div className='staking-scored'>
          <div className='staking-total'>
            <div className='staking-info-title'>
              {lang['pool-total-scored']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={poolTotalScored} decimalScale={0} />
            </div>
          </div>
          <div className='staking-your'>
            <div className='staking-info-title'>
              {lang['your-scored']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={yourScored} decimalScale={0} />
            </div>
          </div>
        </div>
        <div className='staking-staked'>
          <div className='staking-total'>
            <div className='staking-info-title'>
              {lang['pool-total-staked']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={poolTotalStaked} decimalScale={0} />
            </div>
          </div>
          <div className='staking-your'>
            <div className='staking-info-title'>
              {lang['your-staked']}
            </div>
            <div className='staking-info-num'>
              <DeriNumberFormat thousandSeparator={true} allowZero={true} value={yourStaked} decimalScale={0} />
            </div>
          </div>
        </div>
      </div>
      <div className='staking-button'>
        <div className='staking-button-title'>
          <div>
            {lang['take-introduction-or-calculation-method']}
            <br></br>
            adasd
          </div>
        </div>
        <div className='staking-add-remove'>
            <Operator wallet={wallet} lang={lang} />
        </div>
      </div>
    </div>
  )
}

const AddDialog = withModal(AddStake)
const RemoveDialog = withModal(RemoveStake)

let Operator = ({wallet,lang})=>{
  const [buttonElment, setButtonElment] = useState(null);
  const [isApproved,setIsApproved] = useState(false)
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const addStake = async ()=>{

  }

  const removeStake = async ()=>{
    
  }

  const approve = async ()=>{

  }
  const connect =  async () => {
		try {
			const result = await wallet.connect();
			return result ? true : false
		} catch (e){
			return false
		}
	}
  useEffect(()=>{
    if(wallet.isConnected() && eqInNumber(wallet.detail.chainId,56) && isApproved){
      setButtonElment((<div className="add-remove-liquidity">
			<button 
					className="btn"
					onClick={addStake}>
					{lang['add-stake']}
			</button>
			<button className="btn" onClick={removeStake}>
					{lang['remove-stake']}
			</button>
		</div>))
    }else {
			let el = null
			if(!wallet.isConnected()){
				el = <div className='approve'><Button className='btn' click={connect} btnText={lang['connect-wallet']} lang={lang}></Button></div>
			} else if(!eqInNumber(wallet.detail.chainId,56)) {
				wallet.switchNetwork({id: 56})
				el = <div className="approve" ><Button className='btn wrong-network' btnText={lang['wrong-network']}  lang={lang} click={() => wallet.switchNetwork({id : 56})} ></Button></div>				
			} else if(!isApproved) {
				el = <div className='approve'><Button className='btn' click={approve} btnText={lang['approve']} lang={lang}></Button></div>
			} 
			setButtonElment(el)
		}

  },[wallet,wallet.detail.account,isApproved])
  
  return (
    <div>
      {buttonElment}
    </div>
  )
}
Operator = inject('wallet')(observer(Operator))
export default Staking;

