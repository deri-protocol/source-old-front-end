import { getPoolConfig } from '../config';
import { DeriEnv } from '../../config'
import { deriToNatural } from './convert';

export const getOracleUrl = (poolAddress, symbolId) => {
  const env = DeriEnv.get();
  const { symbol } = getPoolConfig(poolAddress, null, symbolId);
  const addSymbolParam = (url, symbol = 'BTCUSD') => `${url}?symbol=${symbol}`;
  if (env === 'prod' || env === 'production') {
    // for production
    if (symbol) {
      return addSymbolParam('https://oracle4.deri.finance/price', symbol);
    }
    return 'https://oracle4.deri.finance/price';
  } else {
    if (symbol) {
      return addSymbolParam('https://oracle4.deri.finance/price', symbol);
    }
    // for test
    return 'https://oracle4.deri.finance/price';
  }
};

export const getOracleInfo = async (poolAddress, symbolId) => {
  let url = getOracleUrl(poolAddress, symbolId);
  //console.log('oracle url', url);
  let retry = 3;
  //let timeout = 1000;
  let res;
  while (retry > 0) {
    res = await fetch(url, { mode: 'cors' });
    //if (res && !res.timeout) {
    if (res.ok) {
      break;
    }
    //console.log('get oracle info timeout')
    retry -= 1;
    //timeout += 800;
  }
  if (retry === 0 && !res) {
    throw new Error(`fetch oracle info error: exceed max retry(5).`);
  }
  return await res.json();
};

export const getOraclePrice = async (poolAddress, symbolId) => {
  try {
    const responseJson = await getOracleInfo(poolAddress, symbolId);
    let price = responseJson.price;
    if (!price) {
      price = '0';
    }
    return deriToNatural(responseJson.price).toString();
  } catch (err) {
    throw err;
  }
};
