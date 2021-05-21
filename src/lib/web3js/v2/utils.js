import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { getChainProviderUrls } from './config/chain';

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
export const fromWei = (value, unit='ether') => {
  return Web3.utils.fromWei(value, unit)
}
export const toWei = (value, unit='ether') => {
  return Web3.utils.toWei(value, unit)
}
export const toNatural = (value, num = 0) =>
  BigNumber(value).toFixed(num).toString();

export const toHex = (value) => Web3.utils.toHex(value);

export const toChecksumAddress = (value) => Web3.utils.toChecksumAddress(value);

export const hexToString = (value) => Web3.utils.hexToUtf8(value);

export const hexToNumber = (value) => Web3.utils.hexToNumber(value);

export const hexToNumberString = (value) => Web3.utils.hexToNumberString(value);

export const hexToDeri = (value) => bg(hexToNumberString(value));

export const hexToNatural = (value) => bg(hexToNumberString(value), -18);

export const deriToNatural = (value) => bg(value, -18);

export const naturalToDeri = (value) => bg(value, 18).toFixed(0);

// == convert
export const numberToHex = (value) => {
  return Web3.utils.numberToHex(value);
};

// == func
const np = () => {}
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// == network
// fetchWithTimeout
// const fetchWithTimeout = (url, delay=2000, options={}, onTimeout=np) => {
//   const timer = new Promise((resolve) => {
//     setTimeout(resolve, delay, {
//       timeout: true,
//     });
//   });
//   return Promise.race([fetch(url, options), timer]).then((response) => {
//     if (response.timeout) {
//       onTimeout();
//     }
//     return response;
//   });
// };
export const fetchWithTimeout = (url, options = {}) => {
  const { timeout = 1200, ...fetchOptions } = options

  return Promise.race([
    fetch(url, fetchOptions),
    new Promise((resolve) => {
      setTimeout(() => {
        // reject(
        //   new Error(
        //     `Request for ${url} timed out after ${timeout} ms`,
        //   ),
        // )
        resolve({timeout:true})
      }, timeout)
    }),
  ])
}

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
    //console.log(url)
    if (await checkHttpServerIsAlive(url)) {
      return url;
    }
  }
  throw new Error('No alive http server in urls', urls);
};


// validate
export const normalizeChainId = (chainId) => {
  const chainIds = ['1', '56', '128', '3', '42', '97', '256'];
  let res = chainId ? chainId.toString() : chainId;
  if (chainId && chainIds.includes(res)) {
    return res;
  } else {
    throw new Error(`invalid chainId: ${chainId}`);
  }
};

export const normalizeAddress = (address) => {
  if (address && typeof address === 'string' && address.startsWith('0x')) {
    return Web3.utils.toChecksumAddress(address);
  } else {
    throw new Error(`invalid address: ${address}`);
  }
};


export const getChainProviderUrl = async (chainId) => {
  chainId = normalizeChainId(chainId);
  const urls = getChainProviderUrls(chainId);
  if (urls.length > 0) {
    return await getAliveHttpServer(urls);
  } else {
    throw new Error(
      `Cannot find the chain provider url with chainId: ${chainId}`
    );
  }
};
