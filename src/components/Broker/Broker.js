import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import dateFormat from 'date-format'
import {
  mintDToken,
  fetchRestApi,
} from "../../lib/web3js/indexV2";
import useClaimInfo from "../../hooks/useClaimInfo";
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import Button from '../Button/Button';
import { eqInNumber } from '../../utils/utils';
import useConfig from "../../hooks/useConfig";
function Broker({ wallet = {}, lang }) {
  const [claimInfo, claimInfoInterval] = useClaimInfo(wallet);
  const config = useConfig(claimInfo.chainId)
  const [firstDeri, setFirstDeri] = useState('--');
  const [secondDeri, setSecondDeri] = useState('--');
  const [thirdDeri, setThirdDeri] = useState('--');
  const [yourDeri, setYourDeri] = useState('--');
  const [yourRank, setYourRank] = useState('--');
  const [sumPage, setSumPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totList, setTotList] = useState([])
  const [list, setList] = useState([]);

  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const rewardList = async () => {
    let path = `/broker/${wallet.detail.account}/reward_list`
    let res = await fetchRestApi(path)
    if (res.data) {
      res.data.map(item => {
        item.trader_invite_timestamp = item.trader_invite_timestamp * 1000
        item.trader_address = item.trader_address.slice(0, 6) +
          "..." +
          item.trader_address.slice(item.trader_address.length - 4, item.trader_address.length)
      })
      setTotList(res.data)
    }

  }

  const topList = async () => {
    let path = '/broker/top3_reward_list'
    let res = await fetchRestApi(path)
    if (res.data) {
      if(res.data.length){
        res.data.map(item => {
          if (item.rank === 1) {
            setFirstDeri(item.deri_reward)
          } else if (item.rank === 2) {
            setSecondDeri(item.deri_reward)
          } else if (item.rank === 3) {
            setThirdDeri(item.deri_reward)
          }
        })
      }else{
        setFirstDeri(0)
        setSecondDeri(0)
        setThirdDeri(0)
      }
    }
  }

  const totalReward = async () => {
    let path = `/broker/${wallet.detail.account}/total_reward`
    let res = await fetchRestApi(path)
    if (res.data) {
      if (res.data.hasOwnProperty('deri_reward')) {
        setYourDeri(res.data.deri_reward)
        setYourRank(res.data.rank)
      } else {
        setYourDeri(0)
        setYourRank('>999')
      }
    }
  }

  const mintDeri = async () => {
    if ((+claimInfo.unclaimed) === 0) {
      alert(lang['no-deri-to-claim']);
      return;
    }
    if (!eqInNumber(wallet.detail.chainId, claimInfo.chainId)) {
      alert(`${lang['your-deri-is-on']} ${config.text}  ${lang['connect-to']} ${config.text} ${lang['to-claim']}.`)
      return;
    }
    let now = parseInt(Date.now() / 1000) % (3600 * 8);
    if (now < 1800) {
      alert(lang['claiming-DERI-is-disabled-during-first-30-minutes-of-each-epoch']);
      return;
    }
    const res = await mintDToken(wallet.detail.chainId, wallet.detail.account)
    if (res.success) {
      clearInterval(claimInfoInterval);
      return true;
    } else {
      alert(lang['claim-failed'])
      return false;
    }
  }

  const upPage = () => {
    let page = currentPage
    if (page != 1) {
      page -= 1;
    }
    setCurrentPage(page)
  }

  const downPage = () => {
    let page = currentPage
    if (page < sumPage) {
      page += 1;
    }
    setCurrentPage(page)
  }

  useEffect(() => {
    if (totList.length) {
      let sum_page = totList.length / 10;
      sum_page = Math.ceil(sum_page)
      let data = totList.slice((currentPage - 1) * 10, currentPage * 10)
      setSumPage(sum_page);
      setList(data);
    }

  }, [wallet.detail, totList, currentPage])
  useEffect(() => {
    if(hasConnectWallet()){
      rewardList();
      topList();
      totalReward();
    }
  }, [wallet.detail])
  return (
    <div className='broker'>
      <div className='title'>
        {lang['title-one']}
        <br />
        {lang['title-two']}
      </div>
      <div className='rewards'>
        <div className='reward-box'>
          <div className='rewards-left'>
            <div className='rewards-one'>
              <div className='num'>
                <span>
                  <DeriNumberFormat value={firstDeri} displayType='text' thousandSeparator={true} decimalScale='2' />
                </span> DERI
              </div>
              <div className='one'>
                # 1 {lang['rewards']}
              </div>
            </div>
            <div className='rewards-three'>
              <div className='num'>
                <span>
                  <DeriNumberFormat value={thirdDeri} displayType='text' thousandSeparator={true} decimalScale='2' />
                </span>  DERI
              </div>
              <div className='one'>
                # 3 {lang['rewards']}
              </div>
            </div>
          </div>
          <div className='rewards-right'>
            <div className='rewards-two'>
              <div className='num'>
                <span>
                  <DeriNumberFormat value={secondDeri} displayType='text' thousandSeparator={true} decimalScale='2' />
                </span> DERI
              </div>
              <div className='one'>
                # 2 {lang['rewards']}
              </div>
            </div>
            <div className='rewards-frou'>
              <div className='num'>
                <span>
                  {yourRank}
                </span>
              </div>
              <div className='one'>
                {lang['your-rewards']}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-box"></div>
      </div>
      <div className='process'>
        <div className='invite'>
          {lang['invute-friends']}
        </div>
        <div className='proce'></div>
        <div className='bind'>
          {lang['bind-address']}
        </div>
        <div className='proce'></div>
        <div className='earn'>
          {lang['earn-deri']}
        </div>
      </div>
      <div className='rules'>
        <div>

        </div>
        <div>
          <a>{lang['detailed-rules']} >></a>
        </div>
      </div>
      <div className='my-harvest'>
        <div className='header'>
          {lang['my-harvest']}
        </div>
        <div className='list'>
          <div className='my-deri'>
            <div className='claim-deri'>
              <div className='claimed-deri'>
                <div className='claimed-title'>
                  {lang['claimed-deri']}
                </div>
                <div className='unclaimed-title'>
                  {lang['unclaimed-deri']}
                </div>
              </div>
              <div className='unclaimed-deri'>
                <div className='claimed-num'>
                  <DeriNumberFormat value={(+yourDeri).toFixed(2)} displayType='text' thousandSeparator={true} decimalScale='2' />
                </div>
                <div className='unclaimed-num'>
                  <DeriNumberFormat value={(+claimInfo.unclaimed).toFixed(2)} displayType='text' thousandSeparator={true} decimalScale='2' />
                </div>
              </div>
            </div>
            <div className='button'>
              <Button className='btn' btnText={lang['claim']} lang={lang} click={mintDeri}></Button>
            </div>
          </div>
          <div className='address-list'>
            <div className='list-title'>
              <div className='time-invited'>{lang['time-invited']}</div>
              <div className='friends-add'>{lang['friends-add']}</div>
              <div className='contract-vol'>{lang['contract-vol']}</div>
              <div className='deri-minted'>{lang['deri-minted']}</div>
            </div>
            {list.map((list, index) => <div className='list-box' key={index} >
              <div className='time'>
                {dateFormat.asString('yyyy-MM-dd hh:mm', new Date(parseInt(list.trader_invite_timestamp)))}
              </div>
              <div className='address'>{list.trader_address}</div>
              <div className='volume'>{list.trader_volume}</div>
              <div className='deri'>
                <DeriNumberFormat value={list.deri_reward} displayType='text' thousandSeparator={true} decimalScale='2' />
              </div>
            </div>)}
          </div>
          <div className='page-of'>
            <div onClick={upPage}><svg xmlns="http://www.w3.org/2000/svg" width="9.6" height="8" viewBox="0 0 9.6 8">
              <path id="路径_3" data-name="路径 3" d="M3186.224,481.353a.4.4,0,1,1,.552.58l-3.069,2.91h7.993a.4.4,0,1,1,0,.8h-7.98l3.056,2.91a.4.4,0,0,1-.552.58l-3.49-3.324a.8.8,0,0,1,.007-1.138Z" transform="translate(-3182.5 -481.243)" fill="#aaa" />
            </svg>
            </div>
            <div className='page'>{lang['page']} {currentPage} {lang['of']} {sumPage}</div>
            <div onClick={downPage}><svg xmlns="http://www.w3.org/2000/svg" width="9.6" height="8" viewBox="0 0 9.6 8">
              <path id="路径_4" data-name="路径 4" d="M3268.376,481.353a.4.4,0,0,0-.552.58l3.069,2.91H3262.9a.4.4,0,0,0,0,.8h7.98l-3.056,2.91a.4.4,0,0,0,.552.58l3.49-3.324a.8.8,0,0,0-.007-1.138Z" transform="translate(-3262.5 -481.243)" fill="#aaa" />
            </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Broker))
