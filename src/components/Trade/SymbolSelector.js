import React, { useState, useEffect } from 'react'
import { inject, observer } from "mobx-react"
import symbolArrowIcon from '../../assets/img/symbol-arrow.svg'
import classNames from 'classnames';

function SymbolSelector({trading,version,setSpec,spec}) {
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
      trading.pause();
      setSpec(selected)
      trading.switch(selected);
      setDropdown(false)    
    } 
  }

  return (
    <div className='btn-group check-baseToken-btn'>
      <button
        type='button'            
        onClick={onDropdown}
        className='btn chec'>
        <SymbolDisplay spec={spec} version={version}/>
        <span className='check-base-down'><img src={symbolArrowIcon} alt=''/></span>
      </button>
      <div className={selectClass}>
        <div className='dropdown-box'>
          {trading.configs.map((config,index) => {
            return (
              <div className='dropdown-item' key={index} onClick={(e) => onSelect(config)}>              
                <SymbolDisplay spec={config} version={version}/>
              </div>
            )
          })}
        </div>            
      </div>
    </div>
  )
}

function SymbolDisplay({version,spec}){
  return (
    version.isV1 ? `${spec.symbol || 'BTCUSD'} / ${spec.bTokenSymbol || 'BUSD'} (10X)` : `${spec.symbol || 'BTCUSD'} (10X)`  
  )
}
export default inject('trading','version')(observer(SymbolSelector))