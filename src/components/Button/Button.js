import {useState,useRef} from 'react';
export default function Button({btnText,className,click,afterClick}){
  const [status, setStatus] = useState('enabled');
  const loadRef = useRef(null)

  const onClick = async () => {
    if(status !== 'enabled') {
      return ;
    }
    setStatus('disabled')
    loadRef.current && (loadRef.current.style.display = 'inline-block')
    const result = await click();
    loadRef.current && (loadRef.current.style.display = 'none')
    setStatus('enabled')
    if(result){
      afterClick && afterClick()
    }
  }

  return(
    <button className={className} onClick={onClick} >
        <span className='btn-loading-wrap'>
          <span ref={loadRef}
            className='spinner spinner-border spinner-border-sm'
            style={{display : 'none' ,marginRight : '2'}}>
          </span>
        </span>
          {btnText}
        </button>
  )
}