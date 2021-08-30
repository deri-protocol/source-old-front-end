import {useState,useEffect} from 'react';
import { inject, observer } from 'mobx-react';
import StepWizard from "react-step-wizard";

function AddPool(){
  return(
    <div>
      <div className='header'></div>
    </div>
  )
}

export default inject('wallet', 'trading')(observer(AddPool))