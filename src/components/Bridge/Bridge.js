import React, { useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react';
import symbolArrowIcon from '../../assets/img/symbol-arrow.svg'
import { DeriEnv,mintDeri,freeze,getDeriBalance,bg,getUserWormholeSignature,unlockDeri,isDeriUnlocked, } from "../../lib/web3js/indexV2";
import Button from '../Button/Button';
import arrow from './img/arrow.png'
import ETH from './img/ETH.png'
import BSC from './img/BSC.png'
import HECO from './img/HECO.png'
import exclamatory_green from './img/exclamatory_green.png'
import exclamatory_red from './img/exclamatory_red.png'
import exclamatory_yellow from './img/exclamatory_yellow.png'
import drop from './img/drop-down.png'
import classNames from 'classnames'
import './zh-bridge.less'
function Bridge({ wallet = {},lang }) {
  const isdev = DeriEnv.get() == 'dev' ? true : false;
  const [amount, setAmount] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [sending, setSending] = useState(false);
  const [initialize, setInitialize] = useState(isdev ?
    {
      from_chainId: 97,
      from_network: lang['bsc-testnet'],
      to_chainId: 3,
      to_network: lang['ropsten']
    } : {
      from_chainId: 1,
      from_network: lang['ethereum'],
      to_chainId: 56,
      to_network: lang['bsc']
    });
  const [dropdown, setDropdown] = useState(false);
  const [dropdownList_from, setDropdownList_from] = useState(false);
  const [dropdownList_to, setDropdownList_to] = useState(false);
  const [From_img, setFrom_img] = useState(isNetwork(initialize.from_chainId,lang).img);
  const [To_img, setTo_img] = useState(isNetwork(initialize.to_chainId,lang).img);
  const [isFromConnected, setIsFromConnected] = useState();
  const [isToConnected, setIsToConnected] = useState();
  const [AmountMessage, setAmountMessage] = useState([]);
  const [message, setMessage] = useState({});
  const selectClass = classNames('dropdown-menu', { 'show': dropdown })
  const selectListClassFrom = classNames('wallet_lis_from', { 'show': dropdownList_from })
  const selectListClassTo = classNames('wallet_lis_to', { 'show': dropdownList_to })
  const onDropdown = (event) => {
    event.preventDefault();
    setDropdown(!dropdown)
  }
  
  const showListFrom= () =>{
    setDropdownList_from(!dropdownList_from)
  }
  const showListTo= () =>{
    setDropdownList_to(!dropdownList_to)
  }
  const select_from = obj =>{
    let Init =  JSON.parse(JSON.stringify(initialize));
    if(Init.to_chainId == obj.id){
      Init.from_chainId = initialize.to_chainId;
      Init.from_network = initialize.to_network;
      Init.to_chainId = initialize.from_chainId;
      Init.to_network = initialize.from_network;
    }else{
      Init.from_chainId = obj.id;
      Init.from_network = obj.text;
    }
    setInitialize(Init)
    setDropdownList_from(!dropdownList_from)
  }

  const select_to = obj =>{
    let Init =  JSON.parse(JSON.stringify(initialize));
    if(Init.from_chainId == obj.id){
      Init.from_chainId = initialize.to_chainId;
      Init.from_network = initialize.to_network;
      Init.to_chainId = initialize.from_chainId;
      Init.to_network = initialize.from_network;
    }else{
      Init.to_chainId = obj.id;
      Init.to_network = obj.text;
    }
    setInitialize(Init)
    setDropdownList_to(!dropdownList_to)

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
  const amountChange = event => {
    let {value} = event.target
    setAmount(value)
  }
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  useEffect(() => {
    if (hasConnectWallet()) {
      let isCon = isConnected()
      setIsFromConnected(isCon.isFromConnected);
      setIsToConnected(isCon.isToConnected)
    }
  }, [wallet.detail])

  useEffect(() =>{
    setFrom_img(isNetwork(initialize.from_chainId,lang).img)
    setTo_img(isNetwork(initialize.to_chainId,lang).img)
    let isCon = isConnected()
    setIsFromConnected(isCon.isFromConnected);
    setIsToConnected(isCon.isToConnected)
  },[initialize])

  const getValid = async () => {
    if(hasConnectWallet()){
      let res = await getUserWormholeSignature(wallet.detail.account);
      if(res.valid){
        setInitialize({
          from_chainId: res.fromChainId,
          from_network: isNetwork(res.fromChainId,lang).netWork,
          to_chainId: res.toChainId,
          to_network: isNetwork(res.toChainId,lang).netWork,
        })
        setFrom_img(isNetwork(res.fromChainId,lang).img)
        setTo_img(isNetwork(res.toChainId,lang).img)
        setAmount(bg(res.amount,-18))
        setSending(res.valid)
      }
    }
  }
  useEffect(() => {
    if(hasConnectWallet()){
      getValid()
    }
  },[wallet.detail])
  const isConnected = () => {
    let isFromConnected = hasConnectWallet ? (wallet.detail.chainId == initialize.from_chainId ? true : false) : false;
    let isToConnected = hasConnectWallet ? (wallet.detail.chainId == initialize.to_chainId ? true : false) : false;
    return {
      isFromConnected,
      isToConnected
    }
  }
  const netWork_text_from = isdev ?
    {
      one: {
        text: lang['ropsten'],
        id: 3
      },
      two: {
        text: lang['bsc-testnet'],
        id: 97
      },
      three: {
        text: lang['heco-testnet'],
        id: 256
      }
    } :
    {
      one: {
        text: lang['ethereum'],
        id: 1
      },
      two: {
        text: lang['bsc'],
        id: 56
      },
      three: {
        text: lang['heco'],
        id: 128
      }
    }
    const netWork_text_to = isdev ?
    {
      one: {
        text: lang['ropsten'],
        id: 3
      },
      two: {
        text: lang['bsc-testnet'],
        id: 97
      },
      three: {
        text: lang['heco-testnet'],
        id: 256
      }
    } :
    {
      one: {
        text: lang['ethereum'],
        id: 1
      },
      two: {
        text: lang['bsc'],
        id: 56
      },
      three: {
        text: lang['heco'],
        id: 128
      }
    }
  return (
    <div className='bridge_box'>
      <div className='bridge_info'>
        <div className='header_top'>
          <div className='header'>
            <span>
              {lang['bridge']}
            </span>
          </div>
        </div>
        <div className='box_content'>
          <div className='H6 asset'>
            {lang['asset']}
          </div>
          <div className='check_baseToken'>
            <div className='btn-group check-baseToken-btn'>
              <button
                type='button'
                onClick={onDropdown}
                className='btn chec'>
                {lang['deri']}
              <span className='check-base-down'><img src={symbolArrowIcon} alt='' /></span>
              </button>
              <div className={selectClass}>
                <div className='dropdown-box'>
                  <div className='dropdown-item' onClick={onDropdown}>
                  {lang['deri']}
                </div>
                </div>
              </div>
            </div>
          </div>
          <div className='Fromto'>
            <div className='wallet_choose_box_outer'>
              <div className="H6">{lang['from']}</div>
              <div className='wallet_choose_box'>
                <div className='box_shadow'></div>
                <img src={From_img} className='net_logo' />
                <div className={isFromConnected ? 'is_connected connected' : 'is_connected'}>{isFromConnected ? lang['connected'] : lang['unconnected']}</div>
                <div className='wallet_ul'>
                  <div className='wallet_ul_button' onClick={showListFrom} >
                    <div className='wallet_ul_button_text'>
                      {initialize.from_network}
                    </div>
                    <div className='drop-down-outer'>
                      <img className={sending?'':'img_show'} src={drop}  />
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
              <div className="H6">{lang['to']}</div>
              <div className='wallet_choose_box'>
                <div className='box_shadow'></div>
                <img src={To_img} className='net_logo' />
                <div className={isToConnected ? 'is_connected connected' : 'is_connected'}>{isToConnected ? lang['connected'] : lang['unconnected']}</div>
                <div className='wallet_ul'>
                  <div className='wallet_ul_button'  onClick={showListTo}>
                    <div className='wallet_ul_button_text'>
                      {initialize.to_network}
                    </div>
                    <div className='drop-down-outer'>
                      <img className={sending?'':'img_show'} src={drop} />
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
          <div className='H6 amount'>{lang['amount']}</div>
          <div className='Amount_line'>
            <div className='Amount_input'>
              <input 
              type="number" 
              className="contrant-input" 
              placeholder={lang['amount']}
              onFocus={onFocus}
              onBlur={onBlur}
              onChange={event =>  amountChange(event) }
              value={amount}
              disabled = {sending?true:false}
              />
              <div className='input_message'>{lang['amount']}</div>
            </div>
            <div className="Amount_message">
              {AmountMessage.map((item,index) => <div className='Amount_message_line' key={index}>
                <span className={item.color}>{item.text}</span>
                <br className='pc'/>
                <span className={item.is_finished} class='status'>{item.status}</span>
              </div> )} 
            </div>
          </div>
          <div className='message_box'>
            <div id='message' className={message.color}>
              {showMessage?<img src={message.img} className='exclamatory' />:""} 
              <div className="text">{ message.text }</div>
            </div>
          </div>
          <Operator hasConnectWallet={hasConnectWallet}
                    wallet={wallet}
                    lang={lang}
                    amount={amount}
                    initialize={initialize}
                    setAmountMessage={setAmountMessage}
                    setMessage={setMessage}
                    setSending={setSending}
                    setShowMessage={setShowMessage}
                    isFromConnected={isFromConnected}
                    isToConnected={isToConnected}
           />
        </div>
      </div>
    </div>
  )
}
function Operator({hasConnectWallet,wallet,amount,lang,initialize,setAmountMessage,setMessage,setSending,setShowMessage,isFromConnected,isToConnected}){
  const [isApprove, setIsApprove] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isClickClaim, setIsClickClaim] = useState(false);
  const [actionElement, setActionElement] = useState(<Button className='btn' btnText={lang['approve']}></Button>);  
  const connect = () => {
    wallet.connect()
  }
  const valid = async () =>{
    if(hasConnectWallet()){
      let res = await getUserWormholeSignature(wallet.detail.account);
      setIsValid(res.valid)
    }
  }
  const getBalance = async () =>{
    if(hasConnectWallet()){
      let res = await getDeriBalance(wallet.detail.chainId,wallet.detail.account)
      setBalance(res)
    }
    
  }
  const send = async () =>{
    if(amount == '' || amount == 0){
      alert(lang['amount-must-be-greater-than-zero'])
      return;
    }
    if(+amount > balance){
      alert(lang['there-is-not-enough-amount'])
      return;
    }
    if(!isFromConnected){
      alert(`${lang['send-finished-one']} ${isNetwork(initialize.from_chainId,lang).netWork} ${lang['send-finished-two']}`)
      return;
    }
    setSending(true)
    setShowMessage(true)
    setMessage({
      img:exclamatory_yellow,
      text:`${lang['this-step-do-not-close']}`,
      color:'message_yellow'
    })
    setAmountMessage([
      {
        'text': `1. ${lang['sending-deri-to-wormhole']}`,
        'is_finished': '',
        'status': '',
        'color': ''
      },
      {
        'text': `${lang['processing']}`,
        'is_finished': '',
        'status': '',
        'color': 'is_processing'
      }
    ])
    let res =  await freeze(wallet.detail.chainId,wallet.detail.account,initialize.to_chainId,amount)
    if(res.success){
      setActionElement( <button className='btn  btn-danger short-submit' >{lang['processing']}</button>)
      setAmountMessage([
        {
          'text': `1. ${lang['sending-deri-to-wormhole']}`,
          'is_finished': 'is_finished',
          'status': lang['finished'],
          'color': ''
        },
        {
          'text': `2. ${lang['waiting-for-bridge-to-sign']}`,
          'is_finished': '',
          'status': '',
          'color': ''
        },
        {
          'text': `${lang['processing']}`,
          'is_finished': '',
          'status': '',
          'color': 'is_processing'
        }
      ])
      window.setInterval(()=>{
        valid()
      },3000)
    }else{
      setAmountMessage([])
      setMessage({})
      setSending(false)
      setMessage({
        img:exclamatory_red,
        text:`${lang['this-step-do-not-close']}`,
        color:'message_red'
      })
    }
  }
  const claim = async () =>{
    if(!isToConnected){
      alert(`${lang['send-finished-one']} ${isNetwork(initialize.to_chainId,lang).netWork} ${lang['send-finished-two']}`)
      return;
    }
    setShowMessage(true)
    setMessage({
      img:exclamatory_yellow,
      text:`${lang['this-step-do-not-close']}`,
      color:'message_yellow'
    })
    setAmountMessage([
      {
        'text': `1. ${lang['claim-deri-ing']}`,
        'is_finished': '',
        'status': '',
        'color': ''
      },
      {
        'text': `${lang['processing']}`,
        'is_finished': '',
        'status': '',
        'color': 'is_processing'
      }
    ]
      
    )
    let res = await mintDeri(wallet.detail.chainId,wallet.detail.account)
    if(res.success){
      setIsClickClaim(true)
      setActionElement( <button className='btn  btn-danger short-submit' >{lang['processing']}</button>)
      setAmountMessage([
        {
          'text': `1. ${lang['claim-deri-ing']}`,
          'is_finished': 'is_finished',
          'status': lang['finished'],
          'color': ''
        },
        {
          'text': `2. ${lang['waiting-for-bridge-to-sync']}`,
          'is_finished': '',
          'status': '',
          'color': ''
        },
        {
          'text': `${lang['processing']}`,
          'is_finished': '',
          'status': '',
          'color': 'is_processing'
        }
      ])
      window.setInterval(()=>{
        valid()
      },3000)
    }else{
      alert(lang['claim-faild'])
      setAmountMessage([])
    }
    
  }
  const approve = async () => {
    const res = await unlockDeri(wallet.detail.chainId,wallet.detail.account)
    if(res.success){
      setIsApprove(true);
      loadApprove();
    } else {
      setIsApprove(false)
      alert(lang['approve-faild'])
    }
  }
  const loadApprove = async () => {
    if(hasConnectWallet()){
      const result = await isDeriUnlocked(wallet.detail.chainId,wallet.detail.account)
      setIsApprove(result);
    }
  }
  useEffect(() => {
    if(hasConnectWallet()){
      loadApprove();
      valid()
      getBalance()
    }
  }, [wallet.detail,initialize]); 
  useEffect(() => {
    if(isValid){
      if(initialize.to_chainId != wallet.detail.chainId){
        setShowMessage(true)
        setMessage({
          img:exclamatory_green,
          text:`${lang['send-finished-one']} ${isNetwork(initialize.to_chainId,lang).netWork} ${lang['send-finished-two']}`,
          color:'message_green'
        })
      }
      setAmountMessage([
        {
          'text': `1. ${lang['sending-deri-to-wormhole']}`,
          'is_finished': 'is_finished',
          'status': lang['finished'],
          'color': ''
        },
        {
          'text': `2. ${lang['waiting-for-bridge-to-sign']}`,
          'is_finished': 'is_finished',
          'status': lang['finished'],
          'color': ''
        },
        {
          'text': `3. ${lang['bridge-signed']}`,
          'is_finished': '',
          'status': '',
          'color': 'is_finished'
        },
      ])

    }else if(isClickClaim){
      setAmountMessage([
        {
          'text': `1. ${lang['sending-deri-to-wormhole']}`,
          'is_finished': 'is_finished',
          'status':lang['finished'],
          'color': ''
        },
        {
          'text': `2. ${lang['waiting-for-bridge-to-sign']}`,
          'is_finished': 'is_finished',
          'status': lang['finished'],
          'color': ''
        },
        {
          'text': `3. ${lang['done']}`,
          'is_finished': '',
          'status': '',
          'color': 'is_finished'
        },
      ])
      setSending(false)
    }else{
      setAmountMessage([])
      setShowMessage(false)
    }
  }, [isValid,initialize]); 

  
  
  
  useEffect(()=>{
    let element;
    if(hasConnectWallet()){
      if(isValid){
        element =  <Button className='btn' btnText={lang['claim']} click={claim} lang={lang}/>
      } else if(!isApprove){
        element = <Button className='btn' btnText={lang['approve']} click={approve} lang={lang}/>
      } else {
        element = <Button className='btn' btnText={lang['send']} click={send} lang={lang}></Button>
      }
    } else {
      element = <Button className='btn' btnText={lang['connect-wallet']} click={connect} lang={lang}></Button>
    }
    setActionElement(element)
  },[isValid,wallet.detail,isApprove,amount,initialize])

  return (
    <div className='button'>
     {actionElement}
    </div> 
  )
  
}
function isNetwork(chainId,lang) {
  chainId = +chainId
  let obj = {}
  switch (chainId) {
    case 1:
      obj.netWork = lang["ethereum"];
      obj.chainId = 1;
      obj.img = ETH;
      break;
    case 56:
      obj.netWork = lang["bsc"];
      obj.chainId = 56;
      obj.img = BSC;
      break;
    case 128:
      obj.netWork = lang["heco"];
      obj.chainId = 128;
      obj.img = HECO;
      break;
    case 97:
      obj.netWork = lang["bsc-testnet"];
      obj.chainId = 97;
      obj.img = BSC;
      break;
    case 3:
      obj.netWork = lang["ropsten"];
      obj.chainId = 3;
      obj.img = ETH;
      break;
    case 256:
      obj.netWork = lang["heco-testnet"];
      obj.chainId = 256;
      obj.img = HECO;
      break;
    default:
      break;
  }
  return obj;
}
export default inject('wallet')(observer(Bridge))