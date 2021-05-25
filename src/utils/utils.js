

import BigNumber from 'bignumber.js'
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
export function isOldCakeLp(address){
  return address === '0x4de2Ac273aD1BBe2F5C41f986d7b3cef8383Df98'
}