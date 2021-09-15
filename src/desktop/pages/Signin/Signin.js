/* eslint-disable import/no-anonymous-default-export */
import Sign from '../../../components/SignIn/Signin'
import './signin.less'

export default function({lang}){
  return(
    <div>
      <Sign lang={lang} />
    </div>
  )
}