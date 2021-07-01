import React , {useState,useEffect}from 'react'
import v1Img from '../../assets/img/v1.png'
import v2Img from '../../assets/img/v2.png'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { useRouteMatch } from 'react-router-dom';
import { restoreVersion } from '../../utils/utils';

function Version({wallet,version}){
  const isLite = useRouteMatch('/lite')
  const isPro = useRouteMatch('/pro')
  const [enabled, setEnabled] = useState(false)

  const switchVersion = () => {
    if(wallet.isConnected() && !wallet.supportV2){
      version.setCurrent('v1')
      alert('No V2 pool on this network yet');
      return;
    }
    version.switch()
    window.location.reload();
  }

  useEffect(() => {
    if(wallet.detail.chainId){
      const versionFromSession = restoreVersion();
      if(!versionFromSession || !wallet.supportAllVersion) {
        if(wallet.supportV1 && !wallet.supportV2){
          version.setCurrent('v1')
        } else if(wallet.supportV2 && !wallet.supportV1){
          version.setCurrent('v2')
        }
      } else {
        version.setCurrent(versionFromSession);
      }
    }
    return () => {};
  }, [wallet.detail.chainId]);

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