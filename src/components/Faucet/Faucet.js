import React,{useEffect,useState} from 'react'
import {inject,observer} from 'mobx-react'

function Faucet({wallet={},lang}){
  return(
    <div className='faucet-box'>

    </div>
  )
}

export default inject('wallet')(observer(Faucet))