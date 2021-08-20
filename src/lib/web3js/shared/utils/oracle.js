import { getOracleConfig, mapToSymbolInternal } from '../config/oracle';
import { normalizeChainId } from './validate';
import { DeriEnv } from '../config/env';
import { oracleFactory } from '../factory/oracle';
import { deriToNatural } from './convert';

export const getOracleUrl = (symbol) => {
  const env = DeriEnv.get();
  //if (/^[0-9]+$/.test(symbolId.toString())) {
  let baseUrl =
    env === 'prod'
      ? 'https://oracle4.deri.finance/get_signed_price'
      : 'https://oracle2.deri.finance/get_signed_price';
  const addSymbolParam = (url, symbol) =>
    `${url}?symbol=${symbol.toLowerCase()}`;

  if (symbol) {
    return addSymbolParam(baseUrl, symbol);
  } else {
    return baseUrl;
  }
};

export const getPriceFromRest = async(symbol) => {
  const res = await getPriceInfo(symbol)
  if (res.price) {
    return deriToNatural(res.price).toString()
  } else {
    throw new Error(`getPrice() invalid format: ${JSON.stringify(res)}`)
  }
}

// from oracle rest api
export const getPriceInfo = async (symbol) => {
  symbol = mapToSymbolInternal(symbol)
  let url = getOracleUrl(symbol);
  //console.log(`getPriceInfo url: ${url}`)
  let retry = 3;
  let res, priceInfo;
  while (retry > 0) {
    res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
    if (res.ok) {
      priceInfo = await res.json();
      if (priceInfo.status.toString() === '200' && priceInfo.data) {
        return priceInfo.data
      }
    }
    retry -= 1;
  }
  if (retry === 0) {
    throw new Error(`fetch oracle info exceed max retry(2): ${symbol} ${JSON.stringify(priceInfo)}`);
  }
};

export const getPriceInfos = async (symbolList) => {
  let url = getOracleUrl();
  let retry = 3;
  let res, priceInfo;
  while (retry > 0) {
    res = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(symbolList),
    });
    if (res.ok) {
      priceInfo = await res.json();
      if (priceInfo.status.toString() === '200' && priceInfo.data) {
        return priceInfo.data
      }
    }
    retry -= 1;
  }
  if (retry === 0) {
    throw new Error(`fetch oracle infos exceed max retry(3): ${symbolList} ${JSON.stringify(priceInfo)}`);
  }
};

export const RestOracle = (symbol) => {
  return {
    getPrice: async function () {
      return getPriceFromRest(symbol)
      // const priceInfo = await getPriceInfo(symbol)
      // return deriToNatural(priceInfo.price).toString()
    }
  }
};

export const getOraclePrice = async (chainId, symbol, version='v2') => {
  chainId = normalizeChainId(chainId);
  symbol = mapToSymbolInternal(symbol)
  const config = getOracleConfig(chainId, symbol, version);
  // console.log('oracle config',config)
  if (config && config.address) {
    const oracle = oracleFactory(
      chainId,
      config.address,
      symbol,
      config.decimal,
    );
    return await oracle.getPrice();
  } else {
    // for new added symbol and not updated to config yet
    const priceInfo = await getPriceInfo(symbol);
    return deriToNatural(priceInfo.price).toString();
  }
};