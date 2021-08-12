import { observable, action, computed, makeObservable } from "mobx";
import Oracle from "./Oracle";
import Position from "./Position";
import Contract from "./Contract";
import History from './History'
import Config from "./Config";
import { eqInNumber, storeConfig, getConfigFromStore, restoreChain, getFormatSymbol } from "../utils/utils";
import { getFundingRate } from "../lib/web3js/indexV2";
import { bg } from "../lib/web3js/indexV2";
import Intl from "./Intl";
import version from './Version'
import type from './Type'

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
  type = null;
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
  supportChain = true

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
      supportChain : observable,
      setWallet :action,
      setConfigs : action,
      setConfig : action,
      setIndex : action,
      setContract : action,
      setPosition : action,
      setVolume : action,
      setUserSelectedDirection : action,
      // setSupportChain : action,
      setFundingRate : action,
      setHistory : action,
      setSlideMargin : action,
      amount : computed,
      fundingRateTip : computed,
      fundingRateDeltaTip : computed,
      fundingRatePremiumTip : computed,
      initialMarginRatioTip : computed,
      maintenanceMarginRatioTip : computed,
      multiplierTip : computed,
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
   * wallet and version changed will init
   */
  async init(wallet,version,isOptions,finishedCallback){  
    const all = await this.configInfo.load(version,isOptions);
    //如果连上钱包，有可能当前链不支持
    if(wallet.isConnected()){
      this.setWallet(wallet);
      this.setConfigs(all.filter(c => eqInNumber(wallet.detail.chainId,c.chainId)))
      let defaultConfig = this.getDefaultConfig(this.configs,wallet);
      //如果还是为空，则默认用所有config的第一条
      if(!defaultConfig){
        defaultConfig = all.length > 0 ? all[0] : {}
      }
      this.setConfig(defaultConfig);
      //如果没有钱包或者链接的链不一致，设置默认config，BTCUSD
    } else if(!wallet.isConnected() || !wallet.supportWeb3()){
      //没有钱包插件
      version.setCurrent('v2')
      const all = await this.configInfo.load(version,isOptions);
      const defaultConfig = all.find(c => c.symbol === 'BTCUSD')
      this.setConfig(defaultConfig)
    }
    this.loadByConfig(this.wallet,this.config,true,finishedCallback,isOptions)
    this.setVolume('')
  }

  async onSymbolChange(spec,finishedCallback,isOptions){
    const config = this.configs.find(config => config.pool === spec.pool && config.symbolId === spec.symbolId)
    //v1 只需要比较池子地址，v2 需要比较symbolId
    const changed = version.isV1 ? spec.pool !== this.config.pool : spec.symbolId !== this.config.symbolId
    this.onChange(config,changed,finishedCallback,isOptions)
  }

  async onChange(config,changed,finishedCallback,isOptions){
    if(config){
      this.pause();
      this.setConfig(config)
      this.loadByConfig(this.wallet,config,changed,finishedCallback,isOptions);  
      if(changed){
        this.store(config)
      }    
      this.resume()
      this.setVolume('')
    }
  }

  async loadByConfig(wallet,config,symbolChanged,finishedCallback,isOptions){
     //切换指数
    if(symbolChanged && config){
      const symbol = getFormatSymbol(config.symbol)
      this.oracle.unsubscribeBars(symbol);
      this.oracle.addListener('trading',data => {
        this.setIndex(data.close)
      })
      this.oracle.load(symbol)
    }
    if(wallet && wallet.isConnected && config){
      Promise.all([
        this.positionInfo.load(wallet,config,position => this.setPosition(position),isOptions),
        this.contractInfo.load(wallet,config,isOptions),
        this.loadFundingRate(wallet,config,isOptions),
        this.historyInfo.load(wallet,config,isOptions)
      ]).then(results => {
        if(results.length === 4){
          results[0] && this.setIndex(results[0].price) && this.setPosition(results[0]);
          results[1] && this.setContract(results[1]);
          results[2] && this.setFundingRate(results[2]);
          results[3] && this.setHistory(results[3]);
        } 
      }).finally(e => {
        finishedCallback && finishedCallback()
      })
    } else {
      finishedCallback && finishedCallback()
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
    storeConfig(version.current,config)
  }

  getFromStore(){
    return getConfigFromStore(version.current)
  }

  async syncFundingRate(){
    //资金费率和仓位同步
    const fundingRate = await this.loadFundingRate(this.wallet,this.config)   
    if(fundingRate){
      this.setFundingRate(fundingRate)      
    }
  }

  async refresh(){
    this.pause()
    const position = await this.positionInfo.load(this.wallet,this.config, async (position)  => {       
      this.setPosition(position);
      this.syncFundingRate();
    });
    if(position){
      this.setPosition(position)
    }
    this.syncFundingRate();
    this.wallet.loadWalletBalance(this.wallet.detail.chainId,this.wallet.detail.account)
    const history = await this.historyInfo.load(this.wallet,this.config)
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
      const price = position.price || this.index
      const increment = slideIncrementMargin - position.marginHeld
      let MarginRatio = type.isOption ? this.contract.initialMarginRatio : this.contract.minInitialMarginRatio;
      let volume =  increment / (price * this.contract.multiplier * MarginRatio);
      if(type.isOption){
        volume = +volume * +this.contract.multiplier
        let index = this.contract.multiplier.indexOf('.')
        let num = this.contract.multiplier.slice(index);
        let length = num.length 
        let value = volume.toString()
        if(value.indexOf(".") != '-1'){
          value = value.substring(0,value.indexOf(".") + length)
        }
        this.setVolume(value)
      }else{
        this.setVolume(volume.toFixed(0))
      }
      
    }
  }


  get volumeDisplay(){
    // if(type.isOption){
    //   if( this.volume === '' || this.volume === '-' || this.volume === 'e' || isNaN(this.volume)) {
    //     return '';
    //   } else {
    //     return Math.abs(this.volume)
    //   }
    // }else if(type.isFuture){
      if((type.isFuture && Math.abs(this.volume) === 0 && isNaN(this.volume) )|| this.volume === '' || this.volume === '-' || this.volume === 'e') {
        return '';
      } else {
        return Math.abs(this.volume)
      }
    // }
    
  }
  

  get amount(){
    const position = this.position
    const contract = this.contract;
    let initVolume = this.volume === '' || isNaN(this.volume) ? 0 : Math.abs(this.volume)
    let optionVolume = type.isOption ? (+initVolume / +this.contract.multiplier):initVolume;
    const volume = optionVolume
    let {margin, marginHeldBySymbol:currentSymbolMarginHeld ,marginHeld,unrealizedPnl} = position
    const price = position.price || this.index
    //v2
    let otherMarginHeld = bg(marginHeld).minus(currentSymbolMarginHeld)
    otherMarginHeld = otherMarginHeld.isNaN() ? bg(0) : otherMarginHeld;
    const contractValue = volume * price * contract.multiplier;
    const incrementMarginHeld =  type.isOption ? contractValue * contract.initialMarginRatio : contractValue * contract.minInitialMarginRatio
    let totalMarginHeld = bg(marginHeld) ;

    //如果当前仓位为正仓用户做空或者当前仓位为负仓用户做多，总仓位相减,取绝对值
    if((this.isPositive && this.userSelectedDirection === 'short') || (this.isNegative && this.userSelectedDirection === 'long')){
      totalMarginHeld = totalMarginHeld.minus(incrementMarginHeld);
      if(totalMarginHeld.lt(otherMarginHeld)){
        totalMarginHeld =  otherMarginHeld.plus(otherMarginHeld.minus(totalMarginHeld).abs())        
      } 
      currentSymbolMarginHeld = bg(currentSymbolMarginHeld).minus(incrementMarginHeld).abs().toFixed(2)
    } else {
      totalMarginHeld = bg(marginHeld).plus(incrementMarginHeld)
      if(currentSymbolMarginHeld){
        currentSymbolMarginHeld = bg(currentSymbolMarginHeld).plus(incrementMarginHeld).toFixed(2);
      }
    }

    const dynBalance = margin && bg(margin).plus(unrealizedPnl).toFixed(2);    
    //总保证金和当前symbol保证金不能超过余额
    totalMarginHeld = totalMarginHeld.gt(dynBalance) ? dynBalance : totalMarginHeld.toFixed(2)
    if(currentSymbolMarginHeld){
      currentSymbolMarginHeld = (+currentSymbolMarginHeld) > (+dynBalance) ? dynBalance : (+currentSymbolMarginHeld).toFixed(2);
    }
    let available = bg(dynBalance).minus(totalMarginHeld).toFixed(2)
    const exchanged = bg(volume).multipliedBy(contract.multiplier).toFixed(4)
    const totalVolume = this.userSelectedDirection === 'short' ? (-this.volumeDisplay + (+position.volume)) : ((+this.volumeDisplay) +  (+position.volume))    
    const totalContractValue = totalVolume * price * contract.multiplier
    const leverage = Math.abs(totalContractValue / (+dynBalance)).toFixed(1);
    available = (+available) < 0 ? 0 : available
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
        const res = await getFundingRate(chainId,config.pool,config.symbolId).catch(e => console.error('getFundingRate was error,maybe network is wrong'))
        const contractInfo = await this.contractInfo.load(wallet,config)
        if(type.isOption){
          res.deltaFunding0 = (+res.deltaFunding0) / (+contractInfo.multiplier)
          res.premiumFunding0 = (+res.premiumFunding0) / (+contractInfo.multiplier)
        }
        return res;
      }
    }
  }

  get fundingRateTip(){    
    if(version && version.isV2){
      if(this.fundingRate && this.fundingRate.fundingRatePerBlock && this.config){
        if(Intl.locale === 'zh'){
          return `${Intl.get('lite','funding-rate-per-block')} = ${this.fundingRate.fundingRatePerBlock}` +
        `\n ${Intl.get('lite','per-block')} ${Intl.get('lite','1-long-contract-pays-1-short-contract')} (${this.fundingRate.fundingRatePerBlock} * ${Intl.get('lite','index-price-camelize')} * ${this.contract.multiplier} ) ${this.config.bTokenSymbol}`        
        } else {
          return `${Intl.get('lite','funding-rate-per-block')} = ${this.fundingRate.fundingRatePerBlock}` +
        `\n${Intl.get('lite','1-long-contract-pays-1-short-contract')} (${this.fundingRate.fundingRatePerBlock} * ${Intl.get('lite','index-price-camelize')} * ${this.contract.multiplier} ) ${this.config.bTokenSymbol} ${Intl.get('lite','per-block')}`        
        }
        
      }
    } else {
      if(this.fundingRate && this.fundingRate.fundingRatePerBlock && this.config){
        if(Intl.locale === 'zh'){
          return `${Intl.get('lite','funding-rate-per-block')} = ${this.fundingRate.fundingRatePerBlock}` +
        `\n${Intl.get('lite','per-block')} ${Intl.get('lite','1-long-contract-pays-1-short-contract')} ${this.fundingRate.fundingRatePerBlock} ${this.config.bTokenSymbol} `        
        } else {
          return `${Intl.get('lite','funding-rate-per-block')} = ${this.fundingRate.fundingRatePerBlock}` +
        `\n${Intl.get('lite','1-long-contract-pays-1-short-contract')} ${this.fundingRate.fundingRatePerBlock} ${this.config.bTokenSymbol} ${Intl.get('lite','per-block')})`        
        }        
      }
    }
    
    return ''
  }

  get fundingRateDeltaTip(){    
    if(this.fundingRate && this.fundingRate.deltaFundingPerSecond && this.config && this.contract){
      if(Intl.locale === 'zh'){
        return `${Intl.get('lite','funding-rate-delta-tip')} = ${(+this.fundingRate.deltaFundingPerSecond / +this.contract.multiplier).toFixed(20)} ${this.config.bTokenSymbol} ${Intl.get('lite','per-second')}` +
      `\n${Intl.get('lite','per-day')} ${Intl.get('lite','1-long-contract-pays-1-short-contract')} (${this.fundingRate.fundingRatePerBlock} } * ${this.contract.multiplier} ) ${this.config.bTokenSymbol}`        
      } else {
        return `${Intl.get('lite','funding-rate-delta-tip')} = ${(+this.fundingRate.deltaFundingPerSecond / +this.contract.multiplier).toFixed(20)} ${this.config.bTokenSymbol} ${Intl.get('lite','per-second')}` +
      `\n${Intl.get('lite','1-long-contract-pays-1-short-contract')} ${(+this.fundingRate.deltaFunding0).toFixed(20)} ${this.config.bTokenSymbol} ${Intl.get('lite','per-day')}`        
      }
    }
    return ''
  }
  get fundingRatePremiumTip(){    
    if(this.fundingRate && this.fundingRate.premiumFundingPerSecond && this.config && this.contract){
      if(Intl.locale === 'zh'){
        return `${Intl.get('lite','funding-rate-premium-tip')} = ${(+this.fundingRate.premiumFundingPerSecond / +this.contract.multiplier).toString()} ${this.config.bTokenSymbol} ${Intl.get('lite','per-second')}` +
      `\n${Intl.get('lite','per-day')} ${Intl.get('lite','1-long-contract-pays-1-short-contract')} (${this.fundingRate.fundingPerBlock} ) ${this.config.bTokenSymbol}`        
      } else {
        return `${Intl.get('lite','funding-rate-premium-tip')} = ${(+this.fundingRate.premiumFundingPerSecond / +this.contract.multiplier).toFixed(20)} ${this.config.bTokenSymbol} ${Intl.get('lite','per-second')}` +
      `\n${Intl.get('lite','1-long-contract-pays-1-short-contract')} ${(+this.fundingRate.premiumFunding0).toFixed(20)} ${this.config.bTokenSymbol} ${Intl.get('lite','per-day')}`        
      }
    }
    return ''
  }

  get initialMarginRatioTip(){
    if(this.contract && this.contract.initialMarginRatioOrigin){
      return `${Intl.get('lite','in-the-money-initial')} = ${this.contract.initialMarginRatioOrigin}` +
      `\n${Intl.get('lite','out-of-money-initial')} = ${Intl.get('lite','in-max')}(${this.contract.initialMarginRatioOrigin}${Intl.get('lite','otm-ratio-initial')})` +
      `\n\n${Intl.get('lite','otm-ratio-max')}`
    }
    return ''
  }
  get maintenanceMarginRatioTip(){
    if(this.contract && this.contract.maintenanceMarginRatioOrigin){
      return `${Intl.get('lite','in-the-money-maintenance')} = ${this.contract.maintenanceMarginRatioOrigin}` +
      `\n${Intl.get('lite','out-of-money-maintenance')} = ${Intl.get('lite','in-max')}(${this.contract.maintenanceMarginRatioOrigin}${Intl.get('lite','otm-ratio-initial')})` +
      `\n\n${Intl.get('lite','otm-ratio-max')}`
    }
    return ''
  }

  get multiplierTip(){
    if(this.contract && this.config){
      return `${Intl.get('lite','the-notional-value-of')} ${this.contract.multiplier}${this.config.unit}`
    }
    return ''
  }

}