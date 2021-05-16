import { useState ,useEffect} from 'react'
import Position from './Position';
import History from './History';
import classNames from 'classnames';
import ContractInfo from '../ContractInfo/ContractInfo';
import Trade from './Trade';
import { inject, observer } from 'mobx-react';
import useDeriConfig from '../../hooks/useDeriConfig';
import { eqInNumber } from '../../utils/utils';

function LiteTrade({wallet,indexPrice = {},position = {info : {}},trading,isPro,specChange}){
  const [curTab, setCurTab] = useState('trade');
  const [spec, setSpec] = useState({});
  const specs = useDeriConfig(wallet)

  const onSpecChange = spec => {
    // indexPrice.pause();
    // position.pause();
    setSpec(spec)
    if(specChange){
      specChange(spec)
    }
  }


  //oracle index
  useEffect(() => {
    if(spec.symbol){
      // indexPrice.start(spec.symbol)
    }
    return () => {};
  }, [indexPrice,spec.symbol]);


  //仓位
  useEffect(() => {
    if(spec.symbol && wallet.detail.account)
    // position.start(wallet,spec)
    return () => {};
  }, [spec.symbol,wallet.detail.account]);


  useEffect(() => {
    if(specs.length > 0 && wallet.detail.chainId){
      const curSpecs = specs.filter(s => eqInNumber(s.chainId,wallet.detail.chainId))
      if(curSpecs.length > 0){
        setSpec(curSpecs[0]);   
      }      
    }
    return () => {};
  }, [wallet.detail.account,specs]);


  useEffect(() => {
    return () => {
    };
  }, [indexPrice.index,position.info]);




  const switchTab = current => setCurTab(current);
  const tradeClassName = classNames('trade-position',curTab)


  return (
      <div className={tradeClassName}>
        <div className='header-top'>
          <div className='header'>
            <span className='trade' onClick={() => switchTab('trade')}>
              TRADE
            </span>
            {!isPro && <>
            <span
              className='position' onClick={() => switchTab('position')}>
              MY POSITION
            </span>
            <span className='history' onClick={() => switchTab('history')}>
              HISTORY
            </span>
            </>}
          </div>
        </div>
        <Trade wallet ={wallet}  spec={spec} specs={specs} indexPrice={indexPrice}  onSpecChange={onSpecChange} position={position}/>
        {/* <Position  wallet ={wallet} spec={spec} position={position} trading={trading}/>
        <History wallet ={wallet} spec={spec} specs={specs} />
        <ContractInfo wallet={wallet} spec={spec} trading={trading}/>    */}
    </div> 
  )
}

export default inject('wallet')(observer(LiteTrade))