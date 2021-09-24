import React, { useState, useEffect } from 'react'
import PoolBox from "../../../components/Pool/PoolBox";
import PoolPlacehold from "../../../components/Mining/Pool/PoolPlacehold";
// import { usePoolConfig } from '../../../hooks/usePoolConfig';

export default function Card({type,lang}){
  // const poolConfigs = usePoolConfig(type);
  
  return(
    <div>
      {/* {type === '' && <div className='official-pool'>
        <div className='pools'>
          {poolConfigs.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className="pools">
          {poolConfigs.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
        <div className='pools'>
          {poolConfigs.map((pool,index) => <PoolBox group={pool} key={index} lang={lang}/>)}
        </div>
      </div>} */}
     
    </div>
  )
}