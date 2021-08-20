import Web3 from 'web3';
import BigNumber from 'bignumber.js';

// == bg
BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: 256,
});

export const bg = (value, base = 0) => {
  if (base === 0) {
    return BigNumber(value);
  }
  if (base > 0) {
    return BigNumber(value).times(BigNumber(`1${'0'.repeat(base)}`));
  }
  return BigNumber(value).div(BigNumber(`1${'0'.repeat(-base)}`));
};

export const max = (value1, value2) => {
  if (value1.gte(value2)) {
    return value1;
  }
  return value2;
};

export const min = (value1, value2) => {
  if (value1.lte(value2)) {
    return value1;
  }
  return value2;
};

export const fromWei = (value, unit='ether') => Web3.utils.fromWei(value, unit)

export const toWei = (value, unit='ether') => Web3.utils.toWei(value, unit)

export const toNatural = (value, num = 0) => BigNumber(value).toFixed(num).toString();

export const toHex = (value) => Web3.utils.toHex(value);

export const toChecksumAddress = (value) => Web3.utils.toChecksumAddress(value);

export const hexToString = (value) => Web3.utils.hexToUtf8(value);

export const hexToNumber = (value) => Web3.utils.hexToNumber(value);

export const hexToNumberString = (value) => Web3.utils.hexToNumberString(value);

export const hexToDeri = (value) => bg(hexToNumberString(value));

export const hexToNatural = (value) => bg(hexToNumberString(value), -18);


export const deriToNatural = (value) => bg(value, -18);

export const naturalToDeri = (value) => bg(value, 18).toFixed(0);

export const deriToString = (value) => bg(value).toString();

export const deriToBool = (value) => {
  if (bg(value).toNumber() === 1) {
    return true;
  }
  return false;
};

export const naturalWithPercentage = (value) =>
  `${bg(value).sd(4).times(100).toFixed(4).toString()}%`;

export const formatBN = (bigNumber) =>
  bigNumber.toFormat().replaceAll(',', '').toString();

// == convert
export const numberToHex = (value) => Web3.utils.numberToHex(value);


// == utils
export const isBrowser = () => typeof window !== 'undefined' && typeof window.document !== 'undefined'
export const isNodejs = () => typeof process !== 'undefined' && process.versions != null && process.versions.node != null
export const isJsDom = () => typeof window !== 'undefined' && navigator.userAgent.includes('jsdom')
