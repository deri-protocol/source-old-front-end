import React ,{useEffect,useState} from 'react'
import {inject,observer} from 'mobx-react'
import dateFormat from 'date-format'
import success from './img/success.svg'
import undone from './img/undone.svg'
import right from './img/right.svg'
import {
  DeriEnv,
  airdropPToken,
¬†¬†isUserPTokenExist,
  fetchRestApi,
  getAirdropPTokenWhitelistCount,
  getTradeHistory
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
  const [isThanFiveThousand,setIsThanFiveThousand] = useState(false)
  const [isClaim,setIsClaim] = useState(false);
  const [isHavePtoken,setIsHavePtoken] = useState(false);
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
      const result = await wallet.isApproved(spec.pool,spec.bTokenId);
      setIsApprove(result);
    }
  }

  const connect = () => {
    wallet.connect()
  }

  const getIsThanFiveThousand = async () =>{
    let res = await getAirdropPTokenWhitelistCount(wallet.detail.chainId)
    if(+res>=4999){
      setIsThanFiveThousand(true)
    }
  }

  const getIsClaimed = async () => {
    let path = `/ptoken_airdrop/${wallet.detail.account}/is_claimed`;
    let res = await fetchRestApi(path)
    setIsClaim(res.data)
  }

  const getStamp = async () => {
    let path = `/ptoken_airdrop/${wallet.detail.account}/signin_status`
    let res = await fetchRestApi(path)
    let timestamp = Date.parse(new Date());
    let nowDate = dateFormat.asString('yyyy-MM-dd',new Date(parseInt(timestamp)))
    let arr = [] 
    res.data.map(item=>{
      let obj = false;
      if(item.date == nowDate){
        setIsNowSign(item.signin)
      }
      if(item.signin){
        obj = item.signin;
        arr.push(obj)
      }
    });
    if(arr.length){
      setIsSignIn({
        'one':arr[0],
        'two':arr[1],
        'three':arr[2],
      })
    }
  }

  const getIsTrade = async () => {
      let resBTC = await getTradeHistory(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.bTokenId)
      let resETH = await getTradeHistory(wallet.detail.chainId,spec.pool,wallet.detail.account,"1")
      let resBNB = await getTradeHistory(wallet.detail.chainId,spec.pool,wallet.detail.account,"2")
      let res = resBTC.concat(resETH,resBNB);
      let obj = {}
      if(isSignIn.three){
        if(res.length == 1){
          obj = {
            'one':true,
            'two':false,
            'three':false,
          }
        }else if(res.length == 2){
          obj = {
            'one':true,
            'two':true,
            'three':false,
          }
        }else if(res.length >= 3){
          obj = {
            'one':true,
            'two':true,
            'three':true,
          }
        }
        setIsTrade(obj)
      }
  }

  const signIn = async ()=>{
    if(wallet.detail.chainId != 56){
      alert(lang['please-switch-to-bsc']);
      return;
    }
    if(+(wallet.detail.formatBalance)<=0.2){
      alert(lang['less-bnb'])
      return;
    }
    if(isHavePtoken){
      alert(lang['use-a-new-address'])
      return;
    }
    if(isNowSign){
      alert(lang['already-stamped-today'])  
      return;
    }
    let path = `/ptoken_airdrop/${wallet.detail.account}/signin`
    let res = await fetchRestApi(path,{ method: 'POST' });
    if(!res.success){
      if(res.error.indexOf('insufficent¬†user¬†balance')!= 0){
        alert(lang['less-bnb'])
        return;
      }
      alert(lang['sign-in-failed'])
    }
    getStamp();
    return;
  }

  const claimPtoken = async ()=>{
    if(wallet.detail.chainId != 56){
      alert(lang['please-switch-to-bsc']);
      return;
    }
    if(isHavePtoken){
      alert(lang['use-a-new-address'])
      return;
    }
    if(+(wallet.detail.formatBalance) <= 0.2){
      alert(lang['less-bnb'])
      return;
    }
    let res = await airdropPToken(wallet.detail.chainId,wallet.detail.account);
    if(!res.success){
      alert['claim-failed']
    }else{
      alert(['claim-success'])
      setIsClaim(true)
    }
  }

  const isPtoken = async ()=>{
    let res = await isUserPTokenExist(wallet.detail.chainId,spec.pool,wallet.detail.account)
    setIsHavePtoken(res)
  }

  const approve = async () => {
    if(wallet.detail.chainId != 56){
      alert(lang['please-switch-to-bsc']);
      return;
    }
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
    if(hasConnectWallet()){
      loadApprove();
      isPtoken();
    }
  }, [wallet.detail,spec,isSignIn]);

  useEffect(()=>{
    if(hasConnectWallet()){
      getStamp();
      getIsClaimed();
      getIsThanFiveThousand();
    }
  },[wallet.detail])
  useEffect(()=>{
    if(hasConnectWallet()){
      getIsTrade();
    }
  },[wallet.detail,isSignIn])
  useEffect(()=>{
    let element;
    let timestamp = new Date()
    //1627725600000
    if(timestamp.getTime() <= 1627725600000){
      if(hasConnectWallet()){
        if(isSignIn.three){
          if(!isApprove) {
            element = <Button className='btn' btnText={lang['approve']} click={approve} lang={lang}/>
          }else if(isClaim || isThanFiveThousand){
            element = <a className='btn' target="_blank" href='https://app.deri.finance/#/lite'>{lang['trade']}</a>
          }else{
            element = <Button className='btn' btnText={lang['claim']} click={claimPtoken}  lang={lang}/>
          }
        }else{
          element = <Button className='btn btn-danger connect' click={signIn} btnText={lang['sign-in']}  lang={lang} />
        }
        
      } else {
        element = <Button className='btn btn-danger connect' btnText={lang['connect-wallet']} click={connect} lang={lang} />
      }
    }else{
      element = <button className='btn btn-danger connect disbutton' disabled  >{lang['activity-ends']} </button>
    }
    
    setActionElement(element) 
  },[wallet.detail,isApprove,isSignIn,isHavePtoken,isClaim,isThanFiveThousand])
  
  return(
    <div className='signin'>
      <div className='title'>
        <div>
          {lang['title-three']}
        </div>
        <div className='time'>
          {lang['title-five']}
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
          {isThanFiveThousand? <div className='exceed'>{lang['exceed-participants']}</div>:''}
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
        <div className='text'>
          {lang['rules-three']}
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
          {lang['step-four']}
        </div>
        
      </div>
  </div>
  )
}
export default inject("wallet")(observer(Signin))