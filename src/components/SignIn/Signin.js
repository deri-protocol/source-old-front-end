import React ,{useEffect,useState} from 'react'
import {inject,observer} from 'mobx-react'
import success from './img/success.svg'
import undone from './img/undone.svg'
import right from './img/right.svg'
import {
  DeriEnv
} from "../../lib/web3js/indexV2";
import Button from '../Button/Button'
function Signin({wallet={},lang}){
  const isDev = DeriEnv.get() == 'dev' ? false : true;
  const spec =  isDev?{
    "pool":"0x19c2655A0e1639B189FB0CF06e02DC0254419D92",
    "bTokenId":"0"
  }:{
    "pool":"0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5",
    "bTokenId":"0"
  }
  const [isApprove, setIsApprove] = useState(true);
  const [isClaim,setIsClaim] = useState(false);
  const [isNowSign,setIsNowSign] = useState(false);
  const [actionElement,setActionElement] = useState(<Button className='btn'  btnText={lang['connect-wallet']}></Button>)
  const [isSignIn,setIsSignIn] =useState({
    'one':false,
    'two':false,
    'three':false,
  })
  const [isTrade,setIsTrade] =useState({
    'one':false,
    'two':false,
    'three':false,
  })
  const hasConnectWallet = () => wallet && wallet.detail && wallet.detail.account
  
  const loadApprove = async ()=>{
    if(hasConnectWallet() && spec){
      const result = await wallet.isApproved(spec.pool,spec.bTokenId)
      setIsApprove(result);
    }
  }

  const connect = () => {
    wallet.connect()
  }

  const SignIn = async ()=>{
    if((+wallet.detail.formatBalance) < 0.2){
      alert(lang['less-bnb'])
    }
    if(isNowSign){
      alert(lang['use-a-new-address'])
    }
  }

  const claimPtoken = async ()=>{

  }

  const approve = async () => {
    const res = await wallet.approve(spec.pool,spec.bTokenId)
    if(res.success){
      setIsApprove(true);
      loadApprove();
    } else {
      setIsApprove(false);
      alert(lang['approve-failed']);
    }
  }
  
  useEffect(() => {
      loadApprove();
  }, [wallet.detail,spec]);
  let element;
  useEffect(()=>{
    if(hasConnectWallet()){
      if(isSignIn.three){
        if(!isApprove) {
          element = <Button className='btn' btnText={lang['approve']} click={approve} lang={lang}/>
        }else{
          element = <Button className='btn' btnText={lang['claim']} click={claimPtoken}  lang={lang}/>
        }
      }else{
        element = <Button className='btn btn-danger connect' click={SignIn} btnText={lang['sign-in']}  lang={lang} />
      }
      if(isClaim){
        element = <a href='https://app.deri.finance/#/lite'>{lang['trade']}</a>
      }
    } else {
      element = <Button className='btn btn-danger connect' btnText={lang['connect-wallet']} click={connect} lang={lang} />
    }
    setActionElement(element) 
  },[wallet.detail,isApprove,isSignIn,isClaim])
  
  return(
    <div className='signin'>
      <div className='title'>
        <div>
          {lang['title-three']}
        </div>
        
      </div>
      <div className='user-tasks'>
        <div className='header'>
          {lang['header']}
        </div>
        <div className='content'>
          <div className='content-text'>
            <div className='left'>
              <div className='signin-title'>
                {lang['sign-in']}
              </div>
              <div className='signined'>
                {isSignIn.one?<img src={success} />:<img src={undone} />} 
                {isSignIn.two?<img src={success} />:<img src={undone} />} 
                {isSignIn.three?<img src={success} />:<img src={undone} />} 
              </div>
            </div>
            <div className='center'>
              <div className='point'></div>
              <div className='point'></div>
              <div className='point'></div>
              <div className='claim-ptoken-text'>
                {lang['claim-ptoken']}
              </div>
              <div className='point'></div>
              <div className='point'></div>
              <div className='right-arr'>
                <img src={right} />
              </div>
            </div>
            <div className='right'>
            <div className='signin-title'>
                {lang['trade']}
              </div>
              <div className='signined'>
                {isTrade.one?<img src={success} />:<img src={undone} />} 
                {isTrade.two?<img src={success} />:<img src={undone} />} 
                {isTrade.three?<img src={success} />:<img src={undone} />} 
              </div>
            </div>
          </div>
          <div className='button'>
            {actionElement}
          </div>
        </div>
        
      </div>
      <div className='h2'>
          {lang['title-one']}
          <span className='title-num'>
            {lang['title-num']}
          </span>
          <span className='in-deri'>
            {lang['title-two']}
          </span>
          <div className='text'>
          {lang['title-frou']}
        </div>
        </div>
      <div className='rules'>
        <div className='rules-title'>
          {lang['who-are-eligibles']}
        </div>
        
        <div className='text'>
          {lang['rules-one']}
        </div>
        <div className='text'>
          {lang['rules-two']}
        </div>
        <div className='rules-title'>
          {lang['how-to-participate']}
        </div>
        <div className='text'>
          {lang['step-one']}
        </div>
        <div className='text'>
          {lang['step-two']}
        </div>
        <div className='text'>
          {lang['step-three']}
        </div>
        <div className='text'>
          {lang['description']}
        </div>
      </div>
  </div>
  )
}
export default inject("wallet")(observer(Signin))