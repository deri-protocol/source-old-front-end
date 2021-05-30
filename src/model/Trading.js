import { observable, action, computed, makeObservable } from "mobx";
import Oracle from "./Oracle";
import Position from "./Position";
import Contract from "./Contract";
import History from './History'
import Config from "./Config";
import { eqInNumber, storeConfig, getConfigFromStore } from "../utils/utils";
import { getFundingRate } from "../lib/web3js/indexV2";
import { bg } from "../lib/web3js/v2";

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
      amountIncrement : computed,
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
      this.oracle.load(config.symbol)
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
    this.slideIncrementMargin =  slideIncrementMargin
    const position = this.position;
    const increment = bg(slideIncrementMargin).minus(bg(position.marginHeld))
    increment.gt(0)  ? this.setUserSelectedDirection('long') : this.setUserSelectedDirection('short');
    const volume = increment.abs().dividedBy(this.index * this.contract.multiplier * this.contract.minInitialMarginRatio);
    this.setVolume(volume.integerValue().toString())
  }


  get volumeDisplay(){
    if(this.volume === 0 || this.volume === '' || this.volume === '-' || this.volume === 'e' || isNaN(this.volume)) {
      return '';
    } else {
      return this.volume
    }
  }

  get amountIncrement(){
    //根据增量的marginHeld反推volume
    if(this.slideIncrementMargin){
      const incrementVolume = bg(this.slideIncrementMargin).dividedBy((bg(this.index).multipliedBy(bg(this.contract.multiplier)).multipliedBy(bg(this.contract.minInitialMarginRatio))))
      const incrementMargin = bg(this.amount.margin).plus(this.incrementMargin).toString()
      // const incrementAvailable = bg(this.amount.available).plus(this)
      console.log('incrementMargin',incrementMargin)
      let currentSymbolIncrementMargin  = this.position.marginHeldBySymbol || 0 
      currentSymbolIncrementMargin =  bg(currentSymbolIncrementMargin).plus(this.incrementMargin)
      return {
        volume : incrementVolume.integerValue().toString(),
        margin : this.slideIncrementMargin,
        currentSymbolIncrementMargin :  currentSymbolIncrementMargin.toString()
      }
    }
    return {
      volume : 0,
      margin : 0,
      currentSymbolIncrementMargin : 0
    }
  }

  

  get amount(){
    const position = this.position
    const contract = this.contract;
    const volume = this.volume === '' || isNaN(this.volume) ? 0 : this.volume
    //current symbol marginHel --> v2
    let {margin, marginHeldBySymbol:currentSymbolMarginHeld  } = position
    // increment marginHeld = volume * index * multiplier * minInitalMarginRatio
    let incrementMarginHeld = bg(volume).multipliedBy(bg(this.index)).multipliedBy(bg(contract.multiplier))
                                  .multipliedBy(bg(contract.minInitialMarginRatio));
    // total marginHeld = current position marginHeld + increment marginHeld (default)
    let totalMarginHeld = bg(position.marginHeld).plus(incrementMarginHeld)
    //v2 
    if(currentSymbolMarginHeld){
      currentSymbolMarginHeld = bg(currentSymbolMarginHeld).plus(incrementMarginHeld).toString();
    }
    //如果当前仓位为正仓用户做空或者当前仓位为负仓用户做多，总仓位相减,取绝对值
    if(this.isPositive && this.userSelectedDirection === 'short' || 
      this.isNegative && this.userSelectedDirection === 'long'){
      //total marginHeld 必须大于等于 当前symbol的仓位的marginHeld,只针对v2，v1没有marginHeldBySymbol，下面判断不会为真，取了个巧
      if(incrementMarginHeld.abs().gt(currentSymbolMarginHeld)) {
        incrementMarginHeld = currentSymbolMarginHeld
      }
      totalMarginHeld = bg(position.marginHeld).minus(incrementMarginHeld);
      totalMarginHeld = totalMarginHeld.isNegative() ? bg(0) : totalMarginHeld.abs();
      currentSymbolMarginHeld = bg(currentSymbolMarginHeld).minus(incrementMarginHeld)
      currentSymbolMarginHeld = currentSymbolMarginHeld.isNegative() ? 0 : currentSymbolMarginHeld.abs().toString()
    }
    totalMarginHeld = totalMarginHeld.gt(margin) ? margin : totalMarginHeld.toString()
    let available = bg(margin).minus(totalMarginHeld).toString()
    const exchanged = bg(volume).multipliedBy(contract.multiplier).toFixed(4)

    return {
      volume : this.volume,
      dynBalance : margin,
      margin : totalMarginHeld,
      available : available,
      exchanged : exchanged,
      currentSymbolMarginHeld
    }
  }

  //计算available balance、contract value、
  get amount_old(){
    //用户输入的时候
    if(this.index && this.position && this.contract && this.contract.multiplier && this.volume !== ''){
      //合同价值
      let curVolume = Math.abs(this.volume);
      const originVolume = Math.abs(this.volumeDisplay);
      //如果不是通过margin 算出来的volume
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
      let totalMargin =  margin
      //如果当前symbol 仓位 为0 且总的marginHeld 大于0
      // if(this.isShareOtherSymbolMargin){
        totalMargin = bg(margin).plus(this.position.marginHeld).toString() 
      // }
      // console.log('volume ',curVolume);
      // console.log('dynBalance ',dynBalance)
      // console.log('margin ',margin)
      // console.log('total margin ',totalMargin)
      const leverage = (+contractValue / +dynBalance).toFixed(1);
      const balance = ((+dynBalance) - (+totalMargin)).toFixed(2)
      const available = balance > 0 ? balance : 0
      const exchanged = (originVolume * (+this.contract.multiplier)).toFixed(4)
      return {
        dynBalance, 
        margin : totalMargin, 
        available,      
        exchanged,      
        leverage,
        marginHeldBySymbol : margin
      }
    } else if(this.position && this.position.margin){
      const dynBalance = bg(this.position.margin).plus(this.position.unrealizedPnl).toString()
      const margin = this.position.marginHeld
      const available = bg(dynBalance).minus(margin).toString();
      return {
        dynBalance,
        margin,
        marginHeldBySymbol : this.position.marginHeldBySymbol,
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

  //正仓
  get isPositive(){
    return bg(this.position.volume).gt(0);
  }

  //负仓
  get isNegative(){
    return bg(this.position.volume).isNegative();
  }

  get isShareOtherSymbolMargin() {
    return bg(this.position.volume).isZero() && bg(this.position.marginHeld).gt(0)
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