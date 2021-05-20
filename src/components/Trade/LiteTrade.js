import { useState ,useEffect} from 'react'
import Position from './Position';
import History from './History';
import classNames from 'classnames';
import ContractInfo from '../ContractInfo/ContractInfo';
import Trade from './Trade';
import { inject, observer } from 'mobx-react';
import useDeriConfig from '../../hooks/useDeriConfig';
import { eqInNumber } from '../../utils/utils';

function LiteTrade({wallet,trading,isPro}){
  const [curTab, setCurTab] = useState('trade');
  // const [spec, setSpec] = useState({});
  // const specs = useDeriConfig(wallet)


  // //oracle index
  // useEffect(() => {
  //   if(spec.symbol){
  //     // indexPrice.start(spec.symbol)
  //   }
  //   return () => {};
  // }, [indexPrice,spec.symbol]);


  //仓位
  // useEffect(() => {
  //   if(spec.symbol && wallet.detail.account)
  //   // position.start(wallet,spec)
  //   return () => {};
  // }, [spec.symbol,wallet.detail.account]);


  // useEffect(() => {
  //   if(specs.length > 0 && wallet.detail.chainId){
  //     const curSpecs = specs.filter(s => eqInNumber(s.chainId,wallet.detail.chainId))
  //     if(curSpecs.length > 0){
  //       setSpec(curSpecs[0]);   
  //     }      
  //   }
  //   return () => {};
  // }, [wallet.detail.account,specs]);


  // useEffect(() => {
  //   return () => {
  //   };
  // }, [indexPrice.index,trading.position]);



  // useEffect(() => {
  //   return () => {
  //   };
  // }, [trading.index]);


  useEffect(() => {
    if(wallet.detail.account){
      trading.init(wallet)
    }
  },[wallet.detail.account])



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
              className='pc position' onClick={() => switchTab('position')}>
              MY POSITION
            </span>
            <span
              className='mobile position' onClick={() => switchTab('position')}>
              POSITION
            </span>
            <span className='history' onClick={() => switchTab('history')}>
              HISTORY
            </span>
            </>}
          </div>
        </div>
        <Trade/>
        <Position  wallet ={wallet} />
        <History wallet ={wallet} spec={trading.config} specs={trading.configs} />
        <ContractInfo wallet={wallet} />   
    </div> 
  )
}

export default inject('wallet','trading')(observer(LiteTrade))