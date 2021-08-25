import React, { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react"
import symbolArrowIcon from '../../assets/img/symbol-arrow.svg'
import classNames from 'classnames';

function SymbolSelector({trading,version,setSpec,spec,loading,type}) {
  const [dropdown, setDropdown] = useState(false);  
  const selectClass = classNames('dropdown-menu',{'show' : dropdown})


  const onDropdown = (event) => {
    if(trading.configs.length > 0){
      event.preventDefault();
      setDropdown(!dropdown)    
    }
  }

  //切换交易标的
  const onSelect = select => {
    const selected = trading.configs.find(config => config.pool === select.pool && select.symbolId === config.symbolId )
    if(selected){
      loading.loading();
      trading.pause();
      setSpec(selected)
      trading.onSymbolChange(selected,() => loading.loaded(),type.isOption);
      setDropdown(false)
    } 
  }

  useEffect(() => {
    document.body.addEventListener('click',(event) => {
      if(document.querySelector('.btn-group') && !document.querySelector('.btn-group').contains(event.target)){
        setDropdown(false)
      }
    })
    return () => {
      // document.body.removeEventListener('click')
    }
  }, [])

  return (
    <div className='btn-group check-baseToken-btn'>
      <button
        type='button'            
        onClick={onDropdown}
        className='btn chec'>
        <SymbolDisplay spec={spec} version={version} type={type} />
        <span className='check-base-down'><img src={symbolArrowIcon} alt=''/></span>
      </button>
        <div className={selectClass}>
          {trading.configs.map((config,index) => {
            return (
              <div className='dropdown-item' key={index} onClick={(e) => onSelect(config)}>              
                <SymbolDisplay spec={config} version={version} type={type}/>
              </div>
            )
          })}         
      </div>
    </div>
  )
}

function SymbolDisplay({version,spec,type}){
  if(type.isOption){
    return (
      `${spec.symbol || 'BTCUSD-20000-C'}`  
    )
  }else{
    return (
      (version.isV1 || version.isV2Lite) ? `${spec.symbol || 'BTCUSD'} / ${spec.bTokenSymbol || 'BUSD'} (10X)` : `${spec.symbol || 'BTCUSD'} (10X)`  
    )
  }
  
}
export default inject('trading','version','loading','type')(observer(SymbolSelector))