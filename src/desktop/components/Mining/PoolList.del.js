import PoolGroup from '../../../components/Pool/PoolGroup';
import useMiningPool from '../../../hooks/useMiningPool';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';


function Pool({version,lang}){
  const [loaded,pools,v1Pools,v2Pools] = useMiningPool(version);
  return (
    <div className="mining-info">
      <div className="pools">
        {v2Pools.map((pool,index) => <PoolGroup pool={pool} key={index} lang={lang}/>)}
        {!loaded && <div className="loading">
          <span
            className="spinner spinner-border spinner-border-sm">
            </span>
          </div>}  
      </div>
      <div className='pools'>
        {v1Pools.map((pool,index) => <PoolGroup pool={pool} key={index} lang={lang}/>)}
      </div>
    </div>
  )
}
export default inject('version')(observer(Pool))