import PoolBox from '../../../components/Pool/PoolBox';
import useMiningPool from '../../../hooks/useMiningPool';
import './pool.less'


export default function Pool(){
  const [loaded,pools] = useMiningPool();
  return (
    <div className="mining-info">
      <div className="pools">
        {pools.map((pool,index) => <PoolBox pool={pool} key={index}/>)}
        {!loaded && <div className="loading">
          <span
            className="spinner spinner-border spinner-border-sm">
            </span>
          </div>}  
      </div>
    </div>
  )
}