import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import {
  DeriEnv,
  getChainProviderUrlsConfig,
  getContractAddressConfig,
  getSlpContractAddressConfig,
  getClpContractAddressConfig,
  getClp2ContractAddressConfig,
  getLpContractAddressConfig,
  getDailyBlockNumberConfig,
  getDeriContractAddressConfig,
  getChainIds,
} from './config';

/** @module utils */

BigNumber.config({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN,
  EXPONENTIAL_AT: 256,
});

export { BigNumber };

/**
 * Change the value to BigNumber type
 * @func
 * @param {string|number} value - the number that need to changed to BigNumber type
 * @param {string} base - base of the number
 * @returns {BigNumber}
 */
export const bg = (value, base = 0) => {
  if (base === 0) {
    return BigNumber(value);
  }
  if (base > 0) {
    return BigNumber(value).times(BigNumber(`1${'0'.repeat(base)}`));
  }
  return BigNumber(value).div(BigNumber(`1${'0'.repeat(-base)}`));
};

/**
 * Get the max value
 * @func
 * @param {BigNumber} value1
 * @param {BigNumber} value2
 * @returns {BigNumber}
 */
export const max = (value1, value2) => {
  if (value1.gte(value2)) {
    return value1;
  }
  return value2;
};

/**
 * Get the min value
 * @func
 * @param {BigNumber} value1
 * @param {BigNumber} value2
 * @returns {BigNumber}
 */
export const min = (value1, value2) => {
  if (value1.lte(value2)) {
    return value1;
  }
  return value2;
};

/**
 * Convert the number to a fixed precision
 * @func
 * @param {string} value - the number that need to convert
 * @param {number} num - the number for method toFixed()
 * @returns {string}
 */
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

//const np = () => {}
//const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// http
export const checkHttpServerIsAlive = async (url) => {
  try {
    //const response = await fetch(url);
    const response = await fetch(url);
    if (response.ok) {
      return true;
    }
  } catch (err) {
    //console.log(err);
  }
  return false;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const getAliveHttpServer = async (urls = []) => {
  urls = shuffleArray(urls)
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (await checkHttpServerIsAlive(url)) {
      //console.log(url)
      return url;
    }
  }
  throw new Error('No alive http server in urls', urls);
};

const getBlockNumber = async (url) => {
  let res = { url: url, blockNumber: -1, duration: Number.MAX_SAFE_INTEGER,};
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    const startTime = Date.now()
    res.blockNumber = await web3.eth.getBlockNumber()
    res.duration = Date.now() - startTime
  } catch (err) {
    console.log(`getBlockNumber(${url}) error: ${err}`)
  }
  return res
};

export const getLatestRPCServer = async (urls = []) => {
  urls = shuffleArray(urls)
  let promises = []
  for (let i = 0; i < urls.length; i++) {
    promises.push(getBlockNumber(urls[i]));
  }
  let blockNumbers = await Promise.all(promises)
  blockNumbers = blockNumbers.sort((a, b) => a.duration - b.duration)
  //console.log('blockNumbers',  blockNumbers)
  const latestBlockNumber = blockNumbers.reduce((a, b) => b.blockNumber !== -1 ? a > b.blockNumber ? a : b.blockNumber : a, 0)
  const index = blockNumbers.findIndex((b) => b.blockNumber === latestBlockNumber);
  const res = blockNumbers[index].url
  //console.log(res)
  if (res.startsWith('http')) {
    return res
  } else {
    throw new Error(`getLatestRPCServer(): cannot find alive RPC server in ${urls}`)
  }
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
    case '137':
      poolNetwork = 'matic';
      break;
    case '80001':
      poolNetwork = 'mumbai';
      break;
    default:
      throw new Error(`The networkId is not valid for chainId ${chainId}`);
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
      unit: pool[0].unit,
      initialBlock: pool[0].initialBlock,
    };
  }
  // console.log(
  //   `getPoolContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  // );
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

// export const getMiningVaultRouterContractAddress = (chainId) => {
//   chainId = normalizeChainId(chainId);
//   const pools = getContractAddressConfig(DeriEnv.get()).filter(
//     (c) => c.chainId === chainId
//   );
//   if (pools.length > 0) {
//     if (pools[0].MiningVaultRouter) {
//       return pools[0].MiningVaultRouter;
//     }
//   }
// };

export const getDailyBlockNumber = (chainId) => {
  const blockNumbers = getDailyBlockNumberConfig();
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
      poolAddress: pool[0].pool,
      bTokenAddress: pool[0].bToken,
      pTokenAddress: pool[0].pToken,
      lTokenAddress: pool[0].lToken,
      dTokenAdress: pool[0].dToken,
      MinningVaultAddress: pool[0].MiningVault,
    };
  }
  console.log(
    `getSlpContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  );
  return {};
};

export const getClp2ContractAddress = (chainId, poolAddress) => {
  chainId = normalizeChainId(chainId);
  const pools = getClp2ContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  if (pool.length > 0) {
    return {
      poolAddress: pool[0].pool,
      bTokenAddress: pool[0].bToken,
      pTokenAddress: pool[0].pToken,
      lTokenAddress: pool[0].lToken,
      dTokenAdress: pool[0].dToken,
      MinningVaultAddress: pool[0].MiningVault,
    };
  }
  console.log(
    `getClp2ContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  );
  return {};
};

export const getClpContractAddress = (chainId, poolAddress) => {
  chainId = normalizeChainId(chainId);
  const pools = getClpContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  if (pool.length > 0) {
    return {
      poolAddress: pool[0].pool,
      bTokenAddress: pool[0].bToken,
      lTokenAddress: pool[0].lToken,
    };
  }
  console.log(
    `getClpContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
  );
  return {};
};

export const getLpContractAddress = (chainId, poolAddress) => {
  chainId = normalizeChainId(chainId);
  const pools = getLpContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  const pool = pools.filter((p) => p.pool === poolAddress);
  if (pool.length > 0) {
    return {
      poolAddress: pool[0].pool,
      bTokenAddress: pool[0].bToken,
      lTokenAddress: pool[0].lToken,
      type: pool[0].type,
    };
  }
  console.log(
    `getLpContractAddress(): contract address is not found: ${chainId} ${poolAddress}`
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

export const getOracleUrl = (chainId, poolAddress) => {
  const env = DeriEnv.get()
  const { symbol } = getPoolContractAddress(chainId, poolAddress);
  const addSymbolParam = (url, symbol='BTCUSD') => `${url}?symbol=${symbol}`;
  if (env === 'prod' || env === 'production') {
    // for production
    if (symbol) {
      return addSymbolParam('https://oracle4.deri.finance/price', symbol);
    }
    return 'https://oracle4.deri.finance/price';
  } else {
    if (symbol) {
      return addSymbolParam('https://oracle2.deri.finance/price', symbol);
    }
    // for test
    return 'https://oracle2.deri.finance/price';
  }
};

export const getOracleInfo = async (chainId, poolAddress) => {
  let url = getOracleUrl(chainId, poolAddress);
  //console.log('oracle url', url);
  let retry = 2;
  //let timeout = 1000;
  let res;
  while (retry > 0) {
    res = await fetch(url, { mode: 'cors', cache: 'no-cache' });
    //if (res && !res.timeout) {
    if (res.ok) {
      break;
    }
    //console.log('get oracle info timeout')
    retry -= 1;
    //timeout += 800;
  }
  if (retry === 0 && !res) {
    throw new Error(`fetch oracle info error: exceed max retry(2).`);
  }
  return await res.json();
};

export const getBTCUSDPrice = async (chainId, poolAddress) => {
  const responseJson = await getOracleInfo(chainId, poolAddress);
  let price = responseJson.price;
  if (!price) {
    price = '0';
  }
  return deriToNatural(responseJson.price).toString();
};
export const getOraclePrice = getBTCUSDPrice;

export const getChainProviderUrl = async(chainId) => {
  chainId = normalizeChainId(chainId);
  const urls = getChainProviderUrlsConfig(chainId)
  if (urls.length > 0) {
    return await getLatestRPCServer(urls)
  } else {
    throw new Error(
      `Cannot find the chain provider url with chainId: ${chainId}`
    );
  }
};

export const format = (bigNumber) =>
  bigNumber.toFormat().replaceAll(',', '').toString();

export const normalizeChainId = (chainId) => {
  const chainIds = getChainIds()
  let res = chainId ? chainId.toString() : chainId;
  if (chainId && chainIds.includes(res)) {
    return res;
  } else {
    throw new Error(`invalid chainId: ${chainId}`)
  }
};

export const normalizeAddress = (address) => {
  if (address && typeof address === 'string' && address.startsWith('0x')) {
    return Web3.utils.toChecksumAddress(address);
  } else {
    throw new Error(`invalid address: ${address}`)
  }
};