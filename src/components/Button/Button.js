import {useState,useRef} from 'react';
export default function Button({btnText,className,disabled,click,afterClick}){
  const [status, setStatus] = useState(disabled ? 'disabled' : 'enabled');
  const [pending, setPending] = useState(false);
  const loadRef = useRef(null)

  const onClick = async () => {
    if(status !== 'enabled') {
      return ;
    }
    setStatus('disabled')
    setPending(true);
    loadRef.current && (loadRef.current.style.display = 'inline-block')
    const result = await click();    
    if(result){
      afterClick && afterClick()
    } 
    loadRef.current && (loadRef.current.style.display = 'none')
    setStatus('enabled')
    setPending(false);
  }

  return(
    <button className={className} onClick={onClick} >
        <span className='btn-loading-wrap'>
          <span ref={loadRef}
            className='spinner spinner-border spinner-border-sm'
            style={{display : 'none' ,marginRight : '2'}}>
          </span>
        </span>
          {pending ? 'Pending' : btnText  }
        </button>
  )
}