/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import { isBrowser } from 'react-device-detect'
import axios from 'axios'
import Button from '../Button/Button';
import one from './img/one.svg'
import two from './img/two.svg'
import three from './img/three.svg'
import add from './img/add.svg'
import twitterImg from './img/twitter.svg'
import twitterBgImg from './img/share.png'
import bnbLogo from './img/bnb.svg'
import deriLogo from './img/deri.svg'
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import { formatAddress } from '../../utils/utils';
import TipWrapper from '../TipWrapper/TipWrapper'
import html2canvas from 'html2canvas'
import { getStakingTop10Users, getUserStakingInfo, getUserStakingReward, getUserStakingContribution } from '../../lib/web3js/indexV2'

function Trading({ wallet, lang, loading }) {
  const [yourBNB, setYourBNB] = useState('')
  const [yourDERI, setYourDERI] = useState('')
  const [yourScored, setYourScored] = useState('')
  const [yourFee, setYourFee] = useState('')
  const [yourCoeff, setYourCoeff] = useState('')
  const [userContrib, setUserContrib] = useState('')
  const [totalContrib, setTotalContrib] = useState('')
  const [stageList, setStageList] = useState({})
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
    if (res) {
      setStageList(res)
    }
  }

  const getUserReward = async () => {
    let res = await getUserStakingReward(wallet.detail.account)
    setYourBNB(res.rewardBNB)
    setYourDERI(res.rewardDERI)
  }

  const getList = async () => {
    let res = await getStakingTop10Users()
    loading.loaded()
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



  // const twit = (e) => {
  //   e.prev
  // }

  useEffect(() => {
    loading.loading();
    let interval = null;
    interval = window.setInterval(() => {
      getList()
    }, 30000)
    getList()
    return () => {
      interval && clearInterval(interval);
    };
  }, [])

  const dataURLtoBlob = (dataurl, filename = 'file') => {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
      type: mime
    })
  }

  const twitterShare = async () => {
    if (yourDERI) {
      let twitter = document.getElementsByClassName('twitter-box')[0]
      html2canvas(twitter, {
        allowTaint: false,
        useCORS: true,
      }).then(canvas => {
        let url = canvas.toDataURL("image/png")
        let img = dataURLtoBlob(url)
        let fd = new FormData();
        fd.append('image', img)
        let AxiosUrl = 'https://share.deri.finance/add_image?type=image'
        axios.post(AxiosUrl, fd).then(res => {
          let shareImg = res.data.data.url
          if (isBrowser) {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://share.deri.finance/?title=Trade%20to%20Earn&description=Total%20Rewards%20$1,000,000%20in%20DERI&image=${shareImg}&target=${encodeURIComponent('https://app.deri.finance/#/trade-to-earn')}`)}`)
          } else {
            window.location.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://share.deri.finance/?title=Trade%20to%20Earn&description=Total%20Rewards%20$1,000,000%20in%20DERI&image=${shareImg}&target=${encodeURIComponent('https://app.deri.finance/#/trade-to-earn')}`)}`
          }
        })

      })
    }
  }

  useEffect(() => {
    let interval = null;
    interval = window.setInterval(() => {
      if (wallet.isConnected()) {
        getUserReward()
        getUserStaking()
        getUserContribution()
      }
    }, 30000)
    if (wallet.isConnected()) {
      getUserReward()
      getUserStaking()
      getUserContribution()
    }
    return () => {
      interval && clearInterval(interval);
    };
  }, [wallet.detail.account])

  useEffect(() => {

    if (list.length >= 10) {
      document.getElementsByClassName('ten-progress')[0].style.width = `${list[9].progressSlider}%`
      document.getElementsByClassName('nine-progress')[0].style.width = `${list[8].progressSlider}%`
      document.getElementsByClassName('eight-progress')[0].style.width = `${list[7].progressSlider}%`
      document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
      document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
      document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 9) {
      document.getElementsByClassName('nine-progress')[0].style.width = `${list[8].progressSlider}%`
      document.getElementsByClassName('eight-progress')[0].style.width = `${list[7].progressSlider}%`
      document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
      document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
      document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 8) {
      document.getElementsByClassName('eight-progress')[0].style.width = `${list[7].progressSlider}%`
      document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
      document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
      document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 7) {
      document.getElementsByClassName('seven-progress')[0].style.width = `${list[6].progressSlider}%`
      document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
      document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 6) {
      document.getElementsByClassName('six-progress')[0].style.width = `${list[5].progressSlider}%`
      document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 5) {
      document.getElementsByClassName('five-progress')[0].style.width = `${list[4].progressSlider}%`
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 4) {
      document.getElementsByClassName('four-progress')[0].style.width = `${list[3].progressSlider}%`
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 3) {
      document.getElementsByClassName('three-progress')[0].style.width = `${list[2].progressSlider}%`
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    } else if (list.length >= 2) {
      document.getElementsByClassName('two-progress')[0].style.width = `${list[1].progressSlider}%`
    }
  }, [list])
  return (
    <div className='trading-top'>
      <div className='twitter-box'>
        <img src={twitterBgImg}></img>
        <div className='twitter-box-rewards'>
          $ {yourDERI ? <DeriNumberFormat decimalScale={2} value={yourDERI} thousandSeparator={true} /> : "0"}
        </div>
      </div>
      <div className='desktop-list'>
        {/* <div className='trading-title'>
          {lang['earn-deri-for-trading-perpetual']}
        </div> */}
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
                <TipWrapper block={false} >
                  <span className='score' tip=' estimated points based on the current weights'>
                    <span className='score-hover'>{lang['score']}</span>
                  </span>
                </TipWrapper>
                {/* <span className='rewardBNB'>{lang['reward-BNB']}</span> */}
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
                        $ <DeriNumberFormat value={item.feesPaid} decimalScale={4} thousandSeparator={true} />
                      </div>
                      <div className='avgcoeff'>
                        <DeriNumberFormat value={item.avgCoeff} decimalScale={4} thousandSeparator={true} />
                      </div>
                      <div className='score'>
                        <DeriNumberFormat value={item.score} decimalScale={2} thousandSeparator={true} />
                      </div>
                      {/* <div className={(item.no === 1 || item.no === 2 || item.no === 3) ? 'rewardBNB top-three' : "rewardBNB"}>
                        $ <DeriNumberFormat value={item.rewardBNB} thousandSeparator={true} />
                      </div> */}
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
                <span className='your-rewards-title-text'>{lang['your-rstimated-rewards']}</span>
                <div className='share-twitter' onClick={twitterShare}>
                  <span><img src={twitterImg} /></span>
                  <button>SHARE</button>
                </div>
                {/* <a href="https://twitter.com/intent/tweet" rel="noreferrer"  class="twitter-share-button" target='_blank'
                 data-show-count="false">
                  Tweet
                </a> */}
              </div>
              <div className='your-rewards-info'>
                {/* <div className='your-bnb'>
                  <img src={bnbLogo}></img>
                  <span className='span'>$ {yourBNB ? <DeriNumberFormat decimalScale={2} value={yourBNB} thousandSeparator={true} /> : "--"}</span>
                </div> */}
                <div className='your-deri'>
                  <img src={deriLogo}></img>
                  <span className='span'>$ {yourDERI ? <DeriNumberFormat decimalScale={2} value={yourDERI} thousandSeparator={true} /> : "--"} </span>
                </div>
              </div>
            </div>
            <div className='your-score-fee-coeff'>
              <div className='your-score'>
                <div className='your-score-title'>
                  <TipWrapper block={false} >
                    <span tip='estimated points based on your current weights'>{lang['your-scored']}</span>
                  </TipWrapper>
                </div>
                <div className='your-score-num'>
                  {yourScored ? <DeriNumberFormat value={yourScored} decimalScale={2} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-fee'>
                <div className='your-fee-title'>
                  <TipWrapper block={false} >
                    <span tip='Fees paid by trading Perpetual futures in Main & Inno Zone or Everlasting Options on BSC'>
                      {lang['your-fees-paid']}
                    </span>
                  </TipWrapper>
                </div>
                <div className='your-fee-num'>
                  $  {yourFee ? <DeriNumberFormat value={yourFee} decimalScale={4} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-coeff'>
                <div className='your-coeff-title'>
                  <TipWrapper block={false} >
                    <span tip={lang['boosting-factor']}>
                      {lang['your-coeff']}
                    </span>
                  </TipWrapper>
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
                <TipWrapper block={false} tip={lang['staking-hover']}>
                  <a tip={lang['staking-hover']} href='https://app.deri.finance/?locale=en#/mining/v2_lite/56/perpetual/AXSUSDT,MBOXUSDT,iBSCDEFI,iGAME,ALICEUSDT,AGLDUSDT/DERI/0x1a9b1B83C4592B9F315E933dF042F53D3e7E4819?symbolId=0'>
                    {lang['staking']}
                  </a>
                </TipWrapper>
                <TipWrapper block={false} tip={lang['futures-hover']} >
                  <a tip={lang['futures-hover']} href='https://app.deri.finance/#/futures/pro'>
                    {lang['futures']}
                  </a>
                </TipWrapper>
                <TipWrapper block={false} tip={lang['options-hover']}>
                  <a tip={lang['options-hover']} href='https://app.deri.finance/#/options/pro'>
                    {lang['options']}
                  </a>
                </TipWrapper>
              </div>
              <div className='des'>
                Mining rewards are calculated based on traders' total points of the 4 quarters. In each quarter, all the participating traders share&nbsp;<TipWrapper block={false} tip={lang['the-quater-points']}>
                  <span className='des-tip' tip={lang['the-quarter-points']}>
                    this quarter's points
                  </span>
                </TipWrapper>
                &nbsp; per their transaction fees multiplied by the&nbsp;
                <TipWrapper block={false} tip={lang['boosting-factor']}>
                  <span className='des-tip' tip={lang['boosting-factor']}>
                    boosting factors
                  </span>
                </TipWrapper>
               .
                {/* <br></br> */}
                {/* {lang['the-individual']} */}
              </div>
            </div>
            <div className='total-your-contrib'>
              <div className='your-contrib'>
                <div className='stage'>
                  <div className='stage-title'></div>
                  <div className='stage-title'>1st</div>
                  <div className='stage-title'>2nd</div>
                  <div className='stage-title'>3rd</div>
                  <div className='stage-title'>4th</div>
                </div>
                <div className='total-score-box'>
                  <div className='total-score'>Total Score</div>
                  <div className='total-score'>
                    {stageList.Q1Contrib ? <DeriNumberFormat value={stageList.Q1Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='total-score'>
                    {stageList.Q2Contrib ? <DeriNumberFormat value={stageList.Q2Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='total-score'>
                    {stageList.Q3Contrib && stageList.Q3Contrib !== '0' ? <DeriNumberFormat value={stageList.Q3Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='total-score'>
                    {stageList.Q4Contrib && stageList.Q3Contrib !== '0' ? <DeriNumberFormat value={stageList.Q4Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                </div>
                <div className='your-score-box'>
                  <div className='your-score'>Your Score</div>
                  <div className='your-score'>
                    {stageList.userQ1Contrib ? <DeriNumberFormat value={stageList.userQ1Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='your-score'>
                    {stageList.userQ2Contrib ? <DeriNumberFormat value={stageList.userQ2Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='your-score'>
                    {stageList.userQ3Contrib && stageList.Q3Contrib !== '0' ? <DeriNumberFormat value={stageList.userQ3Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='your-score'>
                    {stageList.userQ4Contrib && stageList.Q4Contrib !== '0' ? <DeriNumberFormat value={stageList.userQ4Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                </div>
                <div className='your-point-box'>
                  <div className='your-point'>Your Points</div>
                  <div className='your-point'>
                    {stageList.userQ1Point ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? ` = (${stageList.userQ1Contrib} / ${stageList.Q1Contrib}) * 10,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ1Point} decimalScale={2} thousandSeparator={true} />
                        </span>

                      </TipWrapper>
                      : "--"}
                  </div>
                  <div className='your-point'>
                    {stageList.userQ2Point ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? ` = (${stageList.userQ2Contrib} / ${stageList.Q2Contrib}) * 20,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ2Point} decimalScale={2} thousandSeparator={true} />
                        </span>

                      </TipWrapper>
                      : "--"}
                  </div>
                  <div className='your-point'>
                    {stageList.userQ3Point && stageList.Q3Contrib !== '0' ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? ` = (${stageList.userQ3Contrib} / ${stageList.Q3Contrib}) * 30,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ3Point} decimalScale={2} thousandSeparator={true} />
                        </span>
                      </TipWrapper>
                      : "--"}
                  </div>
                  <div className='your-point'>
                    {stageList.userQ4Point && stageList.Q4Contrib !== '0' ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? ` = (${stageList.userQ4Contrib} / ${stageList.Q4Contrib}) * 50,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ4Point} decimalScale={2} thousandSeparator={true} />

                        </span>

                      </TipWrapper>
                      : "--"}
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
            <div className='your-estimated-rewards'>
              <div className='your-rewards-title'>
                {lang['your-rstimated-rewards']}
                <div className='share-twitter' onClick={twitterShare}>
                  <span><img src={twitterImg} /></span>
                  <button>SHARE</button>
                </div>
              </div>
              <div className='your-rewards-info'>
                {/* <div className='your-bnb'>
                  <img src={bnbLogo}></img>
                  <span className='span'> $ {yourBNB ? <DeriNumberFormat value={yourBNB} thousandSeparator={true} /> : "--"}</span>
                </div> */}
                <div className='your-deri'>
                  <img src={deriLogo}></img>
                  <span className='span'> $ {yourDERI ? <DeriNumberFormat value={yourDERI} thousandSeparator={true} decimalScale={2} /> : "--"} </span>
                </div>
              </div>
            </div>
            <div className='your-score-fee-coeff'>
              <div className='your-score'>
                <div className='your-score-title'>
                  <TipWrapper block={false} >
                    <span tip='estimated points based on your current weights'>{lang['your-scored']}</span>
                  </TipWrapper>
                </div>
                <div className='your-score-num'>
                  {yourScored ? <DeriNumberFormat decimalScale={2} value={yourScored} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-fee'>
                <div className='your-fee-title'>
                  <TipWrapper block={false} >
                    <span tip='Fees paid by trading Perpetual futures in Main & Inno Zone or Everlasting Options on BSC'>
                      {lang['your-fees-paid']}
                    </span>
                  </TipWrapper>
                </div>
                <div className='your-fee-num'>
                  $  {yourFee ? <DeriNumberFormat value={yourFee} decimalScale={4} thousandSeparator={true} /> : "--"}
                </div>
              </div>
              <div className='your-coeff'>
                <div className='your-coeff-title'>
                  <TipWrapper block={false} >
                    <span tip={lang['boosting-factor']}>
                      {lang['your-coeff']}
                    </span>
                  </TipWrapper>

                </div>
                <div className='your-coeff-num'>
                  {yourCoeff ? <DeriNumberFormat decimalScale={2} value={yourCoeff} thousandSeparator={true} /> : "--"}
                </div>
              </div>
            </div>
            <div className='total-your-contrib'>
              <div className='your-contrib'>
                <div className='stage'>
                  <div className='stage-title'></div>
                  <div className='stage-title'>1st</div>
                  <div className='stage-title'>2nd</div>
                  <div className='stage-title'>3rd</div>
                  <div className='stage-title'>4th</div>
                </div>
                <div className='total-score-box'>
                  <div className='total-score'>Total Score</div>
                  <div className='total-score'>
                    {stageList.Q1Contrib ? <DeriNumberFormat value={stageList.Q1Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='total-score'>
                    {stageList.Q2Contrib ? <DeriNumberFormat value={stageList.Q2Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='total-score'>
                    {stageList.Q3Contrib && stageList.Q3Contrib !== '0' ? <DeriNumberFormat value={stageList.Q3Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='total-score'>
                    {stageList.Q4Contrib && stageList.Q3Contrib !== '0' ? <DeriNumberFormat value={stageList.Q4Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                </div>
                <div className='your-score-box'>
                  <div className='your-score'>Your Score</div>
                  <div className='your-score'>
                    {stageList.userQ1Contrib ? <DeriNumberFormat value={stageList.userQ1Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='your-score'>
                    {stageList.userQ2Contrib ? <DeriNumberFormat value={stageList.userQ2Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='your-score'>
                    {stageList.userQ3Contrib && stageList.Q3Contrib !== '0' ? <DeriNumberFormat value={stageList.userQ3Contrib} decimalScale={0} thousandSeparator={true} /> : "--"}
                  </div>
                  <div className='your-score'>
                    {stageList.userQ4Contrib && stageList.Q4Contrib !== '0' ? <DeriNumberFormat value={stageList.userQ4Contrib} decimalScale={2} thousandSeparator={true} /> : "--"}
                  </div>
                </div>
                <div className='your-point-box'>
                  <div className='your-point'>Your Points</div>
                  <div className='your-point'>
                    {stageList.userQ1Point ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? `= (${stageList.userQ1Contrib} / ${stageList.Q1Contrib}) * 10,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ1Point} decimalScale={2} thousandSeparator={true} />
                        </span>

                      </TipWrapper>
                      : "--"}
                  </div>
                  <div className='your-point'>
                    {stageList.userQ2Point ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? `= (${stageList.userQ2Contrib} / ${stageList.Q3Contrib}) * 20,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ2Point} decimalScale={2} thousandSeparator={true} />
                        </span>

                      </TipWrapper>
                      : "--"}
                  </div>
                  <div className='your-point'>
                    {stageList.userQ3Point && stageList.Q3Contrib !== '0' ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? `= (${stageList.userQ3Contrib} / ${stageList.Q3Contrib}) * 20,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ3Point} decimalScale={0} thousandSeparator={true} />
                        </span>


                      </TipWrapper>

                      : "--"}
                  </div>
                  <div className='your-point'>
                    {stageList.userQ4Point && stageList.Q4Contrib !== '0' ?
                      <TipWrapper block={false} >
                        <span className='point-hover' tip={
                          stageList.userQ1Point ? ` = (${stageList.userQ4Contrib} / ${stageList.Q4Contrib}) * 50,000` : ''
                        }>
                          <DeriNumberFormat value={stageList.userQ4Point} decimalScale={2} thousandSeparator={true} />

                        </span>

                      </TipWrapper>
                      : "--"}
                  </div>
                </div>
              </div>
            </div>
            <div className='raise-score'>
              <div className='raise-score-title'>
                {lang['raise-score']}
              </div>
              <div className='button-link'>
                <TipWrapper block={false} tip={lang['staking-hover']}>
                  <a tip={lang['staking-hover']} href='https://app.deri.finance/#/mining/v2_lite/56/perpetual/AXSUSDT,MBOXUSDT,iBSCDEFI,iGAME,ALICEUSDT,AGLDUSDT/DERI/0x1a9b1B83C4592B9F315E933dF042F53D3e7E4819?symbolId=0'>
                    {lang['staking']}
                  </a>
                </TipWrapper>
                <TipWrapper block={false} tip={lang['futures-hover']} >
                  <a tip={lang['futures-hover']} href='https://app.deri.finance/#/futures/pro'>
                    {lang['futures']}
                  </a>
                </TipWrapper>
                <TipWrapper block={false} tip={lang['options-hover']}>
                  <a tip={lang['options-hover']} href='https://app.deri.finance/#/options/pro'>
                    {lang['options']}
                  </a>
                </TipWrapper>
              </div>
              <div className='des'>
                Mining rewards are calculated based on traders' total points of the 4 quarters. In each quarter, all the participating traders share&nbsp;<TipWrapper block={false} tip={lang['the-quater-points']}>
                  <span className='des-tip' tip={lang['the-quater-points']}>
                    this quarter's points
                  </span>
                </TipWrapper>
                &nbsp; per their transaction fees multiplied by the&nbsp;
                <TipWrapper block={false} tip={lang['boosting-factor']}>
                  <span className='des-tip' tip={lang['boosting-factor']}>
                    boosting factors
                  </span>
                </TipWrapper>
               .
                {/* <br></br> */}
                {/* {lang['the-individual']} */}
              </div>
            </div>

            <div className='totalpoints'>
              {/* <div className='total-points-title'>
                {lang['the-trading-mining-event-has-four-quarters']}
              </div> */}
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

            <div className='list'>
              <div className='list-title'>
                {lang['top-ten-users']}
              </div>
              <div className='list-box'>
                <div className='list-box-title'>
                  <span className='no'>{lang['no']}</span>
                  <span className='address'>{lang['user-addr']}</span>
                  <span className='feespaid'>{lang['fees-paid']}</span>
                  <TipWrapper block={false} >
                    <span className='score score-hover' tip=' estimated points based on the current weights'>
                      {lang['score']}
                    </span>
                  </TipWrapper>
                  {/* <span className='rewardBNB'>{lang['reward-BNB']}</span> */}
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
                          $ <DeriNumberFormat value={item.feesPaid} decimalScale={4} thousandSeparator={true} />
                        </div>
                        <div className='score'>
                          <DeriNumberFormat decimalScale={2} value={item.score} thousandSeparator={true} />
                        </div>
                        {/* <div className='rewardBNB top-three'>
                          $ <DeriNumberFormat value={item.rewardBNB} thousandSeparator={true} />
                        </div> */}

                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className='activity-rules'>
        <a target='_blank' rel='noreferrer' href='https://deri-protocol.medium.com/trade-to-earn-with-deri-protocol-on-bsc-1cedc8f98e95'>{lang['detailed-rules']}</a>
      </div>
    </div>
  )
}

export default inject('wallet', 'loading')(observer(Trading))

