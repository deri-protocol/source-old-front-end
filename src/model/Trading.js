import { observable, action, computed, makeObservable } from "mobx";
import Oracle from "./Oracle";
import Position from "./Position";
import Contract from "./Contract";
import Config from "./Config";
import { eqInNumber } from "../utils/utils";
import { getFundingRate } from "../lib/web3js/api/contractQueryApi";

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
  paused = false
  margin = ''
  position = {}
  contract = {}
  fundingRate = {}
  userSelectedDirection = 'long'

  constructor(){
    makeObservable(this,{
      index : observable,
      volume : observable,
      margin : observable,
      fundingRate : observable,
      position : observable,
      contract : observable,
      paused : observable,
      userSelectedDirection : observable,
      setWallet :action,
      setConfigs : action,
      setConfig : action,
      setIndex : action,
      setContract : action,
      setPosition : action,
      setVolume : action,
      setUserSelectedDirection : action,
      setFundingRate : action,
      setPaused : action,
      amount : computed,
      // effect : computed,
      fundingRateTip : computed,
      direction : computed,
      volumeDisplay : computed
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
      this.setConfig(all.find(c => eqInNumber(wallet.detail.chainId,c.chainId)) || {})
      this.onConfigChange(this.wallet,this.config,true)
    }
    this.setVolume('')
  }

  async switch(spec){
    const cur = this.configs.find(config => config.pool === spec.pool)
    if(cur){
      this.pause();
      this.setConfig(cur)
      this.onConfigChange(this.wallet,cur,this.config.symbol !== cur.symbol);      
      this.resume()
      this.setVolume('')
    }
  }

  async onConfigChange(wallet,config,symbolChanged){
     //position
     const position = await this.positionInfo.load(wallet,config,position => {       
        this.setPosition(position);
     })
     this.setPosition(position);
     //index

    if(symbolChanged){
      this.oracle.unsubscribeBars();
      this.oracle.addListener('trading',data => {
        this.setIndex(data.close)
      })
      this.oracle.load(config.symbol)
    }
     //contract
     const contract = await this.contractInfo.load(wallet,config)
     this.setContract(contract)

     //funding rate
     const fundingRate = await this.loadFundingRate(wallet,config)
     this.setFundingRate(fundingRate)
  }

  async refresh(){
    const position = await this.positionInfo.load(this.wallet,this.config);
    this.setPosition(position)
    this.wallet.loadWalletBalance(this.wallet.detail.chainId,this.wallet.detail.account)
    this.setVolume('')
  }

  /**
   * 暂停实时读取index和定时读取position
   */
  pause(){
    this.setPaused(true)
    // this.oracle.pause();
    this.positionInfo.pause();
  }

  /**
   * 恢复读取
   */
  resume(){
    this.setPaused(false)
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
    if(position){
      this.position = position
    }
  }

  setContract(contract){
    this.contract = contract
  }

  setFundingRate(fundingRate){
    this.fundingRate = fundingRate;
  }

  setVolume(volume){
    this.volume = volume;
  }

  setPaused(paused){
    this.paused = paused
  }

  setUserSelectedDirection(direction){
    this.userSelectedDirection = direction
  }

  setMargin(margin){
    this.margin = margin
    if(this.contract){
      const volume = (+margin) / ((+this.index) * (+this.contract.multiplier) * (+this.contract.minInitialMarginRatio))      
      if(!isNaN(volume)){
        this.setVolume(Math.abs(volume))
        console.log('volume ',volume)
      }
    }
  }

  get volumeDisplay(){
    if(this.volume === '' || this.volume === '-' || this.volume === 'e' || isNaN(this.volume)) {
      return '';
    } else if(this.margin !== '') {
        if((+this.volume) > Math.abs(+this.position.volume)) {
          const result = parseInt(Math.abs(this.volume) - Math.abs(this.position.volume))
          return result
        } else {
          const result = parseInt(Math.abs(this.position.volume) - Math.abs(this.volume));          
          return result
        }
    } else {
      return this.volume
    }
  }

  
  //计算available balance、contract value、
  get amount(){
    if(this.index && this.position && this.contract && this.volume !== ''){
      //合同价值
      let curVolume = Math.abs(this.volume);
      //如果不是通过marge 算出来的volume
      if(this.margin === '') {       
        if(this.userSelectedDirection === 'long') {
          if((+this.position.volume) > 0) {
            curVolume = curVolume + (+this.position.volume)
          } else {
            curVolume = Math.abs(this.position.volume) - curVolume
          }         
        } else {
          if((+this.position.volume) > 0){
            curVolume =  (+this.position.volume) - curVolume
          } else {
            curVolume = Math.abs(this.position.volume) + (+curVolume)
          }
        }
      }
      const contractValue = Math.abs(curVolume) * this.index * this.contract.multiplier
      const dynBalance = (+this.position.margin) + (+this.position.unrealizedPnl)
      const margin = contractValue * this.contract.minInitialMarginRatio
      const leverage = (+contractValue / +dynBalance).toFixed(1);
      const balance = ((+dynBalance) - (+margin)).toFixed(2)
      const available = balance > 0 ? balance : 0
      const exchanged = contractValue / this.index
      return {
        dynBalance, //动态余额
        margin,         //存入保证金
        available,      //可用余额
        exchanged,      //换算的值
        leverage,        //杠杆
      }
    } else if(this.position && this.position.margin){
      const dynBalance = ((+this.position.margin) + (+this.position.unrealizedPnl)).toFixed(2)
      const margin = (+this.position.marginHeld).toFixed(2)
      const available = ((+dynBalance) - (+margin)).toFixed(2)
      return {
        dynBalance,
        margin,
        available,
      }
    }
    return {}
  }

  get direction(){    
    // 正仓
    if(this.margin !== ''){
      if((+this.position.volume) > 0) {
        if(Math.abs(this.volume) > Math.abs(this.position.volume)) {
          return 'long'
        } else {
          return 'short'
        }
      } else if((+this.position.volume) < 0){
        //负仓
        if((+this.volume) > Math.abs(+this.position.volume)){
          return 'short'
        } else {
          return 'long'
        }
      }
    }
    return 0
  }

  //资金费率
  async loadFundingRate(wallet,config){
    if(wallet && config){    
      const res = await getFundingRate(wallet.detail.chainId,config.pool)
      return res;
    }
  }

  get fundingRateTip(){
    if(this.fundingRate && this.fundingRate.fundingRatePerBlock && this.config){
      return `Funding  Rate (per block) = ${this.fundingRate.fundingRatePerBlock}` +
      `\n(1 Long contract pays 1 short contract ${this.fundingRate.fundingRatePerBlock} ${this.config.bTokenSymbol} per block)`        
    }
    return ''
  }



}