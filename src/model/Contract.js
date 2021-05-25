import { getSpecification } from "../lib/web3js/indexV2";

export default class Contract {

  async load(wallet,config){
    if(!this.info || (this.info && config.pool !== this.info.pool)){
      const info = await getSpecification(wallet.detail.chainId,config.pool,config.bTokenId,config.symbolId)
      this.setInfo(info);

    }
    return this.info
  }

  setInfo(info){
    // if(!info){
    //   info = {
    //      bSymbol:'BUSD',
    //      symbol:'BTCUSD',
    //      multiplier:'0.0001',
    //      fundingRateCoefficient:'0.0000025',
    //      minInitialMarginRatio:0.1,
    //      minMaintenanceMarginRatio:0.05,
    //      feeRatio:0.0005,
    //  }
    // }
    this.info = info;
  }

}