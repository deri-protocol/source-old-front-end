import { getSpecification } from "../lib/web3js/indexV2";

export default class Contract {
  info = {
    bSymbol:'BUSD',
    symbol:'BTCUSD',
    multiplier:'0.0001',
    fundingRateCoefficient:'0.0000025',
    minInitialMarginRatio:0.1,
    minMaintenanceMarginRatio:0.05,
    feeRatio:0.0005,
  }

  async load(wallet,config){
    if(wallet && wallet.supportChain && config && config.pool !== this.info.pool){
      const spec = await getSpecification(wallet.detail.chainId,config.pool,config.bTokenId,config.symbolId);
      this.setInfo(spec)
    }
    return this.info
  }

  setInfo(info){
    this.info = info
  }
}