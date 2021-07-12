import React , {useState,useEffect}from 'react'
import v1Img from '../../assets/img/v1.png'
import v2Img from '../../assets/img/v2.png'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { useRouteMatch } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import { addParam, hasParam, getParam } from '../../utils/utils';

function Version({wallet,version}){
  const isLite = useRouteMatch('/lite')
  const isPro = useRouteMatch('/pro')
  const [enabled, setEnabled] = useState(false)


  const switchVersion = () => {
    version.switch();
    const url = addParam('version',version.current);
    window.location.href = url;
  }

  // useEffect(() => {
  //   //如果url带有version参数优先使用
  //   if(hasParam('version')){
  //     version.setCurrent(getParam('version'))
  //   }
  //   return () => {};
  // }, [window.location.href]);


  useEffect(() => {
    if(wallet.supportAllVersion){
      if(hasParam('version')) {
        version.setCurrent(getParam('version'))
      } else {
        version.setCurrent('v2')
      };
    } else {
      if(wallet.supportV1 && !wallet.supportV2){
        version.setCurrent('v1')
      } else if(wallet.supportV2 && !wallet.supportV1){
        version.setCurrent('v2')
      } else {
        version.setCurrent('v1')
      } 
    }
    return () => {}
  }, [wallet.detail.chainId])

  //处理是否显示版本切换功能
  useEffect(() => {
    let isShow = isLite || isPro
    if(wallet.detail){
      isShow = wallet.supportAllVersion && isShow
    }
    setEnabled(isShow)
    return () => {}
  }, [window.location.href,wallet.detail.chainId])

  return (
    enabled ? 
      (<div className='version'>
        {version.isV1 ? <img src={v1Img} onClick={switchVersion} alt='Switch V2'/> : <img onClick={switchVersion}  src={v2Img} alt='Switch V1'/>}
      </div>)
    :
      null
    )
}
export default inject('wallet','version')(observer(Version))