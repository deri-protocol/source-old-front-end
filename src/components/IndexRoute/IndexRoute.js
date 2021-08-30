import { Redirect } from "react-router-dom";

export default function IndexRoute(){
  const url = window.location.href;
  if(/^https?:\/\/(app|alphatest|testnet)/.test(url)) {
    return  <Redirect to='/futures/pro'/> 
  } else if(/^https?:\/\/governance/.test(url)) {
    return  <Redirect to='/governance'/> 
  } else if(/^https?:\/\/bridge/.test(url)) {
    return  <Redirect to='/bridge'/> 
  } 
  return <Redirect to='/index'/>
}