import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import TipWrapper from '../../TipWrapper/TipWrapper'
import { getUserStakingReward } from '../../../lib/web3js/indexV2'

function Claim({ wallet, lang }) {
  const [claimReward, setClaimReward] = useState('')
  const [claimRewardDeri, setClaimRewardDeri] = useState('')
  const [epochTimeEnd, setEpochTimeEnd] = useState('24h 00m 00s')
  const price = 0.5054307301
  const getReward = async () => {
    let res = await getUserStakingReward(wallet.detail.account)
    let deri = res.rewardDERI / price
    setClaimReward(res.rewardDERI)
    setClaimRewardDeri(deri)

  }
  useEffect(() => {
    getReward()
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
                $ {claimReward ? <DeriNumberFormat value={claimReward} decimalScale={2} thousandSeparator={true} /> : '--'}
                <span className='yue'>＝</span>
                {claimRewardDeri ? <DeriNumberFormat value={claimRewardDeri} decimalScale={2} thousandSeparator={true} /> : '--'} <span className='deri-text'>DERI</span>
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
                  0
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
                  {claimRewardDeri ? <DeriNumberFormat value={claimRewardDeri} decimalScale={2} thousandSeparator={true} /> : '--'}
                </div>
              </div>
              <div className='cur-epoch-claimable-deri'>
                <div className='claim-title'>
                  Claimable DERI
                </div>
                <div className='cur-epoch-claimable-deri-num'>
                  0
                </div>
              </div>
            </div>
            <div className='cur-epoch-deri'>
              <div className='claim-button-box'>
                <button className='claim-button'>CLAIM</button>
              </div>
            </div>

          </div>
          <div className='text-waring'>
            You can claim your rewards from 10:30 AM, November 15th UTC
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