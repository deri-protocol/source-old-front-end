import PoolBox from "../../../components/Pool/PoolBox";
import PoolPlacehold from "../../../components/Mining/Pool/PoolPlacehold";

export default function Card({optionPools,v1Pools,v2Pools,openPools,type,lang}){
  return(
    <div>
      {type === '' && <div className='official-pool'>
        <div className='pools'>
          {optionPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className="pools">
          {v2Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className='pools'>
          {v1Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </div>}
      {type === 'options' && <div className='official-pool'>
        <div className='pools'>
          {optionPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </div>}
      {type === 'futures' && <div className='official-pool'>
        <div className="pools">
          {v2Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className='pools'>
          {v1Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </div>}
      {type === 'opens' && <div className='pools open-pool'>
        {openPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        {openPools.length > 0 && <PoolPlacehold lang={lang}></PoolPlacehold>}
      </div>}
    </div>
  )
}