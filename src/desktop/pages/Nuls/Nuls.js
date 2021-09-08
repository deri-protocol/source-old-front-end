/* eslint-disable import/no-anonymous-default-export */
import Nuls from '../../../components/Nuls/Nuls'
import './nuls.less'

export default function({lang}){
  return(
    <div>
      <Nuls lang={lang} />
    </div>
  )
}