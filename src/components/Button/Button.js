import {useState,useRef,useEffect} from 'react';
import { isUnlocked, unlock } from '../../lib/web3js/v2';
export default function Button({btnText,className,disabled,click,afterClick,checkApprove,wallet,spec}){
  const [status, setStatus] = useState(disabled ? 'disabled' : 'enabled');
  const [isApproved, setIsApproved] = useState(true);
  const [pending, setPending] = useState(false);
  const loadRef = useRef(null)

  const onClick = async () => {
    if(status !== 'enabled') {
      return ;
    }
    beforeAction()
    const result = await click();    
    if(result){
      afterClick && afterClick()
    } 
    afterAction()
  }

  const beforeAction = ()  => {
    setStatus('disabled')
    setPending(true);
    loadRef.current && (loadRef.current.style.display = 'inline-block')
  }

  const afterAction = () => {
    loadRef.current && (loadRef.current.style.display = 'none')
    setStatus('enabled')
    setPending(false);
  }

  const loadApproveStatus = async () => {
    if(checkApprove && wallet && wallet.detail.account && spec.bTokenId){
      const res = await isUnlocked(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.bTokenId)
      setIsApproved(res);
    }
  }
  const approve = async () => {
    beforeAction();
    const res = await unlock(wallet.detail.chainId,spec.pool,wallet.detail.account,spec.bTokenId);
    if(res.success){
      setIsApproved(true);
    } else {
      setIsApproved(false)
      alert('Approve faild')
    }
    afterAction();
  }

  const action = () => {
    if(isApproved){
      onClick();
    } else {
      approve();
    }
  }

  useEffect(() => {
    loadApproveStatus();
    return () => {};
  }, [wallet,spec,checkApprove]);

  return(
    <button className={className} onClick={action} >
        <span className='btn-loading-wrap'>
          <span ref={loadRef}
            className='spinner spinner-border spinner-border-sm'
            style={{display : 'none' ,marginRight : '2'}}>
          </span>
        </span>
          {pending ? 'PENDING' : (isApproved ? btnText : 'APPROVE')  }
        </button>
  )
}