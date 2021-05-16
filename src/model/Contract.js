import { getSpecification } from "../lib/web3js/indexV2";

export default class Contract {

  async load(wallet,config){
    if(!this.info){
      const info = await getSpecification(wallet.detail.chainid,config.pool)
      this.setInfo(info);
    }
    return this.info
  }

  setInfo(info){
    this.info = info;
  }

}