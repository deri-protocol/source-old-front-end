import React,{useState,useEffect} from 'react'
import { inject, observer } from 'mobx-react';

function Trading ({wallet,lang}){
  return(
    <div>

    </div>
  )
}

export default inject('wallet')(observer(Trading))

