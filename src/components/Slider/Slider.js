import React, { useState,useEffect } from 'react'
import RcSlider,{createSliderWithTooltip} from 'rc-slider'
import 'rc-slider/assets/index.css';
import './slider.less'


const SliderWithTooltip = createSliderWithTooltip(RcSlider);

export default function Slider({max,defaultValue,onValueChange}){
  const [limit, setLimit] = useState(0);
  const [value, setValue] = useState(defaultValue);

  const onSliderChange = value => {
    setValue(value)
    onValueChange && onValueChange();
  }

  useEffect(() => {
    setLimit(+max)
    return () => {};
  }, [max]);

  useEffect(() => {
    setValue(defaultValue)
    return () => {      
    };
  }, [defaultValue]);

  return (
      <RcSlider
        className='deri-slider' 
        min={0}
        max={limit}
        value={value}
        onChange={onSliderChange}
        overlay={value}
       >
        <div className='rc-slider-text'><span>0</span><span>{max}</span></div>        
        <div className='m-rc-slider-mark'>
          <span style={{left:0}}>l</span>
          <span style={{left:'10%'}}>l</span>
          <span style={{left:'20%'}}>l</span>
          <span style={{left:'30%'}}>l</span>
          <span style={{left:'40%'}}>l</span>
          <span style={{left:'50%'}}>l</span>
          <span style={{left:'60%'}}>l</span>
          <span style={{left:'70%'}}>l</span>
          <span style={{left:'80%'}}>l</span>
          <span style={{left:'90%'}}>l</span>
          <span style={{left:'99%'}}>l</span>
        </div>
      </RcSlider>
  )
}