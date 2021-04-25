import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import {
  DeriEnv,
  ChainProviderUrls,
  getContractAddressConfig,
  getSlpContractAddressConfig,
  getAnnualBlockNumberConfig,
  getDeriContractAddressConfig,
} from './config';

BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: 256,
});

export { BigNumber };

// numberic
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

export const toNatural = (value, num = 0) =>
  BigNumber(value).toFixed(num).toString();

export const toHex = (value) => Web3.utils.toHex(value);

export const toChecksumAddress = (value) => Web3.utils.toChecksumAddress(value);

export const hexToString = (value) => Web3.utils.hexToUtf8(value);

export const hexToNumber = (value) => Web3.utils.hexToNumber(value);

export const hexToNumberString = (value) => Web3.utils.hexToNumberString(value);

export const hexToDeri = (value) => bg(hexToNumberString(value));

export const hexToNatural = (value) => bg(hexToNumberString(value), -18);

export const hexToNaturalWithPercentage = (value) =>
  `${bg(hexToNumberString(value), -18)
    .sd(4)
    .times(100)
    .toFixed(4)
    .toString()}%`;

export const naturalToDeri = (value) => bg(value, 18).toFixed(0);

export const naturalWithPercentage = (value) =>
  `${bg(value).sd(4).times(100).toFixed(4).toString()}%`;

export const deriToNatural = (value) => bg(value, -18);

export const deriToNaturalWithPercentage = (value) =>
  `${bg(value, -18).sd(4).times(100).toFixed(4).toString()}%`;

export const deriToString = (value) => bg(value).toString();

export const deriToBool = (value) => {
  if (bg(value).toNumber() === 1) {
    return true;
  }
  return false;
};

export const hasInvalidArgsValue = (...args) =>
  args.some(
    (i) =>
      // console.log(bg(i))
      isNaN(i.toString()) || i.toString() === '0'
  );

// language
export const isObject = (obj) => typeof obj === 'object';

// http
export const checkHttpServerIsAlive = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};
export const getAliveHttpServer = async (urls = []) => {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (await checkHttpServerIsAlive(url)) {
      return url;
    }
  }
  throw new Error('No alive http server');
};

// ethereum chain
export const MAX_VALUE =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
export const getNetworkName = (chainId) => {
  chainId = normalizeChainId(chainId);
  let poolNetwork;
  switch (chainId) {
    case '1':
      poolNetwork = 'ethereum';
      break;
    case '56':
      poolNetwork = 'bsc';
      break;
    case '128':
      poolNetwork = 'heco';
      break;
    case '3':
      poolNetwork = 'ropsten';
      break;
    case '42':
      poolNetwork = 'kovan';
      break;
    case '97':
      poolNetwork = 'bsctestnet';
      break;
    case '256':
      poolNetwork = 'hecotestnet';
      break;
    default:
      throw new Error('The networkId is not valid');
  }
  return poolNetwork;
};

export const getWalletBalanceUnit = (chainId) => {
  chainId = normalizeChainId(chainId);
  let index;
  const unitNetworkIdsMap = {
    ETH: ['1', '3', '42'],
    BNB: ['56', '97'],
    HT: ['128', '256'],
  };
  const networkIdsArray = Object.values(unitNetworkIdsMap);
  for (let i = 0; i < networkIdsArray.length; i++) {
    if (networkIdsArray[i].includes(chainId)) {
      index = i;
      break;
    }
  }
  if (index !== undefined) {
    return Object.keys(unitNetworkIdsMap)[index];
  }
  if (chainId === '') {
    return '';
  }
  throw new Error('Invalid Network:', chainId);
};

export const getPoolBaseSymbolList = (chainId) => {
  chainId = normalizeChainId(chainId);
  let result = [];
  const pools = getContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  for (let i = 0; i < pools.length; i++) {
    const { bTokenSymbol, symbol } = pools[i];
    if (bTokenSymbol && symbol) {
      result.push(`${symbol}/${bTokenSymbol}`);
    }
  }
  return result;
};

export const getPoolBaseTokenAddressObject = (chainId) => {
  chainId = normalizeChainId(chainId);
  let result = {};
  const pools = getContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  for (let i = 0; i < pools.length; i++) {
    const { bTokenSymbol, symbol, pool } = pools[i];
    const key = `${symbol}/${bTokenSymbol}`;
    if (bTokenSymbol && symbol) {
      result[key] = pool;
    }
  }
  return result;
};

// export const getPoolContractAddress = (chainId, bTokenSymbol) => {
//   chainId = normalizeChainId(chainId);
//   const pools = getContractAddressConfig(DeriEnv.get()).filter(
//     (c) => c.chainId === chainId
//   );
//   const pool = pools.filter((p) => p.bTokenSymbol === bTokenSymbol);
//   if (pool.length > 0) {
//     return [
//       pool[0].pool,
//       pool[0].bToken,
//       pool[0].pToken,
//       pool[0].lToken,
//       pool[0].dToken,
//       pool[0].MiningVault,
//       pool[0].initialBlock,
//     ];
//   }
//   console.log(
//     `getPoolContractAddress(): contract address is not found: ${chainId} ${bTokenSymbol}`
//   );
//   return [];
// };

// get config by poolAddress
export const getPoolContractAddress = (chainId, poolAddress) => {
  chainId = normalizeChainId(chainId);
  const pools = getContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  // console.log('pool', pool)
  if (pool.length > 0) {
    return {
      poolAddress: pool[0].pool,
      bTokenAddress: pool[0].bToken,
      pTokenAddress: pool[0].pToken,
      lTokenAddress: pool[0].lToken,
      dTokenAdress: pool[0].dToken,
      MinningVaultAddress: pool[0].MiningVault,
      bTokenSymbol: pool[0].bTokenSymbol,
      symbol: pool[0].symbol,
      initialBlock: pool[0].initialBlock,
    };
  }
  console.log(
    `getPoolContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  );
  return [];
};

export const getMiningVaultContractAddress = (chainId) => {
  chainId = normalizeChainId(chainId);
  const pools = getContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  if (pools.length > 0) {
    if (pools[0].MiningVault) {
      return pools[0].MiningVault;
    }
  }
};

export const getAnnualBlockNumber = (chainId) => {
  const blockNumbers = getAnnualBlockNumberConfig();
  if (blockNumbers[chainId]) {
    return parseInt(blockNumbers[chainId]);
  }
  console.log(`cannot find the annual block number with chainId: ${chainId}`);
};
export const getSlpContractAddress = (chainId, poolAddress) => {
  chainId = normalizeChainId(chainId);
  const pools = getSlpContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  if (pool.length > 0) {
    return {
      pool: pool[0].pool,
      bToken: pool[0].bToken,
      pToken: pool[0].pToken,
      lToken: pool[0].lToken,
      dToken: pool[0].dToken,
      MinningVault: pool[0].MiningVault,
    };
  }
  console.log(
    `getSlpContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  );
  return {};
};

export const getDeriContractAddress = (chainId) => {
  chainId = normalizeChainId(chainId);
  const pool = getDeriContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  if (pool.length > 0) {
    return {
      deriAddress: pool[0].Deri,
      wormholeAddress: pool[0].Wormhole,
      bTokenSymbol: pool[0].bTokenSymbol,
    };
  }
  console.log(
    `getDeriContractAddress(): contract address is not found: ${chainId}`
  );
  return {};
};

export const getOracleUrl = (env = 'dev', chainId, poolAddress) => {
  const { symbol } = getPoolContractAddress(chainId, poolAddress);
  const addSymbolParam = (url, symbol='BTCUSD') => `${url}?symbol=${symbol}`;
  if (env === 'prod' || env === 'production') {
    // for production
    if (symbol) {
      if (symbol === 'COIN') {
        return addSymbolParam('https://oracle3.deri.finance/price', symbol);
      } else {
        return addSymbolParam('https://oracle.deri.finance/price', symbol);
      }
    }
    return 'https://oracle.deri.finance/price';
  } else {
    if (symbol) {
      return addSymbolParam('https://oracle2.deri.finance/price', symbol);
    }
    // for test
    return 'https://oracle2.deri.finance/price';
  }
};

export const getBTCUSDPrice = async (chainId, poolAddress) => {
  try {
    let url = getOracleUrl(DeriEnv.get(), chainId, poolAddress);
    // const { symbol } = getPoolContractAddress(chainId, poolAddress);
    // if (symbol && symbol != '') {
    //   url = `${url}?symbol=${symbol}`;
    // }
    const priceResponse = await fetch(url);
    const priceResponseJson = await priceResponse.json();
    return deriToNatural(priceResponseJson.price);
  } catch (err) {
    console.log(`fetch BTCUSD price error: ${err}`);
  }
  return '0';
};
export const getOracleInfo = async (chainId, poolAddress) => {
  try {
    let url = getOracleUrl(DeriEnv.get(), chainId, poolAddress);
    // const { symbol } = getPoolContractAddress(chainId, poolAddress);
    // if (symbol && symbol != '') {
    //   url = `${url}?symbol=${symbol}`;
    // }
    console.log('oracle url', url);
    const priceResponse = await fetch(url);
    const priceResponseJson = await priceResponse.json();
    return priceResponseJson;
  } catch (err) {
    console.log(`fetch Oracle info error: ${err}`);
  }
  return {};
};

export const getChainProviderUrl = (chainId) => {
  chainId = normalizeChainId(chainId);
  const chains = ChainProviderUrls.filter((item) => item.chainId === chainId);
  if (chains.length === 1) {
    try {
      // const url = await getAliveHttpServer(chains[0].provider_urls)
      return chains[0].provider_urls[0];
    } catch (err) {
      throw new Error(
        `Cannot find the alive chain provider url with chainId: ${chainId}`
      );
    }
    // return chains[0].provider_urls[0];
  } else {
    throw new Error(
      `Cannot find the chain provider url with chainId: ${chainId}`
    );
  }
};

export const format = (bigNumber) =>
  bigNumber.toFormat().replaceAll(',', '').toString();

export const normalizeChainId = (chainId) => {
  let res = chainId;
  if (typeof chainId === 'number') {
    res = chainId.toString();
  }
  return res;
};
