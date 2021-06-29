import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import rightArrow from '../../assets/img/play-button.png'
import dateFormat from 'date-format'
import config from '../../config.json'
import {
  mintDToken,
  fetchRestApi,
  DeriEnv
} from "../../lib/web3js/indexV2";
import classNames from 'classnames';
import useClaimInfo from "../../hooks/useClaimInfo";
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import Button from '../Button/Button';
import { eqInNumber } from '../../utils/utils';
import useConfig from "../../hooks/useConfig";
const chainConfig = config[DeriEnv.get()]['chainInfo'];
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
  const [claimed, setClaimed] = useState(false);
  const [list, setList] = useState([]);
  const [remainingTime, setRemainingTime] = useState('')

  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  const rewardList = async () => {
    let path = `/broker/${wallet.detail.account}/reward_list`
    let res = await fetchRestApi(path)
    if (res.data) {
      let data = res.data.map(item => {
        let obj = {}
        obj.address = item.trader_address
        obj.trader_volume = item.trader_volume
        obj.deri_reward = item.deri_reward;
        obj.trader_invite_timestamp = item.trader_invite_timestamp * 1000
        obj.trader_address = item.trader_address.slice(0, 6) +
          "..." +
          item.trader_address.slice(item.trader_address.length - 4, item.trader_address.length)
        return obj
      })
      setTotList(data)
    }
  }

  const brokerEpoch = async ()=>{
    let path = `/broker/${wallet.detail.account}/get_harvest_deri`
    let res = await fetchRestApi(path)
    if(res.data){
      setYourDeri(res.data.deri_reward)
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
        setYourRank(res.data.rank)
      } else {
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

  const click = async () => {
		if(wallet.isConnected()){
			const res = await mintDeri();
			if(res){
				setClaimed(true)
			}
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
  useEffect(() => {
    let intervalEpoch = null;
    intervalEpoch = window.setInterval(brokerEpoch(),1000 * 60 *3);
    return () => {
      intervalEpoch && clearInterval(intervalEpoch);
		}
  },[wallet.detail.account])

  useEffect(() => {
		let interval = null;
			//计数器
			interval = window.setInterval(() => {
				let period = 3600 * 8;
				let current = parseInt(Date.now()/1000);
				let epochBegin = parseInt(current / period)*period;
				let dis = (epochBegin + period - current);
				let h = parseInt(dis / 3600);
				let m = parseInt((dis % 3600)/60)
				let s = parseInt(dis % 60) 
				setRemainingTime(`${h} ${lang['h']} ${m} ${lang['m']} ${s} ${lang['s']}`);
			},1000);
    return () => {
      interval && clearInterval(interval);
		};
		
  }, [wallet.detail.account]);

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
          <a target='_blank' href='https://docs.deri.finance/guides/mining#mining-by-brokerage-mining-0-01deri-per-contract-or-distributed-per-volume-weight-if-breaching-the-hourly-upper-limit'>{lang['detailed-rules']} >></a>
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
                <div className='unclaimed-title'>
                  <span  title={lang['your-total-unclaimed-deri-title']}>
                    {lang['current-epoch-remaining-time']}
                  </span>
                  <span className='deri-text'>
                  {remainingTime}
                  </span>
                </div>
                <div className='unclaimed-title'>
                  <span  title={lang['your-total-unclaimed-deri-title']}>
                    {lang['my-trading-volume-in-current-hour']} 
                  </span>
                  <span className='deri-text'>
                    <DeriNumberFormat value={(+yourDeri).toFixed(2)} displayType='text' thousandSeparator={true} decimalScale='2' />  DERI
                  </span>
                </div>
                <div className='claimed-title'>
                  <span className='hover-title' title={lang['your-total-claimed-deri-title']}>
                  {lang['claimed-deri']}
                  </span>
                  <span className='deri-text'>
                    {claimed ? ((+claimInfo.claimed) + (+claimInfo.unclaimed)).toFixed(2) : claimInfo.claimed }
                  </span>
                </div>
                <div className='unclaimed-title'>
                  <span className='hover-title' title={lang['your-total-unclaimed-deri-title']}>
                    {lang['unclaimed-deri']}
                  </span>
                  <span className='deri-text'>
                  { claimed ? 0 : (+claimInfo.unclaimed).toFixed(2) }
                  </span>
                </div>
              </div>
            </div>
            <div className='button'>
              <Button className='btn' btnText={lang['claim']} lang={lang} click={click}></Button>
            </div>
          </div>
          <div className='address-list'>
            <div className='list-title'>
              <div className='time-invited'>{lang['time-invited']}</div>
              <div className='friends-add'>
                {lang['friends-add']}
              </div>
              <div className='contract-vol'>{lang['contract-vol']}</div>
              <div className='deri-minted'>{lang['deri-minted']}</div>
            </div>
            {list.map((list, index) => <div className='list-box' key={index} >
              <div className='time'>
                {dateFormat.asString('yyyy-MM-dd hh:mm', new Date(parseInt(list.trader_invite_timestamp)))}
              </div>
              <div className='address'>
              {list.trader_address}
              <span className='view'>
                  <span className='view-space'>
                    <a target='_blank' rel='noreferrer' href={`${chainConfig[wallet.detail.chainId]['viewUrl']}address/${list.address}`}>
                    View at {chainConfig[wallet.detail.chainId]['viewUrl']}
                    </a>
                  </span>
                  <span className='right-arrow'>
                    <img alt='' src={rightArrow}/>
                  </span>
                  <span className='view-arrow'>
                    <a target='_blank' rel='noreferrer' href={`${chainConfig[wallet.detail.chainId]['viewUrl']}address/${list.address}`}>
                      <img rel='noreferrer' alt='' src="data:image/svg+xml;base64,DQo8c3ZnIGZpbGw9Im5vbmUiIGhlaWdodD0iMTAiIHdpZHRoPSIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aCBkPSJNOC42NzYuNjQyYS42NS42NSAwIDAwLS4wNzIuMDA2SDQuNzkzYS42NS42NSAwIDAwLS41Ny45NzUuNjUuNjUgMCAwMC41Ny4zMjJINy4xMkwuNDM4IDguNjE0YS42NDcuNjQ3IDAgMDAuMjg2IDEuMDk2LjY1LjY1IDAgMDAuNjMyLS4xNzlMOC4wNCAyLjg2MXYyLjMyNGEuNjQ4LjY0OCAwIDAwLjk3Ny41Ny42NDguNjQ4IDAgMDAuMzIyLS41N1YxLjM4YS42NDcuNjQ3IDAgMDAtLjY2Mi0uNzM3eiIgZmlsbD0iI0FBQUFBQSIvPg0KPC9zdmc+DQoNCg=="/>
                    </a>
                  </span>
                </span>
              </div>
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
