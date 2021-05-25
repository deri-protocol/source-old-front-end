import React from 'react'
import v1Img from '../../assets/img/v1.png'
import v2Img from '../../assets/img/v2.png'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

function Version({version}){
  const switchVersion = () => {
    version.switch()
    window.location.reload();
  }
  return (
    <div className='version'>
      {version.isV1 ? <img src={v1Img} onClick={switchVersion} alt='Switch V2'/> : <img onClick={switchVersion}  src={v2Img} alt='Switch V1'/>}
    </div>
    )
}
export default inject('version')(observer(Version))