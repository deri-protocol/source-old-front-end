import useMiningPool from '../../../hooks/useMiningPool';
import { inject, observer } from 'mobx-react';
import PoolGroup from '../../../components/Pool/PoolGroup';
import './poolList.less'
import './zh-pool.less'


function PoolList({lang}){
  const [loaded,pools,v1Pools,v2Pools] = useMiningPool(true);
  return (
    <div className="pool-list">
      <PoolGroup info={v2Pools} lang={lang}/>
      <PoolGroup info={v1Pools} lang={lang}/>
      {!loaded && <div className="loading">
        <span
          className="spinner spinner-border spinner-border-sm">
          </span>
        </div>} 
    </div>
  )
}
export default inject('version')(observer(PoolList))