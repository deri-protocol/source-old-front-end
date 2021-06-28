import React,{useState,useEffect} from 'react'
import {inject,observer} from 'mobx-react'
import Button from '../Button/Button';
import {
  fetchRestApi,
  setBroker,
} from "../../lib/web3js/indexV2";
function Bind({wallet={},lang}){
  const [address,setAddress] = useState()
  const [isBind,setIsBind] = useState(true)
  
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account

  const BindBroker = async ()=>{
    if( hasConnectWallet()){
      if(address === undefined){
        alert(lang['please-enter-address']) 
        return;
      }
      let bindAddress = address.toLocaleLowerCase();
      if(bindAddress.length != 42 || bindAddress.indexOf('0x') != 0){
        alert(lang['please-enter-a-correct-address']) 
        return;
      }
      if(bindAddress === wallet.detail.account){
        alert(lang['brokder-addr-cannot-be-the-same-as-trader']) 
        return;
      }
      if(isBind){
        alert(lang['cannot-bind-twice']) 
        return;
      }
      let res = await setBroker(wallet.detail.chainId,wallet.detail.account,address)
      console.log(res)
      if(!res.success){
        alert(lang['bind-faild'])
      }
      if(res.success){
        setIsBind(true)
      }
    }
  }

  const getBroker = async() =>{
    let path = `/broker/${wallet.detail.account}/get_broker`
    let res =  await fetchRestApi(path)
    if(res.data){
      if(res.data.length){
        setIsBind(true)
      }else{
        setIsBind(false)
      }
    }else{
      setIsBind(false)
    }
  }

  const addressChange = event =>{
    let {value} = event.target
    setAddress(value)
  }
  useEffect(()=>{
    getBroker();
  },[wallet.detail])
  return(
    <div className='broker-bind'>
      <div className='header'>
        {lang['brokers-address']}
      </div>
      <div className='bind-input'>
        <div className='address'>
          <input className='address-input' type='text'
          placeholder={lang['address']}
          value={address}   
          onChange={event =>  addressChange(event) }
          />
        </div>
        <div className='bind-button'>
          <Button className='btn' btnText={lang['bind']} lang={lang} click={BindBroker} />
        </div>
      </div>
    </div>
  )
}
export default inject('wallet')(observer(Bind))