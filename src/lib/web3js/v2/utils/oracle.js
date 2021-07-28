import { getOracleConfig } from '../config/oracle';
import { oracleFactory } from '../factory/shared';
import { normalizeChainId } from './validate';
import { DeriEnv } from '../../config';
import { deriToNatural } from './convert';

export const getOracleUrl = (symbol) => {
  const env = DeriEnv.get();
  //const { symbol } = getPoolConfig2(poolAddress, null, symbolId);
  const addSymbolParam = (url, symbol = 'BTCUSD') => `${url}?symbol=${symbol.toLowerCase()}`;
  if (env === 'prod' || env === 'production') {
    // for production
    if (symbol) {
      return addSymbolParam('https://oracle4.deri.finance/get_signed_price', symbol);
    }
    return 'https://oracle4.deri.finance/get_signed_price';
  } else {
    if (symbol) {
      return addSymbolParam('https://oracle2.deri.finance/get_signed_price', symbol);
    }
    // for test
    return 'https://oracle2.deri.finance/get_signed_price';
  }
};

export const getPriceInfo = async (symbol) => {
  let url = getOracleUrl(symbol);
  //console.log('oracle url', url);
  let retry = 2;
  let res, priceInfo;
  while (retry > 0) {
    res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
    if (res.ok) {
      priceInfo = await res.json();
      if (priceInfo.status.toString() === '200') {
        return priceInfo.data
      }
    }
    retry -= 1;
  }
  if (retry === 0) {
    throw new Error(`fetch oracle info error: exceed max retry(2): ${JSON.stringify(priceInfo)}`, );
  }
};

export const RestOracle = (symbol) => {
  return {
    getPrice: async function () {
      const priceInfo = await getPriceInfo(symbol)
      return deriToNatural(priceInfo.price).toString()
    }
  }
};

export const getOraclePrice = async (chainId, symbol, version='v2') => {
  chainId = normalizeChainId(chainId);
  const config = getOracleConfig(chainId, symbol, version);
  // console.log('oracle config',config)
  if (config && config.address) {
    if (!config.decimal) {
      throw new Error('getOraclePrice: decimal is empty', config.decimal);
    }
    const oracle = oracleFactory(
      chainId,
      config.address,
      symbol,
      config.decimal,
    );
    return await oracle.getPrice();
  }
};
