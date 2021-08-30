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
      spec.bTokenSymbol = this.bTokenSymbolDisplay(spec)
      this.setInfo(spec)
    }
    return this.info
  }

  setInfo(info){
    this.info = info
  }

  bTokenSymbolDisplay(spec){
    if(version.isV1 || version.isV2Lite || type.isOption || version.isOpen){
      return [spec.bTokenSymbol];
    }
    return spec.bTokenSymbol;
  }
}