import React , {useEffect}from 'react'
import v1Img from '../../assets/img/v1.png'
import v2Img from '../../assets/img/v2.png'
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

function Version({wallet,version}){
  const switchVersion = () => {
    if(wallet.isConnected() && !wallet.supportV2){
      version.setCurrent('v1')
      alert('Deri v2 just support BSC chain');
      return;
    }
    version.switch()
    window.location.reload();
  }

  useEffect(() => {
    if(wallet.detail.chainId){
      if(!wallet.supportV2){
        version.setCurrent('v1',true)
      } else {
        if(!version.current){
          if(wallet.supportV2) {
            version.setCurrent('v2')
          } else {
            version.setCurrent('v1')
          }
        }
      }
    }
    return () => {};
  }, [wallet.detail.chainId]);

  return (
    <div className='version'>
      {version.isV1 ? <img src={v1Img} onClick={switchVersion} alt='Switch V2'/> : <img onClick={switchVersion}  src={v2Img} alt='Switch V1'/>}
    </div>
    )
}
export default inject('wallet','version')(observer(Version))