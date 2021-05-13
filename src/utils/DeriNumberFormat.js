import React,{useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'

export default function DeriNumberFormat(props){
  const [renderablity, setRenderablity] = useState('--');

  useEffect(() => {
    if((props.value || ((Math.abs(props.value)) === 0 && props.allowZero === true))) {
      setRenderablity(<NumberFormat {...props} displayType = 'text' />)
    } 
    return () => {};
  }, [props.value]);

  return renderablity;
}