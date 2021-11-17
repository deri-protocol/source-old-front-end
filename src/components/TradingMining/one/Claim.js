import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import TipWrapper from '../../TipWrapper/TipWrapper'
import { getUserStakingReward, getUserStakingClaimInfo, claimMyStaking, bg } from '../../../lib/web3js/indexV2'
import Button from '../../Button/Button'
function Claim({ wallet, lang }) {
  const [claimReward, setClaimReward] = useState('')
  const [claimRewardDeri, setClaimRewardDeri] = useState('')
  const [claimedDeri, setClaimedDeri] = useState('')
  const [claimableDeri, setClaimableDeri] = useState('')
  const [lockedDeri, setLockedDeri] = useState('')
  const price = 0.5054307301
  const getReward = async () => {
    let res = await getUserStakingReward(wallet.detail.account, 1)
    if (res) {
      let deri = (res.rewardDERI / price).toString()
      setClaimReward(res.rewardDERI)
      setClaimRewardDeri(deri)
    }
  }
  const claim = async () => {
    if (+claimableDeri === 0) {
      return;
    }

    let nowSixEnd = new Date(new Date().toLocaleDateString()).getTime() + 18.5 * 60 * 60 * 1000
    let nowSix = new Date(new Date().toLocaleDateString()).getTime() + 18 * 60 * 60 * 1000
    let now = parseInt(Date.now())
    if (now < nowSixEnd && now > nowSix) {
      alert('Claiming DERI is disabled during first 30 minutes of each epoch')
      return;
    }

    let res = await claimMyStaking(wallet.detail.account, 1)
    if (res.success) {
      let claimed = bg(claimedDeri).plus(bg(claimableDeri)).toString()
      setClaimedDeri(claimed)
      setClaimableDeri(0)
    }
  }
  useEffect(() => {
    if (+claimableDeri === 0) {
      document.getElementsByClassName('claim-button')[0].style.color = '#AAA'
    } else {
      document.getElementsByClassName('claim-button')[0].style.color = '#FFF'
    }
  }, [claimableDeri])
  const getClaimInfo = async () => {
    let res = await getUserStakingClaimInfo(wallet.detail.account, 1)
    if (res) {
      setClaimedDeri(res.claimed)
      setClaimableDeri(res.claimable)
      setLockedDeri(res.locked)
    }
  }
  useEffect(() => {
    if (wallet.isConnected()) {
      getReward()
      getClaimInfo()
    }
  }, [wallet.detail.account])
  return (
    <div className='trading-mining-claim'>
      <div className='reward-deri-claim'>
        <div className='reward-claim-title'>
          Reward
        </div>
        <div className='claim-info-box'>
          <div className='claim-left'>
            <div className='claim-my-reward'>
              <span className='claim-title'>My Rewards</span>
              <div className='claim-reward-num'>
                $ <DeriNumberFormat value={claimReward} decimalScale={2} thousandSeparator={true} />
                <span className='yue'>＝</span>
                <DeriNumberFormat value={claimRewardDeri} decimalScale={2} thousandSeparator={true} />  <span className='deri-text'>DERI</span>
              </div>
            </div>

          </div>
          <div className='claim-right'>
            <div className='claim-total-deri'>
              <div className='claimed-deri'>
                <div className='claimed-title claim-title'>
                  Claimed DERI
                </div>
                <div className='claimed-num'>
                  <DeriNumberFormat value={claimedDeri} decimalScale={2} thousandSeparator={true} />
                </div>
              </div>
              <div className='unclaimed-deri'>
                <div className='unclaimed-title claim-title'>
                  <TipWrapper block={false}>
                    <span className='hover' tip='Will be released on a daily basis at each 10:30 UTC, the maximum amount for each release is 10,000 DERI'>
                      Locked DERI
                  </span>
                  </TipWrapper>
                </div>
                <div className='unclaimed-num'>
                  <DeriNumberFormat value={lockedDeri} decimalScale={2} thousandSeparator={true} />
                </div>
              </div>
              <div className='cur-epoch-claimable-deri'>
                <div className='claim-title'>
                  Claimable DERI
                </div>
                <div className='cur-epoch-claimable-deri-num'>
                  <DeriNumberFormat value={claimableDeri} decimalScale={2} thousandSeparator={true} />
                </div>
              </div>
            </div>
            <div className='cur-epoch-deri'>
              <div className='claim-button-box'>
                <Button className='claim-button' btnText='CLAIM' click={claim} lang={lang}></Button>
              </div>
            </div>
          </div>
          <div className='text-waring'>
          the referenced Deri Price is $0.5054307301 as snapshoted on coinmarketcap.com at 10:00 UTC Nov.10th
          </div>
        </div>
      </div>

      <div className='finshed-epoch-one'>
        <div className='finshed-round'></div>
        <div className='finshed-x'>
          <div className='text-finshed'>Finished</div>
        </div>
        <div className='finshed-round'></div>
      </div>
    </div>
  )
}
export default inject('wallet')(observer(Claim))  