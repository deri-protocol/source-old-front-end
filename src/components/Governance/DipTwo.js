import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import Button from '../Button/Button';
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import { getUserVotingPower, getVotingResult, vote, getUserVotingResult } from '../../lib/web3js/indexV2.js'
function DipTwo({ wallet = {}, lang, loading }) {
  const [optionOne, setOptionOne] = useState(false)
  const [optionTwo, setOptionTwo] = useState(false)
  const [optionThree, setOptionThree] = useState(false)
  const [checkedOption, setCheckedOption] = useState('')
  const [userVote, setUserVote] = useState('')
  const [userPower, setUserPower] = useState('')
  const [countVote, setCountVote] = useState([])
  const [sumVote, setSumVote] = useState('')
  const [timestamp, setTimestamp] = useState('')
  const connect = () => {
    wallet.connect()
  }
  const [elemButton, setElemButton] = useState(<Button click={connect} lang={lang} className='vote' btnText={lang['connet-wallet']} ></Button>)
  const radioChange = (e) => {
    let { value } = e.target
    setCheckedOption(value)
  }
  const voteBtn = async () => {
    if (!checkedOption) {
      alert(lang['please-choose-your-vote-first'])
      return
    }
    let res = await isOk()
    if (res) {
      getUserVote()
      getUserPower()
      getVoting()
    }
  }

  const isOk = async () => {
    let res = await vote(wallet.detail.chainId, wallet.detail.account, checkedOption)
    if (res.success) {
      let bool = true
      while (bool) {
        let data = await getUserVotingResult(wallet.detail.account)
        if (data.timestamp) {
          data.timestamp > timestamp ? bool = false : bool = true
        } else {
          data.timestamp ? bool = false : bool = true
        }
      }
      return true;
    }
  }


  const getUserVote = async () => {
    let res = await getUserVotingResult(wallet.detail.account)
    if (res) {
      if (res.option === '1') {
        setOptionOne(true)
        setUserVote("I")
      } else if (res.option === '2') {
        setOptionTwo(true)
        setUserVote("II")
      } else if (res.option === '3') {
        setOptionThree(true)
        setUserVote("III")
      }
      setTimestamp(res.timestamp)
    }
  }

  const getUserPower = async () => {
    let res = await getUserVotingPower(wallet.detail.account)
    if (res) {
      setUserPower(res)
    }
  }

  const getVoting = async () => {
    let res = await getVotingResult()
    loading.loaded()
    if (res) {
      let num = +res[0] + (+res[1]) + (+res[2])
      setCountVote(res)
      setSumVote(num)
    } else {
      alert(res.error)
    }
  }

  useEffect(() => {
    loading.loading()
    let interval = null;
    interval = window.setInterval(() => {
      getVoting()
    }, 1000)
  }, [])

  useEffect(() => {
    document.getElementsByClassName('pre_eth')[0].style.width = `${(+countVote[0] / sumVote) * 100}%`
    document.getElementsByClassName('pre_bsc')[0].style.width = `${(+countVote[1] / sumVote) * 100}%`
    document.getElementsByClassName('pre_heco')[0].style.width = `${(+countVote[2] / sumVote) * 100}%`
  }, [countVote, sumVote])

  useEffect(() => {
    let interval = null;
    if (wallet.isConnected()) {
      interval = window.setInterval(() => {
        getUserPower()
        getUserVote()
      }, 1000)
    }
  }, [wallet, wallet.detail.account])

  useEffect(() => {
    let elem;
    if (wallet.isConnected()) {
      elem = <Button className='vote' lang={lang} btnText={lang['vote']} click={voteBtn}></Button>
    } else {
      elem = <Button click={connect} className='vote' lang={lang} btnText={lang['connet-wallet']} ></Button>
    }
    setElemButton(elem)
  }, [wallet.detail.account, checkedOption])
  return (
    <div className='dip_two_box'>
      <div className='H2 DIP1'>
        {lang['governance-title']}
      </div>
      <div className='title-describe'>
        <div>
          {lang['governance-describe']}
        </div>
        <div>
          {lang['governance-describe-two']}
        </div>
        <div>
          {lang['governance-describe-three']} <a className='doc-a' rel='noreferrer' target="_blank" herf="https://docs.deri.finance/mining-faq#what-do-i-harvest-for-liquidity-mining">{lang['governance-describe-three-a']}</a>  {lang['governance-describe-three-one']}
        </div>
        <br />
      </div>
      <div className='flex'>
        I.
        {lang['governance-options-one-describe']}
        <br />
        <br />
        II.
        {lang['governance-options-two-describe']}
        <br />
        <br />
        III.{lang['governance-options-three']}
        <br />
      </div>
      <div className='radio'>
        <div>
          <div className='fle'>
            <div className='rad'>
              <input
                type="radio"
                name='option'
                value='1'
                id='I'
                onChange={event => radioChange(event)}
                defaultChecked={optionOne}
              /> <label for="I">I</label>
            </div>
            <div className='prele_eth'>
              <div className="pre_eth">
              </div>
              <span className='num-deri'> {countVote[0] ? <DeriNumberFormat value={countVote[0]} decimalScale={0} thousandSeparator={true} /> : '0'}   DERI</span>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input
                type="radio"
                name='option'
                value='2'
                id='II'
                onChange={event => radioChange(event)}
                defaultChecked={optionTwo}
              /> <label for="II">II</label>
            </div>
            <div className='prele_bsc'>
              <div className="pre_bsc">
              </div>
              <span className='num-deri'> {countVote[1] ? <DeriNumberFormat value={countVote[1]} decimalScale={0} thousandSeparator={true} /> : '0'}   DERI</span>
            </div>
          </div>
          <div className='fle'>
            <div className='rad'>
              <input
                type="radio"
                name='option'
                value='3'
                id='III'
                onChange={event => radioChange(event)}
                defaultChecked={optionThree}
              /> <label for="III">III</label>
            </div>
            <div className='prele_heco'>
              <div className="pre_heco">
              </div>
              <span className='num-deri'> {countVote[2] ? <DeriNumberFormat value={countVote[2]} decimalScale={0} thousandSeparator={true} /> : '0'}   DERI</span>
            </div>
          </div>
        </div>
        <div>
          {elemButton}
        </div>
        <br />
        <div>
          {lang['your-vote']} : {userVote}
        </div>
        <br />
        <div>
          {lang['your-voting-power']} : {userPower ? <DeriNumberFormat value={userPower} decimalScale={0} thousandSeparator={true} /> : '0'}
        </div>
        <br />
        <div>
          <span class="H2">Voting rules:</span>
          <br /><br />
          1.{lang['vote-rules-one']}
          <br />
          <ul>
            <li className='rules-describe'>{lang['vote-rules-one-describe-one']}</li>
            <li className='rules-describe'>{lang['vote-rules-one-describe-two']}</li>
            <li className='rules-describe'>{lang['vote-rules-one-describe-three']}</li>
            <li className='rules-describe'>{lang['vote-rules-one-describe-four']}</li>
          </ul>
          {/* <span className='rules-describe'>
            {lang['vote-rules-one-describe-one']}
          </span>
          <br />
          <span className='rules-describe'>
            {lang['vote-rules-one-describe-two']}
          </span>
          <br />
          <span className='rules-describe'>
            {lang['vote-rules-one-describe-three']}
          </span>
          <br />
          <span className='rules-describe'>
            {lang['vote-rules-one-describe-four']}
          </span> */}

          <br /><br />
          2. {lang['vote-rules-two']}
          <br /><br />
          3. {lang['vote-rules-three']}
          <br /><br />
          4. {lang['vote-rules-four']}
        </div>
      </div>
    </div>
  )
}
export default inject('wallet', 'loading')(observer(DipTwo))