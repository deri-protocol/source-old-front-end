import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import DeriNumberFormat from '../../../utils/DeriNumberFormat'
import TipWrapper from '../../TipWrapper/TipWrapper'
import deriLogo from '../img/deri.svg'
import bnbLogo from '../img/bnb.svg'
import { getUserStakingClaimInfo, getUserStakingBnbClaimInfo, claimMyStaking, bg, claimMyStakingBNB,getUserStakingReward } from '../../../lib/web3js/indexV2'
import Button from '../../Button/Button'
function Claim({ wallet, lang }) {
  const [claimRewardDeriValue, setClaimRewardDeriValue] = useState('')
  const [claimRewardBnbValue, setClaimRewardBnbValue] = useState('')
  const [claimRewardTopPointsDeri, setClaimedTopPointsDeri] = useState('')
  const [claimRewardTopPointsBNB, setClaimedTopPointsBNB] = useState('')
  const [claimRewardTopPnlDeri, setClaimedTopPnlDeri] = useState('')
  const [claimRewardTopPnlBNB, setClaimedTopPnlBNB] = useState('')
  const [claimRewardDeri, setClaimRewardDeri] = useState('')
  const [claimRewarDeriSum, setClaimRewarDeriSum] = useState('')
  const [claimedDeri, setClaimedDeri] = useState('')
  const [claimableDeri, setClaimableDeri] = useState('')
  const [lockedDeri, setLockedDeri] = useState('')
  const [claimRewardBNB, setClaimRewardBNB] = useState('')
  const [claimedBNB, setClaimedBNB] = useState('')
  const [claimableBNB, setClaimableBNB] = useState('')
  const [lockedBNB, setLockedBNB] = useState('')


  const getUserReward = async () => {
    let res = await getUserStakingReward(wallet.detail.account, 2)
    if (res) {
      let deriValue = res.rewardDERI 
      let bnb = ((+res.specialRewardsA) + (+res.specialRewardsB)) /2
      setClaimRewardBnbValue(bnb)
      setClaimRewardDeriValue(deriValue)
    }

  }

  const claimDeri = async () => {
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

    let res = await claimMyStaking(wallet.detail.account, 2)
    if (res.success) {
      let claimed = bg(claimedDeri).plus(bg(claimableDeri)).toString()
      setClaimedDeri(claimed)
      setClaimableDeri(0)
    }
  }

  const claimBNB = async () => {
    if (+claimableBNB === 0) {
      return;
    }

    let nowSixEnd = new Date(new Date().toLocaleDateString()).getTime() + 18.5 * 60 * 60 * 1000
    let nowSix = new Date(new Date().toLocaleDateString()).getTime() + 18 * 60 * 60 * 1000
    let now = parseInt(Date.now())
    if (now < nowSixEnd && now > nowSix) {
      alert('Claiming DERI is disabled during first 30 minutes of each epoch')
      return;
    }

    let res = await claimMyStakingBNB(wallet.detail.account, 2)
    if (res.success) {
      let claimed = bg(claimedBNB).plus(bg(claimableBNB)).toString()
      setClaimedBNB(claimed)
      setClaimableBNB(0)
    }
  }
  useEffect(() => {
    if (+claimableDeri === 0) {
      document.getElementsByClassName('claim-button')[0].style.color = '#AAA'
    } else {
      document.getElementsByClassName('claim-button')[0].style.color = '#FFF'
    }
    if (+claimableBNB === 0) {
      document.getElementsByClassName('claim-button')[1].style.color = '#AAA'
    } else {
      document.getElementsByClassName('claim-button')[1].style.color = '#FFF'
    }
  }, [claimableDeri, claimableBNB])
  const getClaimInfo = async () => {
    let res = await getUserStakingClaimInfo(wallet.detail.account, 2)
    if (res) {
      let total = (+res.regular + (+res.toppoint) + (+res.toppnl)).toString()
      setClaimedDeri(res.claimed)
      setClaimableDeri(res.claimable)
      setLockedDeri(res.locked)
      // setClaimRewardDeriValue(deri)
      setClaimedTopPointsDeri(res.toppoint)
      setClaimedTopPnlDeri(res.toppnl)
      setClaimRewardDeri(res.regular)
      setClaimRewarDeriSum(total)
    }
  }

  const getClaimBnbInfo = async () => {
    let res = await getUserStakingBnbClaimInfo(wallet.detail.account, 2)
    if (res) {
      let total = +res.toppoint + (+res.toppnl)
      setClaimedBNB(+res.claimed)
      setClaimableBNB(+res.claimable)
      setLockedBNB(+res.locked)
      setClaimedTopPointsBNB(+res.toppoint)
      setClaimedTopPnlBNB(+res.toppnl)
      setClaimRewardBNB(total)
    }
  }
  useEffect(() => {
    if (wallet.isConnected()) {
      getClaimInfo()
      getClaimBnbInfo()
      getUserReward()
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
            <div className='deri-logo'>
              <img alt='' src={deriLogo} />
            </div>
            <div className='claim-my-reward'>
              <span className='claim-title'>My Rewards</span>
              <div className='claim-reward-num-box'>
                <div className='claim-reward-num'>
                  $ <DeriNumberFormat value={claimRewardDeriValue} decimalScale={2} thousandSeparator={true} />
                  <span className='yue'>＝</span>
                  <TipWrapper>
                    <span className='hover' tip={`The referenced DERI price is $0.447532142857143, which is the 7-day TWAP of Dec 7th. \n 
                    The total DERI rewards consist of three part: \n
                    - General rewards based on the trader’s total points \n
                    - Special rewards for the top 10 traders ranked by points \n
                    - Special rewards for the top 10 traders ranked by PnL
                    `}>
                      <DeriNumberFormat value={claimRewarDeriSum} decimalScale={2} thousandSeparator={true} />
                    </span>
                  </TipWrapper>
                </div>
                <div className='rewards-top-dist'>
                  <div className='rewards-top-dist-one'>
                    General
                  </div>
                  <div className='rewards-top-dist-two'>
                    <DeriNumberFormat value={claimRewardDeri} decimalScale={2} thousandSeparator={true} />
                  </div>
                </div>
                <div className='rewards-top-dist'>
                  <div className='rewards-top-dist-one'>
                    Top 10 Points
                  </div>
                  <div className='rewards-top-dist-two'>
                    <TipWrapper>
                      <span className='hover' tip=' The top 10 traders ranked by points earned will share a pool of $125,000 in DERI tokens.'>
                        <DeriNumberFormat value={claimRewardTopPointsDeri} decimalScale={2} thousandSeparator={true} />
                      </span>
                    </TipWrapper>
                  </div>
                </div>
                <div className='rewards-top-dist'>
                  <div className='rewards-top-dist-one'>
                    Top 10 Pnl
                  </div>
                  <div className='rewards-top-dist-two'>
                    <TipWrapper>
                      <span className='hover' tip='The top 10 traders ranked by PnL will share a pool of $125,000 in DERI tokens.'>
                        <DeriNumberFormat value={claimRewardTopPnlDeri} decimalScale={2} thousandSeparator={true} />
                      </span>
                    </TipWrapper>
                  </div>
                </div>
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
                <Button className='claim-button' btnText='CLAIM DERI' click={claimDeri} lang={lang}></Button>
              </div>
            </div>
          </div>
        </div>
        <div className='claim-info-box bnb-claim-info-box'>
          <div className='claim-left'>
            <div className='deri-logo'>
              <img alt='' src={bnbLogo} />
            </div>
            <div className='claim-my-reward'>
              <span className='claim-title'>My Rewards</span>
              <div className='claim-reward-num-box'>
                <div className='claim-reward-num'>
                  $ <DeriNumberFormat value={claimRewardBnbValue} decimalScale={2} thousandSeparator={true} />
                  <span className='yue'>＝</span>
                  <TipWrapper>
                    <span className='hover' tip={`The BNB rewards consist of two part: \n
                    - Special rewards for the top 10 traders ranked by points \n
                    - Special rewards for the top 10 traders ranked by PnL
                    `}>
                      <DeriNumberFormat value={claimRewardBNB} decimalScale={4} thousandSeparator={true} />
                      
                    </span>
                  </TipWrapper>
                </div>

                <div className='rewards-top-dist bnb-top-points'>
                  <div className='rewards-top-dist-one'>
                    Top 10 Points
                  </div>
                  <div className='rewards-top-dist-two '>
                    <TipWrapper>
                      <span className='hover' tip=' The top 10 traders ranked by points earned will share a pool of $125,000 in BNB tokens.'>
                        <DeriNumberFormat value={claimRewardTopPointsBNB} decimalScale={2} thousandSeparator={true} />
                      </span>
                    </TipWrapper>
                  </div>
                </div>
                <div className='rewards-top-dist'>
                  <div className='rewards-top-dist-one'>
                    Top 10 Pnl
                  </div>
                  <div className='rewards-top-dist-two'>
                    <TipWrapper>
                      <span className='hover' tip='The top 10 traders ranked by PnL will share a pool of $125,000 in BNB tokens.'>
                        <DeriNumberFormat value={claimRewardTopPnlBNB} decimalScale={2} thousandSeparator={true} />
                      </span>
                    </TipWrapper>
                  </div>
                </div>
              </div>

            </div>

          </div>
          <div className='claim-right'>

            <div className='claim-total-deri'>
              <div className='claimed-deri'>
                <div className='claimed-title claim-title'>
                  Claimed BNB
                </div>
                <div className='claimed-num'>
                  <DeriNumberFormat value={claimedBNB} decimalScale={4} thousandSeparator={true} />
                </div>
              </div>
              <div className='unclaimed-deri'>
                <div className='unclaimed-title claim-title'>
                  Locked BNB
                </div>
                <div className='unclaimed-num'>
                  <DeriNumberFormat value={lockedBNB} decimalScale={4} thousandSeparator={true} />
                </div>
              </div>
              <div className='cur-epoch-claimable-deri'>
                <div className='claim-title'>
                  Claimable BNB
                </div>
                <div className='cur-epoch-claimable-deri-num'>
                  <DeriNumberFormat value={claimableBNB} decimalScale={4} thousandSeparator={true} />
                </div>
              </div>
            </div>
            <div className='cur-epoch-deri'>
              <div className='claim-button-box'>
                <Button className='claim-button' btnText='CLAIM BNB' click={claimBNB} lang={lang}></Button>
              </div>
            </div>
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