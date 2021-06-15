import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import symbolArrowIcon from '../../assets/img/symbol-arrow.svg'
import { DeriEnv } from "../../lib/web3js/indexV2";
import arrow from './img/arrow.png'
import ETH from './img/ETH.png'
import BSC from './img/BSC.png'
import HECO from './img/HECO2.png'
import drop from './img/drop-down.png'
import classNames from 'classnames'
function Bridge({ wallet = {} }) {
  const isdev = DeriEnv.get() == 'dev' ? true : false;
  const [Initialize, setInitialize] = useState(isdev ?
    {
      from_chainId: 97,
      from_network: 'BSC-Testnet',
      to_chainId: 3,
      to_network: 'Ropsten'
    } : {
      from_chainId: 1,
      from_network: 'Ethereum',
      to_chainId: 56,
      to_network: 'BSC'
    });
  const [dropdown, setDropdown] = useState(false);
  const [dropdownList_from, setdropdownList_from] = useState(false);
  const [dropdownList_to, setdropdownList_to] = useState(false);
  const [From_img, setFrom_img] = useState(isNetwork(Initialize.from_chainId).img);
  const [To_img, setTo_img] = useState(isNetwork(Initialize.to_chainId).img);
  const [isFromConnected, setIsFromConnected] = useState();
  const [isToConnected, setIsToConnected] = useState();
  const selectClass = classNames('dropdown-menu', { 'show': dropdown })
  const selectListClassFrom = classNames('wallet_lis_from', { 'show': dropdownList_from })
  const selectListClassTo = classNames('wallet_lis_to', { 'show': dropdownList_to })
  const onDropdown = (event) => {
    event.preventDefault();
    setDropdown(!dropdown)
  }
  const showListFrom= () =>{
    setdropdownList_from(!dropdownList_from)
  }
  const showListTo= () =>{
    setdropdownList_to(!dropdownList_to)
  }

  const select_from = obj =>{
    let Init =  JSON.parse(JSON.stringify(Initialize));
    if(Init.to_chainId == obj.id){
      Init.from_chainId = Initialize.to_chainId;
      Init.from_network = Initialize.to_network;
      Init.to_chainId = Initialize.from_chainId;
      Init.to_network = Initialize.from_network;
    }else{
      Init.from_chainId = obj.id;
      Init.from_network = obj.text;
    }
    setInitialize(Init)
    setFrom_img(isNetwork(Init.from_chainId).img)
    setTo_img(isNetwork(Init.to_chainId).img)
    setdropdownList_from(!dropdownList_from)
  }
  const select_to = obj =>{
    let Init =  JSON.parse(JSON.stringify(Initialize));
    if(Init.from_chainId == obj.id){
      Init.from_chainId = Initialize.to_chainId;
      Init.from_network = Initialize.to_network;
      Init.to_chainId = Initialize.from_chainId;
      Init.to_network = Initialize.from_network;
    }else{
      Init.to_chainId = obj.id;
      Init.to_network = obj.text;
    }
    setInitialize(Init)
    setFrom_img(isNetwork(Init.from_chainId).img)
    setTo_img(isNetwork(Init.to_chainId).img)
    setdropdownList_to(!dropdownList_to)
  }
  const onFocus = event => {
    const target =event.target;
    target.setAttribute('class','contrant-input inputFamliy')
  }
 
  const onBlur = event => {
    const target =event.target;
    if(target.value === '') {
      target.setAttribute('class','contrant-input')
    }
  }
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  useEffect(() => {
    if (hasConnectWallet()) {
      let isCon = isConnected()
      setIsFromConnected(isCon.isFromConnected);
      setIsToConnected(isCon.isToConnected)
    }
  }, [[wallet.detail]])
  const isConnected = () => {
    let isFromConnected = hasConnectWallet ? (wallet.detail.chainId == Initialize.from_chainId ? true : false) : false;
    let isToConnected = hasConnectWallet ? (wallet.detail.chainId == Initialize.to_chainId ? true : false) : false;
    return {
      isFromConnected,
      isToConnected
    }
  }
  const netWork_text_from = isdev ?
    {
      one: {
        text: 'Ropsten',
        id: 3
      },
      two: {
        text: 'BSC-Testnet',
        id: 97
      },
      three: {
        text: 'HECO-Testnet',
        id: 256
      }
    } :
    {
      one: {
        text: 'Ethereum',
        id: 1
      },
      two: {
        text: 'BSC',
        id: 56
      },
      three: {
        text: 'HECO',
        id: 126
      }
    }
    const netWork_text_to = isdev ?
    {
      one: {
        text: 'Ropsten',
        id: 3
      },
      two: {
        text: 'BSC-Testnet',
        id: 97
      },
      three: {
        text: 'HECO-Testnet',
        id: 256
      }
    } :
    {
      one: {
        text: 'Ethereum',
        id: 1
      },
      two: {
        text: 'BSC',
        id: 56
      },
      three: {
        text: 'HECO',
        id: 126
      }
    }
  return (
    <div className='bridge_box'>
      <div className='bridge_info'>
        <div className='header_top'>
          <div className='header'>
            <span>
              BRIDGE
            </span>
          </div>
        </div>
        <div className='box_content'>
          <div className='H6 asset'>
            Asset
          </div>
          <div className='check_baseToken'>
            <div className='btn-group check-baseToken-btn'>
              <button
                type='button'
                onClick={onDropdown}
                className='btn chec'>
                DERI
              <span className='check-base-down'><img src={symbolArrowIcon} alt='' /></span>
              </button>
              <div className={selectClass}>
                <div className='dropdown-box'>
                  <div className='dropdown-item' onClick={onDropdown}>
                    DERI
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className='Fromto'>
            <div className='wallet_choose_box_outer'>
              <div className="H6">From</div>
              <div className='wallet_choose_box'>
                <div className='box_shadow'></div>
                <img src={From_img} className='net_logo' />
                <div className={isFromConnected ? 'is_connected connected' : 'is_connected'}>{isFromConnected ? 'Connected' : 'Unconnected'}</div>
                <div className='wallet_ul'>
                  <div className='wallet_ul_button'>
                    <div className='wallet_ul_button_text'>
                      {Initialize.from_network}
                    </div>
                    <div className='drop-down-outer'>
                      <img src={drop} onClick={showListFrom} />
                    </div>
                    <ul className='wallet_lis_from' className={selectListClassFrom}>
                      <div className='ul_shadow'></div>
                      <li className='wallet_li' onClick={()=>select_from(netWork_text_from.one)}>
                        {netWork_text_from.one.text}
                      </li>
                      <li className='wallet_li' onClick={()=>select_from(netWork_text_from.two)}>
                        {netWork_text_from.two.text}
                      </li>
                      <li className='wallet_li' onClick={()=>select_from(netWork_text_from.three)}>
                        {netWork_text_from.three.text}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className='arrow'>
              <div className="H6"></div>
              <div className='wallet_choose_box_center'>
                <img src={arrow} />
              </div>
            </div>
            <div className='wallet_choose_box_outer'>
              <div className="H6">To</div>
              <div className='wallet_choose_box'>
                <div className='box_shadow'></div>
                <img src={To_img} className='net_logo' />
                <div className={isToConnected ? 'is_connected connected' : 'is_connected'}>{isToConnected ? 'Connected' : 'Unconnected'}</div>
                <div className='wallet_ul'>
                  <div className='wallet_ul_button'>
                    <div className='wallet_ul_button_text'>
                      {Initialize.to_network}
                    </div>
                    <div className='drop-down-outer'>
                      <img src={drop} onClick={showListTo} />
                    </div>
                    <ul className='wallet_lis_to' className={selectListClassTo}>
                      <div className='ul_shadow'></div>
                      <li className='wallet_li' onClick={()=>select_to(netWork_text_from.one)}>
                        {netWork_text_to.one.text}
                      </li>
                      <li className='wallet_li' onClick={()=>select_to(netWork_text_from.two)}>
                        {netWork_text_to.two.text}
                      </li>
                      <li className='wallet_li' onClick={()=>select_to(netWork_text_from.three)}>
                        {netWork_text_to.three.text}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className='H6 amount'>Amount</div>
          <div className='Amount_line'>
            <div className='Amount_input'>
              <input 
              type="number" 
              className="contrant-input" 
              placeholder="Amount"
              onFocus={onFocus}
              onBlur={onBlur}
              />
              <div className='input_message'>Amount</div>
            </div>
            <div className="Amount_message">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
function isNetwork(chainId) {
  chainId = +chainId
  let obj = {}
  switch (chainId) {
    case 1:
      obj.netWork = 'ETHERENUM';
      obj.chainId = 1;
      obj.img = ETH;
      break;
    case 56:
      obj.netWork = 'BSC';
      obj.chainId = 56;
      obj.img = BSC;
      break;
    case 128:
      obj.netWork = 'HECO';
      obj.chainId = 128;
      obj.img = HECO;
      break;
    case 97:
      obj.netWork = 'BSC-Testnet';
      obj.chainId = 97;
      obj.img = BSC;
      break;
    case 3:
      obj.netWork = 'ROPSTEN';
      obj.chainId = 3;
      obj.img = ETH;
      break;
    case 256:
      obj.netWork = 'HECO-Testnet';
      obj.chainId = 256;
      obj.img = HECO;
      break;
    default:
      break;
  }
  return obj;
}
export default inject('wallet')(observer(Bridge))