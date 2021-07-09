import { getOracleConfig } from '../config/oracle';
import { getPoolConfig2 } from '../config/pool';
import { oracleFactory } from '../factory/shared';
import { normalizeChainId } from './validate';
import { DeriEnv } from '../../config';

export const getOracleUrl = (poolAddress, symbolId) => {
  const env = DeriEnv.get();
  const { symbol } = getPoolConfig2(poolAddress, null, symbolId);
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
  let retry = 2;
  let res;
  while (retry > 0) {
    res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
    if (res.ok) {
      break;
    }
    retry -= 1;
  }
  if (retry === 0 && !res) {
    throw new Error(`fetch oracle info error: exceed max retry(2).`);
  }
  return await res.json();
};

// export const getOraclePrice = async (poolAddress, symbolId) => {
//   const responseJson = await getOracleInfo(poolAddress, symbolId);
//   let price = responseJson.price;
//   if (!price) {
//     price = '0';
//   }
//   return deriToNatural(responseJson.price).toString();
// };

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
