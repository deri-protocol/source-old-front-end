/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button';
import one from './img/one.svg'
import two from './img/two.svg'
import three from './img/three.svg'
import add from './img/add.svg'
import bnbLogo from './img/bnb.svg'
import deriLogo from './img/deri.svg'
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import { formatAddress } from '../../utils/utils';
import { getStakingTop10Users, getUserStakingInfo, getUserStakingReward, getUserStakingContribution } from '../../lib/web3js/indexV2'
import { set } from 'mobx';

function Trading({ wallet, lang }) {
  const [yourBNB, setYourBNB] = useState('')
  const [yourDERI, setYourDERI] = useState('')
  const [yourScored, setYourScored] = useState('')
  const [yourFee, setYourFee] = useState('')
  const [yourCoeff, setYourCoeff] = useState('')
  const [userContrib, setUserContrib] = useState('')
  const [totalContrib, setTotalContrib] = useState('')
  const [list, setList] = useState([])
  const numToEn = (num) => {
    let en;
    switch (num) {
      case 1:
        en = 'one'
        break;
      case 2:
        en = 'two'
        break;
      case 3:
        en = 'three'
        break;
      case 4:
        en = 'four'
        break;
      case 5:
        en = 'five'
        break;
      case 6:
        en = 'six'
        break;
      case 7:
        en = 'seven'
        break;
      case 8:
        en = 'eight'
        break;
      case 9:
        en = 'nine'
        break;
      case 10:
        en = 'ten'
        break;
      default:
        break;
    }
    return en
  }

  const getUserStaking = async () => {
    let res = await getUserStakingInfo(wallet.detail.account)
    setYourScored(res.score)
    setYourFee(res.feePaid)
    setYourCoeff(res.coef)
  }

  const getUserContribution = async () => {
    let res = await getUserStakingContribution(wallet.detail.account)
    setUserContrib(res.userContrib)
    setTotalContrib(res.totalContrib)
  }

  const getUserReward = async () => {
    let res = await getUserStakingReward(wallet.detail.account)
    setYourBNB(res.rewardBNB)
    setYourDERI(res.rewardDERI)
  }

  const getList = async () => {
    let res = await getStakingTop10Users()
    if (res) {
      res = res.map((item, index) => {
        let obj = {}
        obj.no = item.no
        item.userAddr = formatAddress(item.userAddr)
        obj.userAddr = item.userAddr
        obj.feesPaid = item.feePaid
        obj.avgCoeff = item.evgCoeff
        obj.score = item.score
        obj.rewardBNB = item.rewardBNB
        obj.progress = `${numToEn(item.no)}-progress progress-box`
        obj.progressSlider = (item.score / res[0].score) * 100
        return obj
      })
      setList(res)
    }
  }

  useEffect(() => {
    let interval = null;
    interval = window.setInterval(() => {
      getList()
    },60000)
    getList()
    return () => {
      interval && clearInterval(interval);
		};
  }, [])

  useEffect(() => {
    let interval = null;
    interval = window.setInterval(() => {
      if (wallet.isConnected()) {
        getUserReward()
        getUserStaking()
        getUserContribution()
      }
    },60000)
    if (wallet.isConnected()) {
      getUserReward()
      getUserStaking()
      getUserContribution()
    }
    return () => {
      interval && clearInterval(interval);
		};
  }, [wallet.detail.account])

  // useEffect(() => {

  //   if (list.length >= 10) {
  //     document.getElementsByClassName('ten-progress')[0].style.width = `${list[9].progressSlider}%`
  //     document.getElementsByClassName('nine-progress')[0].style.width = `${list[8].progressSlider}%`
  //     document.getElementsByClassName('eight-progress')[0].style.width = `${list[7].progressSlider}%`
  //     document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
  //     document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
  //     document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 9) {
  //     document.getElementsByClassName('nine-progress')[0].style.width = `${list[8].progressSlider}%`
  //     document.getElementsByClassName('eight-progress')[0].style.width = `${list[7].progressSlider}%`
  //     document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
  //     document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
  //     document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 8) {
  //     document.getElementsByClassName('eight-progress')[0].style.width = `${list[7].progressSlider}%`
  //     document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
  //     document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
  //     document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 7) {
  //     document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
  //     document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
  //     document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 6) {
  //     document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
  //     document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 5) {
  //     document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 4) {
  //     document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 3) {
  //     document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   } else if (list.length >= 2) {
  //     document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
  //   }
  // }, [list])
  return (
    <div className='trading-top'>

      <div className='desktop-list'>
        <div className='trading-title'>
          {lang['earn-deri-for-trading-perpetual']}
        </div>
        <div className='trading-top-list'>
          <div className='list'>
            <div className='list-title'>
              {lang['top-ten-users']}
            </div>
            <div className='list-box'>
              <div className='list-box-title'>
                <span className='no'>{lang['no']}</span>
                <span className='address'>{lang['user-addr']}</span>
                <span className='feespaid'>{lang['fees-paid']}</span>
                <span className='avgcoeff'>{lang['avg-coeff']}</span>
                <span className='score'>{lang['score']}</span>
                <span className='rewardBNB'>{lang['reward-BNB']}</span>
              </div>
              <div className='list-info'>
                {list.map((item, index) => {
                  return (
                    <div className='list-info-box' key={index}>
                      <div className='no'>
                        {item.no === 1 && <img src={one}></img>}
                        {item.no === 2 && <img src={two}></img>}
                        {item.no === 3 && <img src={three}></img>}
                        {item.no !== 1 && item.no !== 2 && item.no !== 3 && item.no}
                      </div>
                      <div className='address'>
                        {item.userAddr}
                      </div>
                      <div className='feespaid'>
                        $ <DeriNumberFormat value={item.feesPaid} decimalScale={2} thousandSeparator={true} />
                      </div>
                      <div className='avgcoeff'>
                        <DeriNumberFormat value={item.avgCoeff} decimalScale={2} thousandSeparator={true} />
                      </div>
                      <div className='score'>
                        <DeriNumberFormat value={item.score} decimalScale={2} thousandSeparator={true} />
                      </div>
                      <div className={(item.no === 1 || item.no === 2 || item.no === 3) ? 'rewardBNB top-three' : "rewardBNB"}>
                        $ <DeriNumberFormat value={item.rewardBNB} thousandSeparator={true} />
                      </div>
                      <div className='progress'>
                        <div className={item.progress}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className='your-rewards'>
            <div className='your-estimated-rewards'>
              <div className='your-rewards-title'>
                {lang['your-rstimated-rewards']}
              </div>
              <div className='your-rewards-info'>
                <div className='your-bnb'>
                  <img src={bnbLogo}></img>
                  <span className='span'>$ {yourBNB ? <DeriNumberFormat decimalScale={2} value={yourBNB} thousandSeparator={true} /> : "--"}</span>
                </div>
                <div className='your-deri'>
                  <img src={deriLogo}></img>
                  <span className='span'>$ {yourDERI ? <DeriNumberFormat decimalScale={2} value={yourDERI} thousandSeparator={true} /> : "--"} </span>
                </div>
              </div>
            </div>
            <div className='your-score-fee-coeff'>
              <div className='your-score'>
                <div className='your-score-title'>
                  {lang['your-scored']}
                </div>
                <div className='your-score-num'>
                  {yourScored ? <DeriNumberFormat value={yourScored} decimalScale={2} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-fee'>
                <div className='your-fee-title'>
                  {lang['your-fees-paid']}
                </div>
                <div className='your-fee-num'>
                  $  {yourFee ? <DeriNumberFormat value={yourFee} decimalScale={2} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-coeff'>
                <div className='your-coeff-title'>
                  {lang['your-coeff']}
                </div>
                <div className='your-coeff-num'>
                  {yourCoeff ? <DeriNumberFormat value={yourCoeff} decimalScale={4} thousandSeparator={true} /> : "--"}
                </div>
              </div>
            </div>
            {/* <div className='deri-total'>
              <div className='deri-title'>
                {lang['transaction-sharing-pool']}
              </div>
              <div className='deri-num'>
                <img src={deriLogo}></img>
                <span>$ 1,000,000</span>
              </div>
            </div> */}
            <div className='raise-score'>
              <div className='raise-score-title'>
                {lang['raise-score']}
              </div>
              <div className='button-link'>
                <a href='https://app.deri.finance/?locale=en#/mining/v2_lite/56/perpetual/AXSUSDT,MBOXUSDT,iBSCDEFI,iGAME,ALICEUSDT,AGLDUSDT/DERI/0x1a9b1B83C4592B9F315E933dF042F53D3e7E4819?symbolId=0'>
                  {lang['staking']}
                </a>
                <a href='https://app.deri.finance/#/futures/pro'>
                  {lang['futures']}
                </a>
                <a href='https://app.deri.finance/#/options/pro'>
                  {lang['options']}
                </a>
              </div>
              <div className='des'>
                {lang['the-trading-rewards']}<br></br>
                {lang['the-individual']}
              </div>
            </div>
            <div className='total-your-contrib'>
              <div className='total-contrib'>
                <div className='total-your-contrib-title'>

                </div>
                <div className='total-your-contrib-num'></div>
              </div>
              <div className='your-contrib'>
                <div className='total-contrib-value'>
                  <div className='total-your-contrib-title'>
                    <span>{lang['total-contrib-value']}</span>
                  </div>
                  <div className='total-your-contrib-num'>
                    <span>
                      {totalContrib ? <DeriNumberFormat value={totalContrib} decimalScale={2} thousandSeparator={true} /> : '--'}
                    </span>
                  </div>
                </div>
                <div className='your-contrib-value'>
                  <div className='total-your-contrib-title'>
                    <span>{lang['your-contrib-value']}</span>
                  </div>
                  <div className='total-your-contrib-num'>
                    <span>
                      {userContrib ? <DeriNumberFormat value={userContrib} decimalScale={2} thousandSeparator={true} /> : '--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mobile-list'>
        <div className='trading-top-list'>
          <div className='your-rewards'>
            {/* <div className='your-estimated-rewards'>
              <div className='your-rewards-title'>
                {lang['your-rstimated-rewards']}
              </div>
              <div className='your-rewards-info'>
                <div className='your-bnb'>
                  <img src={bnbLogo}></img>
                  <span className='span'> $ {yourBNB ? <DeriNumberFormat value={yourBNB} thousandSeparator={true} /> : "--"}</span>
                </div>
                <div className='your-deri'>
                  <img src={deriLogo}></img>
                  <span className='span'> $ {yourDERI ? <DeriNumberFormat value={yourDERI} thousandSeparator={true} /> : "--"} </span>
                </div>
              </div>
            </div>
            <div className='your-score-fee-coeff'>
              <div className='your-score'>
                <div className='your-score-title'>
                  {lang['your-scored']}
                </div>
                <div className='your-score-num'>
                  {yourScored ? <DeriNumberFormat value={yourScored} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-fee'>
                <div className='your-fee-title'>
                  {lang['your-fees-paid']}
                </div>
                <div className='your-fee-num'>
                  $  {yourFee ? <DeriNumberFormat value={yourFee} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-coeff'>
                <div className='your-coeff-title'>
                  {lang['your-coeff']}
                </div>
                <div className='your-coeff-num'>
                  {yourCoeff ? <DeriNumberFormat value={yourCoeff} thousandSeparator={true} /> : "--"}
                </div>
              </div>

            </div> */}
            <div className='raise-score'>
              <div className='raise-score-title'>
                {lang['raise-score']}
              </div>
              <div className='button-link'>
                <a href='https://app.deri.finance/?locale=en#/mining/v2_lite/56/perpetual/AXSUSDT,MBOXUSDT,iBSCDEFI,iGAME,ALICEUSDT,AGLDUSDT/DERI/0x1a9b1B83C4592B9F315E933dF042F53D3e7E4819?symbolId=0'>
                  {lang['staking']}
                </a>
                <a href='https://app.deri.finance/#/futures/pro'>
                  {lang['futures']}
                </a>
                <a href='https://app.deri.finance/#/options/pro'>
                  {lang['options']}
                </a>
              </div>
              <div className='des'>
                {lang['the-trading-rewards']}<br></br>
                {lang['the-individual']}
              </div>
            </div>

            <div className='totalpoints'>
              <div className='total-points-title'>
                {lang['the-trading-mining-event-has-four-quarters']}
              </div>
              <div className='dial'>
                <div className='total-points'>
                  <span>{lang['totalpoints']}</span>
                  <span> 110,000 </span>
                </div>
                <div className='dial-box'>
                  <div className='dial-box-info'>
                    <div className='dial-box-info-title'>
                      {lang['the-first']}
                    </div>
                    <div className='dial-box-info-time'>
                      {lang['the-first-time']}
                    </div>
                    <div className='dial-box-info-points'>
                      {lang['the-first-points']}
                    </div>
                  </div>
                  <div className='add'>
                    <img src={add}></img>
                  </div>
                  <div className='dial-box-info'>
                    <div className='dial-box-info-title'>
                      {lang['the-second']}
                    </div>
                    <div className='dial-box-info-time'>
                      {lang['the-second-time']}
                    </div>
                    <div className='dial-box-info-points'>
                      {lang['the-second-points']}
                    </div>
                  </div>
                  <div className='add'>
                    <img src={add}></img>
                  </div>
                  <div className='dial-box-info'>
                    <div className='dial-box-info-title'>
                      {lang['the-third']}
                    </div>
                    <div className='dial-box-info-time'>
                      {lang['the-third-time']}
                    </div>
                    <div className='dial-box-info-points'>
                      {lang['the-third-points']}
                    </div>
                  </div>
                  <div className='add'>
                    <img src={add}></img>
                  </div>
                  <div className='dial-box-info'>
                    <div className='dial-box-info-title fourth'>
                      {lang['the-fourth']}
                    </div>
                    <div className='dial-box-info-time'>
                      {lang['the-fourth-time']}
                    </div>
                    <div className='dial-box-info-points'>
                      {lang['the-fourth-points']}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='list'>
              <div className='list-title'>
                {lang['top-ten-users']}
              </div>
              <div className='list-box'>
                <div className='list-box-title'>
                  <span className='no'>{lang['no']}</span>
                  <span className='address'>{lang['user-addr']}</span>
                  <span className='score'>{lang['score']}</span>
                  <span className='rewardBNB'>{lang['reward-BNB']}</span>
                </div>
                <div className='list-info'>
                  {list.map((item, index) => {
                    return (
                      <div className='list-info-box' key={index}>
                        <div className='no'>
                          {item.no === 1 && <img src={one}></img>}
                          {item.no === 2 && <img src={two}></img>}
                          {item.no === 3 && <img src={three}></img>}
                          {item.no !== 1 && item.no !== 2 && item.no !== 3 && item.no}
                        </div>
                        <div className='address'>
                          {item.userAddr}
                        </div>
                        <div className='score'>
                          {item.score}
                        </div>
                        <div className='rewardBNB top-three'>
                          $ <DeriNumberFormat value={item.rewardBNB} thousandSeparator={true} />
                        </div>

                      </div>
                    )
                  })}
                </div>
              </div>
            </div> */}
          </div>
        </div>

      </div>
      <div className='activity-rules'>
        <a href=''>{lang['detailed-rules']}</a>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Trading))

