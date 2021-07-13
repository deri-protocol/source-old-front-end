import PoolBox from '../../../../components/Pool/legacy/LegacyPoolBox';
import useMiningPool from '../../../../hooks/useMiningPool';
import './pool.less'
import './zh-pool.less'
import { inject, observer } from 'mobx-react';


function Pool({version,lang}){
  const [loaded,pools,v1Pools,v2Pools,legacy,premining] = useMiningPool(version);
  return (
    <div className='retired'>
      <div className='retired-title'>
        <div className='retired-pools'>{lang['retired-pools']}</div>
        {lang['retired-text']}
        <a href="https://app.deri.finance/#/mining">{lang['new-pools']}</a>
      </div>
      <div className="mining-info">
        <div className='pools'>
          {legacy.map((pool,index) => <PoolBox pool={pool} key={index} lang={lang}/>)}
          {!loaded && <div className="loading">
            <span
              className="spinner spinner-border spinner-border-sm">
              </span>
            </div>}  
        </div>
      </div>
      <div className='retired-title premining'>
        {lang['premining-pools']}
        <span className='premining-finished'>
          {lang['premining-finished']}
        </span>
      </div>
      <div className="mining-info">
        <div className='pools'>
          {premining.map((pool,index) => <PoolBox pool={pool} key={index} lang={lang}/>)}
          {!loaded && <div className="loading">
            <span
              className="spinner spinner-border spinner-border-sm">
              </span>
            </div>}  
        </div>
      </div>
    </div>
    
  )
}
export default inject('version')(observer(Pool))