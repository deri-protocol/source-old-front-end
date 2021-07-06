import useMiningPool from '../../../hooks/useMiningPool';
import { inject, observer } from 'mobx-react';
import Pool from '../../../components/Pool/Pool';
import './pool.less'
import './zh-pool.less'


function PoolList({lang}){
  const [loaded,pools,v1Pools,v2Pools] = useMiningPool(true);
  return (
    <div className="pool-list">
      <Pool info={v2Pools} lang={lang}/>
      <Pool info={v1Pools} lang={lang}/>
      {!loaded && <div className="loading">
        <span
          className="spinner spinner-border spinner-border-sm">
          </span>
        </div>} 
    </div>
  )
}
export default inject('version')(observer(PoolList))