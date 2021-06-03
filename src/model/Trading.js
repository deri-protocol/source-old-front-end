import { observable, action, computed, makeObservable } from "mobx";
import Oracle from "./Oracle";
import Position from "./Position";
import Contract from "./Contract";
import History from './History'
import Config from "./Config";
import { eqInNumber, storeConfig, getConfigFromStore } from "../utils/utils";
import { getFundingRate } from "../lib/web3js/indexV2";
import { bg } from "../lib/web3js/indexV2";

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
  version = null;
  wallet = null;
  configs = [] 
  config = null;
  index = ''
  volume = ''
  paused = false
  slideIncrementMargin = 0
  position = {}
  contract = {}
  fundingRate = {}
  history = []
  userSelectedDirection = 'long'

  constructor(){
    makeObservable(this,{
      index : observable,
      volume : observable,
      slideIncrementMargin : observable,
      fundingRate : observable,
      position : observable,
      history : observable,
      contract : observable,
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
      setHistory : action,
      setSlideMargin : action,
      amount : computed,
      // amountIncrement : computed,
      fundingRateTip : computed,
      direction : computed,
      volumeDisplay : computed,
      isNegative : computed,
      isPositive : computed
    })
    this.configInfo = new Config();
    this.oracle = new Oracle();
    this.positionInfo = new Position()
    this.contractInfo = new Contract();
    this.historyInfo = new History()
  }

  /**
   * 初始化
   */
  async init(wallet,version){    
    if(version){
      this.version = version
    }
    const all = await this.configInfo.load(version);
    //如果连上钱包，有可能当前链不支持
    if(wallet && wallet.isConnected()){
      this.setWallet(wallet);
      this.setConfigs(all.filter(c => eqInNumber(wallet.detail.chainId,c.chainId)))
      let defaultConfig = this.getDefaultConfig(this.configs,wallet);
      //如果还是为空，则默认用所有config的第一条
      if(!defaultConfig){
        defaultConfig = all.length > 0 ? all[0] : {}
      }
      this.setConfig(defaultConfig);
    } 
    //如果没有钱包或者链接的链不一致，设置默认config，BTCUSD
    if(!wallet.isConnected() && this.configs.length === 0 && all.length > 0){
      let defaultConfig = all.find(c => c.symbol === 'BTCUSD')
      defaultConfig = defaultConfig ? defaultConfig : all[0]
      this.setConfig(defaultConfig)
    }
    this.loadByConfig(this.wallet,this.config,true)
    this.setVolume('')
  }

  async switch(spec){
    const cur = this.configs.find(config => config.pool === spec.pool && config.symbolId === spec.symbolId)
    //v1 只需要比较池子地址，v2 需要比较symbolId
    let changed = false
    if(this.version){
      changed = this.version.isV1 ? spec.pool !== this.config.pool : spec.symbolId !== this.config.symbolId
    }
    if(cur){
      this.pause();
      this.setConfig(cur)
      this.loadByConfig(this.wallet,cur,changed);  
      if(changed){
        this.store(cur)
      }    
      this.resume()
      this.setVolume('')
    }
  }

  async loadByConfig(wallet,config,symbolChanged){
     //position
     this.positionInfo.load(wallet,config,position => {       
        this.setPosition(position);
     })

     //切换指数
    if(symbolChanged && config){
      this.oracle.unsubscribeBars();
      this.oracle.addListener('trading',data => {
        this.setIndex(data.close)
      })
      const symbol = this.version.isV2 ? `${config.symbol}_V2` : config.symbol
      this.oracle.load(symbol)
    }
     //contract
     const contract = await this.contractInfo.load(wallet,config)    

     //funding rate
     const fundingRate = await this.loadFundingRate(wallet,config)
     
     //history
     const history = await this.historyInfo.load(wallet,config);

     if(contract){
      this.setContract(contract)
     }

     if(fundingRate){
      this.setFundingRate(fundingRate)
     }

     if(history){
      this.setHistory(history);
     }
  }


    //优先使用session storage 的，如果缓存跟用户当前链一直，则命中缓存，否则取当前配置第一条
    getDefaultConfig(configs = [],wallet){
      let defaultConfig = null;
      if(configs.length > 0){    
        const fromStore = this.getFromStore();
        if(fromStore && eqInNumber(wallet.detail.chainId,fromStore.chainId)){
          defaultConfig = fromStore;
        }
        if(defaultConfig){
          //虽然从缓存获得config ，需要判断池子地址是否一致，否则用可用config的第一条
          const pos = configs.findIndex(c => c.pool === defaultConfig.pool);
          if(pos === -1){
            defaultConfig = configs[0];
          }
        } else {
          defaultConfig = configs[0]
        }   
      }
      return defaultConfig;    
    }

 

  //存起来
  store(config){
    storeConfig(this.version.current,config)
  }

  getFromStore(){
    return getConfigFromStore(this.version.current)
  }

  async refresh(){
    this.pause()
    const position = await this.positionInfo.load(this.wallet,this.config);
    this.wallet.loadWalletBalance(this.wallet.detail.chainId,this.wallet.detail.account)
    const fundingRate = await this.loadFundingRate(this.wallet,this.config)   
    const history = await this.historyInfo.load(this.wallet,this.config)

    if(fundingRate){
      this.setFundingRate(fundingRate)      
    }
    if(position){
      this.setPosition(position)
    }
    if(history){
      this.setHistory(history)
    }
    this.setVolume('')
    this.resume();
  }

  /**
   * 暂停实时读取index和定时读取position
   */
  pause(){
    this.setPaused(true)
    this.oracle.pause();
    this.positionInfo.pause();
  }

  /**
   * 恢复读取
   */
  resume(){
    this.setPaused(false)
    this.oracle.resume();
    this.positionInfo.resume(this.wallet,this.config);
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

  setHistory(history){
    this.history = history
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

  setSlideMargin(slideIncrementMargin){
    if(slideIncrementMargin !== ''){
      this.slideIncrementMargin =  slideIncrementMargin
      const position = this.position;
      const increment = slideIncrementMargin - position.marginHeld
      const volume = increment / (this.index * this.contract.multiplier * this.contract.minInitialMarginRatio);
      this.setVolume(volume.toFixed(0))
    }
  }


  get volumeDisplay(){
    if(this.volume === 0 || this.volume === '' || this.volume === '-' || this.volume === 'e' || isNaN(this.volume)) {
      return '';
    } else {
      return Math.abs(this.volume)
    }
  }
  

  get amount(){
    const position = this.position
    const contract = this.contract;
    const volume = this.volume === '' || isNaN(this.volume) ? 0 : Math.abs(this.volume)
    let {margin, marginHeldBySymbol:currentSymbolMarginHeld,marginHeld,unrealizedPnl} = position
    //v2
    const otherMarginHeld = bg(marginHeld).minus(currentSymbolMarginHeld);
    const contractValue = volume * this.index * contract.multiplier;
    const incrementMarginHeld = contractValue * contract.minInitialMarginRatio
    let totalMarginHeld = bg(marginHeld) ;

    //如果当前仓位为正仓用户做空或者当前仓位为负仓用户做多，总仓位相减,取绝对值
    if((this.isPositive && this.userSelectedDirection === 'short') || (this.isNegative && this.userSelectedDirection === 'long')){
      totalMarginHeld = totalMarginHeld.minus(incrementMarginHeld);
      if(totalMarginHeld.lt(otherMarginHeld)){
        totalMarginHeld =  otherMarginHeld.plus(otherMarginHeld.minus(totalMarginHeld).abs())        
      } 
      currentSymbolMarginHeld = bg(currentSymbolMarginHeld).minus(incrementMarginHeld).abs().toString()
    } else {
      totalMarginHeld = bg(marginHeld).plus(incrementMarginHeld)
      if(currentSymbolMarginHeld){
        currentSymbolMarginHeld = bg(currentSymbolMarginHeld).plus(incrementMarginHeld).toString();
      }
    }
    
    totalMarginHeld = totalMarginHeld.gt(margin) ? margin : totalMarginHeld.toFixed(2)
    let available = bg(margin).minus(totalMarginHeld).toFixed(2)
    const exchanged = bg(volume).multipliedBy(contract.multiplier).toFixed(4)
    const dynBalance = margin && bg(margin).plus(unrealizedPnl).toFixed(2);
    const totalVolume = this.userSelectedDirection === 'short' ? (-this.volumeDisplay + (+position.volume)) : ((+this.volumeDisplay) +  (+position.volume))    
    const totalContractValue = totalVolume * this.index * contract.multiplier
    const leverage = Math.abs(totalContractValue / (+dynBalance)).toFixed(1);

    return {
      volume : this.volume,
      dynBalance : dynBalance,
      margin : totalMarginHeld,
      available : available,
      exchanged : exchanged,
      currentSymbolMarginHeld : currentSymbolMarginHeld,
      leverage : leverage
    }
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

  //正仓
  get isPositive(){
    return bg(this.position.volume).gt(0);
  }

  //负仓
  get isNegative(){
    return bg(this.position.volume).isNegative();
  }

  //资金费率
  async loadFundingRate(wallet,config){
    if(config){
      const chainId = wallet && wallet.isConnected() && wallet.supportChain ? wallet.detail.chainId : config.chainId
      if(config){    
        const res = await getFundingRate(chainId,config.pool,config.symbolId)
        return res;
      }
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