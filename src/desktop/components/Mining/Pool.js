import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import './pool.less'
import { inject, observer } from 'mobx-react';


function Pool({version,lang}){
  const [loaded,pools] = useMiningPool(version);
  return (
    <div className="mining-info">
      <div className="pools">
        {pools.map((pool,index) => <PoolBox pool={pool} key={index} lang={lang}/>)}
        {!loaded && <div className="loading">
          <span
            className="spinner spinner-border spinner-border-sm">
            </span>
          </div>}  
      </div>
    </div>
  )
}
export default inject('version')(observer(Pool))