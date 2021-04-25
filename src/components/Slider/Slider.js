import RcSlider from 'rc-slider'
import 'rc-slider/assets/index.css';

const Range = RcSlider.createSliderWithTooltip(RcSlider.Range);

export default function Slider(){
  return (
    <RcSlider 
      defaultValue={30}
      min={0}
      max={100}
      
      railStyle={{ 
        // position: 'relative',
        margin: '13px auto',
        width: '517px',
        height: '6px',
        backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVYAAAAGCAYAAACYVrbAAAABVklEQVRoQ+3YQWrCQBQG4HmTMsEkYpLOKBNGDVnqJdx20zOIVyjopnfwEJ6jXSi4d+0hIhFRBpOWaV10Y73A/2B4s/74+RmG2O8EjDH/dv+6bSwIQAACELgjEMcxi6KI93o9Hoahsta+WGt1VVXv9KdUG8aYK1W33aBgESkIQAACdwSUUpSmKfX7fZ5l2VO32/W22+3b5XKJyBiTcs6/hBC1EKJptVqNEAKlijhBAAIQ+EfAWkuj0Yi01jwIAk9K6W02m+F+v/+gyWQifd9vpJRXrXWdZdnPizVJEpQrYgUBCEDgjkBZlhSGIeV5Tp1Oxzufz3y1Wg13u90nzWazdpIkvjHmWhRFned5o5RCqSJOEIAABB4IcM7JHTdVVfHpdLo4nU5t98fK5vN5ezAYiPF4XBtjmjiOUayIFAQgAIEHAofDwf2zsuVy+bxer1+Px2NRluXiG/F4WkFqCEA1AAAAAElFTkSuQmCC)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        /* box-shadow: -2px -2px 2px #212224, 2px 2px 2px #353537; */
        borderRadius: '2px',
        cursor: 'pointer'
      }}
      trackStyle={{ 
        // position: 'absolute',
        left: 0,
        top: 0,
        height: '6px',
        borderRadius: '10px',
        opacity: '0.35',
        background: '-webkit-gradient(linear, right top, left top, from(#FFFFFF), to(#246CAD))',
        background: 'linear-gradient(270deg, #FFFFFF 0%, #246CAD 100%)'
      }}
      handleStyle={{    
        width: '24px',
        height: '24px',
        background: '#246CAD',
        borderRadius: '50%;'
    }} />
  )
}