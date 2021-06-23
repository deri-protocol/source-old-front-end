import React, { useState ,useEffect} from 'react'
import {inject,observer} from 'mobx-react'

import {
  mintDToken
} from "../../lib/web3js/indexV2";
import useClaimInfo from "../../hooks/useClaimInfo";
import DeriNumberFormat from '../../utils/DeriNumberFormat'
import Button from '../Button/Button';
import { eqInNumber } from '../../utils/utils';
import useConfig from "../../hooks/useConfig";
function Broker({wallet={},lang}){
  const [claimInfo,claimInfoInterval] = useClaimInfo(wallet);
  const config = useConfig(claimInfo.chainId) 
  const [firstDeri,setFirstDeri] = useState(10000.251);
  const [secondDeri,setSecondDeri] = useState(8000.251);
  const [thirdDeri,setThirdDeri] = useState(7000.251);
  const [yourDeri,setTourDeri] = useState(55);
  const [yourRew,setYourRew] = useState(550);
  const [sumPage,setSumPage] = useState(1);
  const [currentPage,setCurrentPage] = useState(1);
  const [totList,setTotList] = useState([
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc...AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
    {
      time:'2021-6-5',
      address:'0xAdrc... AerR',
      volume:20,
      deri:Math.random()*1000
    },
  ])
  const [list,setList] = useState([]);

  const mintDeri = async () => {
    if(!eqInNumber(wallet.detail.chainId,claimInfo.chainId)) {
			alert(`${lang['your-deri-is-on']} ${ config.text } . ${lang['connect-to']} ${ config.text } ${lang['to-claim']}.`)
			return ;
		}
		if ((+claimInfo.unclaimed) === 0) {
			alert(lang['no-deri-to-claim-yet']);
			return;
		}
		let now = parseInt(Date.now() / 1000) % (3600 * 8);
		if (now < 1800) {
			alert(lang['claiming-DERI-is-disabled-during-first-30-minutes-of-each-epoch']);
			return;
		}
		const res = await mintDToken(wallet.detail.chainId,wallet.detail.account)
		if(res.success){
			clearInterval(claimInfoInterval);
			return true;
		} else {
			alert(lang['claim-failed'])
			return false;
		}
  }

  const upPage = () => {
    let page = currentPage
    if(page!=1){
      page -=1;
    }
    setCurrentPage(page)
  }

  const downPage = () => {
    let page = currentPage
    if(page < sumPage){
      page +=1;
    }
    setCurrentPage(page)
  }

  useEffect(()=>{
    let sum_page = totList.length / 10;
    sum_page = Math.ceil(sum_page)
    let data =  totList.slice((currentPage-1)*10,currentPage*10)
    setSumPage(sum_page);
    setList(data)

  },[wallet.detail,totList,currentPage])
  return(
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
                {yourRew}
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
        </div>
        <div className='proce'></div>
        <div className='bind'></div>
        <div className='proce'></div>
        <div className='earn'></div>
      </div>
      <div className='prpcess-title'>
        <div>
          {lang['invute-friends']}
        </div>
        <div className='bind-center'>
          {lang['bind-address']}
        </div>
        <div>
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
                  <DeriNumberFormat value={yourDeri} displayType='text' thousandSeparator={true} decimalScale='2' />
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
              <div>{lang['time-invited']}</div>
              <div>{lang['friends-add']}</div>
              <div>{lang['contract-vol']}</div>
              <div>{lang['deri-minted']}</div>
            </div>
            {list.map((list,index) => <div className='list-box' key={index} >
              <div className='time'>{list.time}</div>
              <div className='address'>{list.address}</div>
              <div className='volume'>{list.volume}</div>
              <div className='deri'>
              <DeriNumberFormat value={list.deri} displayType='text' thousandSeparator={true} decimalScale='2' />
              </div>
            </div> )}
          </div>
          <div className='page-of'>
            <div onClick={upPage}>← </div>
            <div className='page'>{lang['page']} {currentPage} {lang['of']} {sumPage}</div>
            <div onClick={downPage}> →</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default inject('wallet')(observer(Broker))
