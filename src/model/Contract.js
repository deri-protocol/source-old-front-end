import { getSpecification } from "../lib/web3js/indexV2";
import { makeObservable, observable, action, computed } from "mobx";
import Intl from "./Intl";
import version from "./Version";
import type from "./Type";

export default class Contract {
  info = {
    bTokenSymbol:'BUSD',
    symbol:'BTCUSD',
    multiplier:'0.0001',
    fundingRateCoefficient:'0.0000025',
    deltaFundingCoefficient:'0.2',
    minInitialMarginRatio:0.1,
    initialMarginRatio:0.1,
    minMaintenanceMarginRatio:0.05,
    maintenanceMarginRatio:0.05,
    feeRatio:0.0005,
    underlier :'',
    strike:0,
    optionType:'C',
    bTokenSymbolDisplay : ['BUSD']
  }
  // constructor(){
  //   makeObservable(this,{
  //     info : observable,
  //     setInfo : action,
  //     bTokenSymbolDisplay : computed
  //   })
  // }

  async load(wallet,config){
    if(wallet && wallet.supportChain && config && config.pool !== this.info.pool){
      const spec = await getSpecification(wallet.detail.chainId,config.pool,config.symbolId);
      spec.bTokenSymbolDisplay = this.bTokenSymbolDisplay(spec)
      if(type.isOption){
        spec.underlier = spec.symbol.split('-')[0]
        spec.strike = spec.symbol.split('-')[1]
        spec.optionType = spec.symbol.split('-')[2]
      }
      
      this.setInfo(spec)
    }
    return this.info
  }

  setInfo(info){
    this.info = info
  }

  bTokenSymbolDisplay(spec){
    if(version.isV1 || version.isV2Lite || type.isOption){
      return [spec.bTokenSymbol];
    }
    const {bTokenSymbol = [],bTokenMultiplier = []} = spec
    return bTokenSymbol instanceof Array && bTokenSymbol.map((bToken,index) => `<span class='btoken-symbol'>${bToken}(<span class='multiplier' title='${Intl.get('lite','multiplier-tip')}'>${bTokenMultiplier[index]}x</span>)</span>`)
  }
}