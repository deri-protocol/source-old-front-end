import React from 'react'
import NumberFormat from 'react-number-format'

export default class DeriNumberFormat extends React.Component {


  format(val){    
    //把非数字过滤
    const trimed = val.replace(/\W+/g,'')
    if((+trimed === 0) ){
      return '--';
    } else {
      return val;
    }
  }

  render(){
    const props = {
      renderText : this.format,
      displayType : 'text',
      ...this.props
    }
    return(
      <NumberFormat {...props} />
    )
  }
}