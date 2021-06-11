import React from 'react'
import { inject, observer } from 'mobx-react';

const withLanguage =  Component => {
  class WithLanguage extends React.Component {
    render(){
      const {intl,...props} = this.props
      return (
      <Component {...props} dict={intl.dict}/>
      )
    }
  }
  return inject('intl')(observer(WithLanguage)) ;
}

export default withLanguage
