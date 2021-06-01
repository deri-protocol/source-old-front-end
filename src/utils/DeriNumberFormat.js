import React,{useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'

export default function DeriNumberFormat(props){
  const [renderablity, setRenderablity] = useState('--');

  useEffect(() => {
    const {allowZero,...others} = props 
    if(((props.value && props.value !== '' && props.value !== 'NaN')|| ((Math.abs(props.value)) === 0 && allowZero === true))) {
      setRenderablity(<NumberFormat {...others} displayType = 'text' />)
    } 
    return () => {};
  }, [props.value]);

  return renderablity;
}