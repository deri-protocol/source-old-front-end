import { observable, action, computed, makeObservable, runInAction } from "mobx";
import Oracle from "./Oracle";
import Position from "./Position";
import Contract from "./Contract";
import Chain from "./Config";
import Config from "./Config";
import { eqInNumber } from "../utils/utils";
import { getEstimatedFundingRate,getLiquidityUsed, getEstimatedLiquidityUsed, getEstimatedFee } from "../lib/web3js/indexV2";
import { fromPromise } from "mobx-utils";
import { computedAsync, promisedComputed } from "computed-async-mobx";

/**
 * 交易模型
 * 关联对象
 * 1. chain
 * 2. Oracle
 * 3. position
 * 4. contract
 * 5. history
 * 计算
 * 1. dynamic balance
 * 2. available blance
 * 响应事件
 * 1. chain change
 * 2. chain’s symbol changed
 * 3. index update
 * 4. volum change
 * 5. margin change
 * 输出
 * 1. dynamic balance
 * 2. margin
 * 3. available balance
 * 4. volume
 * 5. specs
 * 6. spec
 * 7. position
 * 8. contract
 * 9. fundingRate
 */

export default class Trading {
  wallet = null;
  configs = [] 
  config = null;
  fundingRate = '--' 
  index = null
  volume = ''
  margin = '--'
  position = {}
  contract = {}

  constructor(){
    makeObservable(this,{
      index : observable,
      volume : observable,
      margin : observable,
      position : observable,
      contract : observable,
      setWallet :action,
      setConfigs : action,
      setConfig : action,
      setIndex : action,
      setContract : action,
      setPosition : action,
      setVolume : action,
      amount : computed,
      effect : computed,
    })
    this.configInfo = new Config();
    this.oracle = new Oracle();
    this.positionInfo = new Position()
    this.contractInfo = new Contract();
  }

  /**
   * 初始化
   */
  async init(wallet){
    if(!this.wallet || wallet.detail.account !== this.wallet.detail.account){
      this.setWallet(wallet);
      //配置信息，如chainId、pool address、symbol、baseToken等
      const all = await this.configInfo.load();
      this.setConfigs(all.filter(c => eqInNumber(wallet.detail.chainId,c.chainId)))
      this.setConfig(all.find(c => eqInNumber(wallet.detail.chainId,c.chainId)))
      //position
      const position = await this.positionInfo.load(this.wallet,this.config)
      this.setPosition(position);
      //index
      this.oracle.load(this.config.symbol,index => {
        this.setIndex(index)
      })
      //contract
      const contract = await this.contractInfo.load(this.wallet,this.config)
      this.setContract(contract)
    }
  }

  async switch(symbol){
    const cur = this.configs.find(config => config.symbol === symbol)
    if(cur){
      this.pause();
      this.setVolume('')
      this.setConfig(cur)
      
      //position
      const position = await this.positionInfo.load(this.wallet,this.config)
      this.setPosition(position);
      //index
      this.oracle.load(this.config.symbol,index => {
        this.setIndex(index)
      })
      //contract
      const contract = await this.contractInfo.load(this.wallet,this.config)
      this.setContract(contract)
    }
  }

  /**
   * 暂停实时读取index和定时读取position
   */
  pause(){
    this.oracle.pause();
    this.positionInfo.pause();
  }

  /**
   * 恢复读取
   */
  resume(){
    this.oracle.resume();
    this.positionInfo.resume();
  }

  setWallet(wallet){
    this.wallet = wallet;
  }

  setConfigs(configs){
    this.configs = configs
  }

  setConfig(config){
    this.config = config
  }

  setIndex(index){
    this.index = index;
  }

  setPosition(position){
    this.position = position
  }

  setContract(contract){
    this.contract = contract
  }

  setVolume(volume){
    this.volume = volume;
  }

  setMargin(margin){
    this.margin = margin
    if(this.contract){
      const volume = (+margin) / ((+this.index) * (+this.contract.multiplier) * (+this.contract.minInitialMarginRatio)) - (+this.position.volume)
      if(!isNaN(volume)){
        const number = volume.toFixed(0);
        this.setVolume(number);
      }
    }
  }



  //计算available balance、contract value、
  get amount(){
    if(this.index && this.position && this.contract){
      const curPosistion = (+this.volume) + (+this.position.volume)
      //合同价值
      const contractValue = Math.abs(curPosistion) * this.index * this.contract.multiplier
      const dynBalance = (+this.position.margin) + (+this.position.unrealizedPnl)
      const margin = contractValue * this.contract.minInitialMarginRatio
      const leverage = (+contractValue / +dynBalance).toFixed(1);
      const available = (+dynBalance) - (+margin)
      const exchanged = contractValue / this.index
      return {
        dynBalance, //动态余额
        margin,         //存入保证金
        available,      //可用余额
        exchanged,      //换算的值
        leverage,        //杠杆
      }
    }
    return {}
  }

  observableEffect = promisedComputed(
    0,
    async () => {
      if(this.volume && this.wallet && this.config){
        const fundingRateAfter = await getEstimatedFundingRate(this.wallet.detail.chainId,this.config.pool,this.volume);
        const curLiqUsed = await getLiquidityUsed(this.wallet.detail.chainId,this.config.pool)
        const afterLiqUsed = await getEstimatedLiquidityUsed(this.wallet.detail.chainId,this.config.pool,this.volume)
        const transFee = await getEstimatedFee(this.wallet.detail.chainId,this.config.pool,Math.abs(this.volume));
        return {
          fundingRateAfter : fundingRateAfter.fundingRate1,
          curLiqUsed : curLiqUsed.liquidityUsed0,
          afterLiqUsed : afterLiqUsed.liquidityUsed1,
          transFee
        }
      }
    }
  )

  get effect(){
    const o = this.observableEffect.value
    return o
  }



}