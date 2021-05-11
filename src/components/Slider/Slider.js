import React, { useState,useEffect } from 'react'
import RcSlider,{SliderTooltip} from 'rc-slider'
import 'rc-slider/assets/index.css';
import './slider.less'
const { Handle } = RcSlider;


 function handle(props){
  const { value, dragging, index, ...restProps } = props;
  return (
    <SliderTooltip
      prefixCls="rc-slider-tooltip"
      overlay={!!value ? value : ''}
      placement="top"
      key={index}
      visible={!!value ? true : false}
      overlayStyle={{display : 'block'}}
      overlayInnerStyle={{color : '#569BDA',background : 'none',display : 'block' ,fontSize : '10px',boxShadow : 'none'}}
    >
      <Handle value={value} {...restProps} />
    </SliderTooltip>
  );
};


export default function Slider({max,start,onValueChange,freeze}){
  const [limit, setLimit] = useState(0);
  const [value, setValue] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [marks, setMarks] = useState({});

  const onSliderChange = value => {
    setValue(value)
    onValueChange(value);
  }

  useEffect(() => {
    setDisabled(freeze)
    return () => { };
  }, [freeze]);

  useEffect(() => {
    if(isNaN(max)){
      setLimit('')
    }  else {
      if((+max) > 0){
        setDisabled(false)
      } else {
        setDisabled(true)
      }
      const mark = {
      };
      const per = (+max) / 10
      for(let i = 0 ; i<=10 ; i++){
        if(i === 0 || i ===10 ){
          const style = {top: '-16px',position: 'relative'}
          if(i ===10){
            style.width = 100;
            style.left = '-10px'
            style.paddingRight = '10px'            
          }
          mark[i*per] = <><div style={style}>{i === 10 ? (i*per).toFixed(2) : i * per}</div><div style={{top: '-16px',position: 'relative'}}>l</div></>
        } else{
          mark[i*per] = 'l'
        }
        
      }
      setMarks(mark);
      setLimit(+max)
    }

    return () => {};
  }, [max]);

  useEffect(() => {
    if(isNaN(start)){
      setValue(0)
    } else {
      setValue(start)
    }
    return () => {      
    };
  }, [start]);

  return (
      <RcSlider
        handle={handle}
        className='deri-slider' 
        start={start}
        min={0}
        max={limit}
        value={value}
        onChange={onSliderChange}
        disabled={disabled}
        overlay={value}
        step={0.01}
        marks={marks}
       >
      </RcSlider>
  )
}