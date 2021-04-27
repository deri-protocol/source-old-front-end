import { bTokenFactory, slpPoolFactory } from '../factory/contracts';
import { getSlpContractAddress } from '../utils';

/**
 * Get liquidity info of SLP pool
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
export const getSlpLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  // console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress);
    //slpPool.setAccount(accountAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    //bToken.setAccount(accountAddress);
    const [liquidity, bTokenBalance, shares] = await Promise.all([
      bToken.balance(poolAddress),
      bToken.balance(accountAddress),
      slpPool.getLiquidity(accountAddress),
    ]);

    return {
      liquidity: liquidity.toString(),
      bTokenBalance: bTokenBalance.toString(),
      shares: shares.toString(),
    };
  }
  console.log('no SlpPool address, please check');
  return {};
};

/**
 * Add liquidity to SLP pool
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
export const addSlpLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  let res;
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  // console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress);
    //slpPool.setAccount(accountAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    //bToken.setAccount(accountAddress);
    try {
      const tx = await slpPool.addLiquidity(accountAddress, amount);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'unable to get bToken address of slp pool' };
  }
  return res;
};

/**
 * Remove liquidity to SLP pool
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
export const removeSlpLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  let res;
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  // console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress);
    //slpPool.setAccount(accountAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    //bToken.setAccount(accountAddress);
    try {
      const tx = await slpPool.removeLiquidity(accountAddress, amount);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'unable to get bToken address of slp pool' };
  }
  return res;
};

/**
 * Check account is unlocked in the Slp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {bool}
 */
export const isSlpUnlocked = async (chainId, poolAddress, accountAddress) => {
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);
  return await bToken.isUnlocked(accountAddress);
};

/**
 * Unlock the account in the Slp pool
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
export const unlockSlp = async (chainId, poolAddress, accountAddress) => {
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);

  let res;
  try {
    const tx = await bToken.unlock(accountAddress);
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res;
};

/**
 * Get account balance in Slp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} accountAddress
 * @returns {string} Account balance
 */
export const getSlpWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bToken: bTokenAddress } = getSlpContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};
