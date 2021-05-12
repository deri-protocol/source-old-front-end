import {
  addSlpLiquidity,
  getSlpLiquidityInfo,
  getSlpWalletBalance,
  isSlpUnlocked,
  removeSlpLiquidity,
  unlockSlp,
} from './slpPoolApi';
import {
  addClpLiquidity,
  getClpLiquidityInfo,
  removeClpLiquidity,
  isClpUnlocked,
  getClpWalletBalance,
  unlockClp,
} from './clpPoolApi';
import { getLpContractAddress } from '../utils';

/**
 * Get liquidity info of LP pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {string} response.liquidity
 * @returns {string} response.bTokenBalance
 * @returns {string} response.shares
 */
export const getLpLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { type } = getLpContractAddress(chainId, poolAddress);
  if (type === 'slp') {
    return await getSlpLiquidityInfo(chainId, poolAddress, accountAddress);
  } else if (type === 'clp') {
    return await getClpLiquidityInfo(chainId, poolAddress, accountAddress);
  } else {
    console.log(`getLpLiquidityInfo(): invalid lp type ${type}`);
  }
};

/**
 * Add liquidity to LP pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {number} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {string} response.[error]
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const addLpLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  const { type } = getLpContractAddress(chainId, poolAddress);
  if (type === 'slp') {
    return await addSlpLiquidity(chainId, poolAddress, accountAddress, amount);
  } else if (type === 'clp') {
    return await addClpLiquidity(chainId, poolAddress, accountAddress, amount);
  } else {
    console.log(`addLpLiquidity(): invalid lp type ${type}`);
  }
};

/**
 * Remove liquidity to LP pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {number} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {string} response.[error]
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const removeLpLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  const { type } = getLpContractAddress(chainId, poolAddress);
  if (type === 'slp') {
    return await removeSlpLiquidity(
      chainId,
      poolAddress,
      accountAddress,
      amount
    );
  } else if (type === 'clp') {
    return await removeClpLiquidity(
      chainId,
      poolAddress,
      accountAddress,
      amount
    );
  } else {
    console.log(`removeLpLiquidity(): invalid lp type ${type}`);
  }
};

/**
 * Check account is unlocked in the lp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {bool}
 */
export const isLpUnlocked = async (chainId, poolAddress, accountAddress) => {
  const { type } = getLpContractAddress(chainId, poolAddress);
  if (type === 'slp') {
    return await isSlpUnlocked(chainId, poolAddress, accountAddress);
  } else if (type === 'clp') {
    return await isClpUnlocked(chainId, poolAddress, accountAddress);
  } else {
    console.log(`isLpLiquidity(): invalid lp type ${type}`);
  }
};

/**
 * Unlock the account in the lp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {string} response.[error]
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const unlockLp = async (chainId, poolAddress, accountAddress) => {
  const { type } = getLpContractAddress(chainId, poolAddress);
  if (type === 'slp') {
    return await unlockSlp(chainId, poolAddress, accountAddress);
  } else if (type === 'clp') {
    return await unlockClp(chainId, poolAddress, accountAddress);
  } else {
    console.log(`unlockLp(): invalid lp type ${type}`);
  }
};

/**
 * Get account balance in lp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} accountAddress
 * @returns {string} Account balance
 */
export const getLpWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { type } = getLpContractAddress(chainId, poolAddress);
  if (type === 'slp') {
    return await getSlpWalletBalance(chainId, poolAddress, accountAddress);
  } else if (type === 'clp') {
    return await getClpWalletBalance(chainId, poolAddress, accountAddress);
  } else {
    console.log(`getLpWalletBalance(): invalid lp type ${type}`);
  }
};
