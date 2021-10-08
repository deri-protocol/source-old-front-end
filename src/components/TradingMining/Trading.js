import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import Button from '../Button/Button';
import one from './img/one.svg'
import two from './img/two.svg'
import three from './img/three.svg'
import bnbLogo from './img/bnb.svg'
import deriLogo from './img/deri.svg'
import DeriNumberFormat from '../../utils/DeriNumberFormat'

function Trading({ wallet, lang }) {
  const [yourBNB,setYourBNB] = useState('')
  const [yourDERI,setYourDERI] = useState('')
  const [yourScored,setYourScored] = useState('')
  const [yourFee,setYourFee] = useState('')
  const [yourCoeff,setYourCoeff] = useState('')
  const [totalScored,setTotalScored] = useState('')
  const [list, setList] = useState(
    [
      {
        'no': 1,
        'progress': 'one-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '1000000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '200000'
      },
      {
        'no': 2,
        'progress': 'two-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '1000000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '100000'
      },

      {
        'no': 3,
        'progress': 'three-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '1000000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '50000'
      },
      {
        'no': 4,
        'progress': 'four-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '1000000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      },
      {
        'no': 5,
        'progress': 'five-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '1000000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      },
      {
        'no': 6,
        'progress': 'six-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '10000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      },
      {
        'no': 7,
        'progress': 'seven-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '10000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      },
      {
        'no': 8,
        'progress': 'eight-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '10000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      },
      {
        'no': 9,
        'progress': 'nine-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '10000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      },
      {
        'no': 10,
        'progress': 'ten-progress progress-box',
        'userAddr': '0Xfe...6721',
        'feesPaid': '10000',
        'avgCoeff': '20',
        'score': '139',
        'rewardBNB': '25000'
      }
    ]
  )

  useEffect(() => {
    console.log()
    document.getElementsByClassName('ten-progress')[0].style.width = '10%'
    document.getElementsByClassName('nine-progress')[0].style.width = '20%'
    document.getElementsByClassName('eight-progress')[0].style.width = '30%'
    document.getElementsByClassName('seven-progress')[0].style.width = '40%'
    document.getElementsByClassName('six-progress')[0].style.width = '50%'
    document.getElementsByClassName('five-progress')[0].style.width = '60%'
    document.getElementsByClassName('four-progress')[0].style.width = '70%'
    document.getElementsByClassName('three-progress')[0].style.width = '80%'
    document.getElementsByClassName('two-progress')[0].style.width = '90%'
  }, [wallet.detail.account])
  return (
    <div className='trading-top'>
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
                      $ <DeriNumberFormat value={item.feesPaid} thousandSeparator={true} />
                    </div>
                    <div className='avgcoeff'>
                      <DeriNumberFormat value={item.avgCoeff} thousandSeparator={true} />
                    </div>
                    <div className='score'>
                      {item.score}
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
                 <span>$ {yourBNB ? <DeriNumberFormat value={yourBNB} thousandSeparator={true} /> : "--"}</span>
              </div>
              <div className='your-deri'>
                <img src={deriLogo}></img>
                <span>$ {yourDERI ? <DeriNumberFormat value={yourDERI} thousandSeparator={true} /> : "--"} </span>
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

          </div>
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
              {lang['the-trading-rewards']}
            </div>
          </div>
          <div className='pool-total-scored'>
            <div> {lang['pool-total-scored']} </div>
            <div className='pool-total-num'>
              {totalScored ? <DeriNumberFormat value={totalScored} thousandSeparator={true} /> : "--"} 
            </div>
          </div>
        </div>
      </div>
      <div className='activity-rules'>
        {lang['activity-rules']}
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Trading))

