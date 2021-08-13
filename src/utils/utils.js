

import BigNumber from 'bignumber.js'
import version from '../model/Version';
import type from '../model/Type';
const versionKey = 'deri-current-version'

export function bg(value, base = 0) {
  if (base == 0) {
    return BigNumber(value);
  } else if (base > 0) {
    return BigNumber(value).times(BigNumber("1" + "0".repeat(base)));
  } else {
    return BigNumber(value).div(BigNumber("1" + "0".repeat(-base)));
  }
}

export function deriNatural(value) {
  return bg(value, -18);
}

export function formatAddress(address){
  return address && `${address.substr(0,6)}...${address.substr(-4)}`
}

export function formatBalance(balance){
  return balance && (+balance).toFixed(4)
}

export function eqInNumber(str1,str2){
  return (+str1) === (+str2)
}

export function isLP(address){
  return address === '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd' || address === '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
}
export function isSushiLP(address){
  return address === '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd'
}
export function isCakeLP(address){
  return address === '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
}

export function sessionStorageKey(version){
  return `${version}-current-trading-pool`
}


// export function storeVersion(version){
//   sessionStorage.setItem(versionKey,version)
// }

// export function restoreVersion(){
//   return sessionStorage.getItem(versionKey)
// }

export function storeConfig(version,config){
  if(config){
    const key = sessionStorageKey(version);
    sessionStorage.setItem(key,JSON.stringify(config))
  }
}

export function getConfigFromStore(version){
  return JSON.parse(sessionStorage.getItem(sessionStorageKey(version)))
}

export function storeChain(chainInfo){
  sessionStorage.setItem('current-chain',JSON.stringify(chainInfo))
}
export function restoreChain(){
  return JSON.parse(sessionStorage.getItem('current-chain')) || {code : ''};
}

export function storeLocale(locale){
  sessionStorage.setItem('current-locale',locale)
}

export function restoreLocale(){
  return sessionStorage.getItem('current-locale')
}

export function addParam(param,value,urlString = window.location.href){
  const url = new URL(urlString);
  if(url.searchParams.has(param)){
    url.searchParams.set(param,value);
  } else {
    url.searchParams.append(param,value);
  }
  return  url.toString();
}

export function hasParam(param,urlString = window.location.href){
  const url = new URL(urlString);
  return url.searchParams.has(param);
}

export function getParam(param,urlString = window.location.href){
  const url = new URL(urlString);
  return url.searchParams.get(param);
}

export function getFormatSymbol(symbol){
  const curChain = restoreChain();
  if(type.isOption){
    if(symbol.indexOf('-MARKPRICE') !== -1) {
      symbol = symbol.substr(0,symbol.indexOf('-MARKPRICE'))
    } else {
      symbol = symbol.split('-')[0]
    }
  }
  // if(symbol.indexOf('MARKPRICE') !== -1)
  return version.isV2 || version.isV2Lite || type.isOption ? `${symbol}_V2_${curChain ? curChain.code.toUpperCase() : 'BSC'}` : symbol
}



