import React from 'react'
import v1Img from '../../../assets/img/v1.png'
import v2Img from '../../../assets/img/v2.png'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

function Version({version}){
  return (
    <div className='version'>
      {version.isV1 ? <img src={v1Img} onClick={() => version.switch()}/> : <img onClick={() => version.switch()}  src={v2Img}/>}
    </div>
    )
}
export default inject('version')(observer(Version))