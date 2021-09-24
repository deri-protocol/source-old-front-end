/* eslint-disable import/no-anonymous-default-export */

import Faucet from '../../../components/Faucet/Faucet'
import './faucet.less'
export default function({lang}){
  return(
    <div>
      <Faucet lang={lang} />
    </div>
  )
}