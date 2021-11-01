import React,{useState,useEffect} from 'react'
import NumberFormat from 'react-number-format'

export default function DeriNumberFormat(props){
  const [renderablity, setRenderablity] = useState(<span className='loading-line'></span>);

  useEffect(() => {
    const {allowZero,...others} = props 
    if(((typeof props.value !== 'object' && props.value !== undefined && props.value !== '' && props.value !== 'NaN') || ((isNaN(props.value) && Math.abs(props.value)) === 0 && allowZero === true ))) {
      setRenderablity(<NumberFormat {...others} displayType = 'text'  fixedDecimalScale={true} />)
    } 
    return () => {};
  }, [props.value]);

  return renderablity;
}