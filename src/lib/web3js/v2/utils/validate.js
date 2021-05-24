import Web3 from 'web3';

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

export const validateArgs = (...args) => args.every((i) => !isNaN(parseFloat(i)));