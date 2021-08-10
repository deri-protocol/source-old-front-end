import PoolBox from "../../../components/Pool/PoolBox";

export default function Card({optionPools,v1Pools,v2Pools,type,lang}){
  return(
    <div>
      {type === 'all' && <>
        <div className="pools">
          {v2Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className='pools'>
          {v1Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </>}
      {type === 'options' && <>
        <div className='pools'>
          {optionPools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </>}
      {type === 'futures' && <>
        <div className="pools">
          {v2Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className='pools'>
          {v1Pools.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </>}
    </div>
  )
}