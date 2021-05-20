import {
  bTokenFactory,
  lTokenFactory,
  pTokenFactory,
  perpetualPoolFactory,
  miningVaultPoolFactory,
  miningVaultRouterFactory,
  wormholeFactory,
  deriFactory,
  databaseWormholeFactory,
} from '../factory/contracts';
import { getUserInfoAll, getUserInfoAllForAirDrop } from './databaseApi';
import {
  getPoolContractAddress,
  getMiningVaultContractAddress,
  getBTCUSDPrice,
  bg,
  naturalToDeri,
  BigNumber,
  format,
  getDeriContractAddress,
} from '../utils';
import {
  getMiningVaultRouterContractAddress
} from '../config'
import {
  calculateMaxRemovableShares,
  calculateMaxWithdrawMargin,
  isOrderValid,
} from '../calculation';

/**
 * Unlock the account in the perpetual pool
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
export const unlock = async (chainId, poolAddress, accountAddress) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
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
 * Deposit margin in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string|number} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const depositMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  return await pPool.depositMargin(accountAddress, naturalToDeri(amount));
};

/**
 * Withdraw margin in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const withdrawMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  let res;
  const { pTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const pToken = pTokenFactory(chainId, pTokenAddress, poolAddress);
  //pToken.setAccount(accountAddress);

  const price = await getBTCUSDPrice(chainId, poolAddress);
  const { volume, margin, cost } = await pToken.getPositionInfo(accountAddress);
  const { multiplier, minInitialMarginRatio } = await pPool.getParameters();

  const maxWithdrawMargin = calculateMaxWithdrawMargin(
    price,
    volume,
    margin,
    cost,
    multiplier,
    minInitialMarginRatio
  );
  if (bg(amount).lte(maxWithdrawMargin)) {
    try {
      const tx = await pPool._transactPool(
        'withdrawMargin(uint256,uint256,uint256,uint8,bytes32,bytes32)',
        [naturalToDeri(amount)],
        accountAddress
      );
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'amount exceeds allowed' };
  }
  return res;
};

/**
 * Mint in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const mint = async (chainId, poolAddress, accountAddress, amount) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);
  const decimals = await bToken.decimals();
  const BONE = 10 ** decimals;
  amount = format(new BigNumber(amount).multipliedBy(BONE));
  let res;
  try {
    const tx = await bToken._transact('mint', [amount], accountAddress);
    res = { success: true, transaction: tx };
  } catch (error) {
    res = { success: false, error };
  }
  return res;
};

/**
 * Add liquidity in the perpertual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const addLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  let res;
  try {
    const tx = await pPool._transactPool(
      'addLiquidity(uint256,uint256,uint256,uint8,bytes32,bytes32)',
      [naturalToDeri(amount)],
      accountAddress
    );
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res;
};

/**
 * Remove liquidity in the perpertual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string} shares
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const removeLiquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  shares
) => {
  const { lTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const lToken = lTokenFactory(chainId, lTokenAddress, poolAddress);
  //lToken.setAccount(accountAddress);
  const price = await getBTCUSDPrice(chainId, poolAddress);
  const [lTokenBalance, lTokenTotalSupply] = await Promise.all([
    lToken.balance(accountAddress),
    lToken.totalSupply(),
  ]);
  const { multiplier, minPoolMarginRatio } = await pPool.getParameters();
  const {
    liquidity,
    tradersNetVolume,
    tradersNetCost,
  } = await pPool.getStateValues();

  const maxRemovableShares = calculateMaxRemovableShares(
    lTokenBalance,
    lTokenTotalSupply,
    liquidity,
    tradersNetVolume,
    tradersNetCost,
    multiplier,
    minPoolMarginRatio,
    price
  );
  let res;
  if (bg(shares).lte(maxRemovableShares)) {
    try {
      const tx = await pPool._transactPool(
        'removeLiquidity(uint256,uint256,uint256,uint8,bytes32,bytes32)',
        [naturalToDeri(shares)],
        accountAddress
      );
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'shares exceeds allowed' };
  }
  return res;
};

/**
 * Trade with margin in the perpertual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string} newVolume
 * @param {string} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const tradeWithMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  newVolume,
  amount = '0'
) => {
  const price = await getBTCUSDPrice(chainId, poolAddress);
  const { pTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const pToken = pTokenFactory(chainId, pTokenAddress, poolAddress);
  //pToken.setAccount(accountAddress);
  const {
    multiplier,
    minInitialMarginRatio,
    minPoolMarginRatio,
  } = await pPool.getParameters();
  const { liquidity, tradersNetVolume } = await pPool.getStateValues();
  const { volume, margin } = await pToken.getPositionInfo(accountAddress);
  let res;
  const orderValidation = isOrderValid(
    price,
    margin,
    volume,
    liquidity,
    tradersNetVolume,
    multiplier,
    minPoolMarginRatio,
    minInitialMarginRatio,
    bg(newVolume),
    bg(amount)
  );
  if (orderValidation.success) {
    try {
      const tx = await pPool._transactPool(
        'tradeWithMargin(int256,uint256,uint256,uint256,uint8,bytes32,bytes32)',
        [naturalToDeri(newVolume), naturalToDeri(amount)],
        accountAddress
      );
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: orderValidation.message };
  }
  return res;
};

/**
 * Close position in the perpertual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const closePosition = async (chainId, poolAddress, accountAddress) => {
  const { pTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const pToken = pTokenFactory(chainId, pTokenAddress, poolAddress);
  //pToken.setAccount(accountAddress);
  let { volume } = await pToken.getPositionInfo(accountAddress);
  volume = volume.negated();
  let res;
  if (!volume.eq(0)) {
    try {
      const tx = await pPool._transactPool(
        'tradeWithMargin(int256,uint256,uint256,uint256,uint8,bytes32,bytes32)',
        [naturalToDeri(volume), '0'],
        accountAddress
      );
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'no position to close' };
  }
  return res;
};

/**
 * Mint DToken in the perpertual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const mintDToken = async (chainId, accountAddress) => {
  let res;
  const userInfo = await getUserInfoAll(accountAddress);
  const amount = naturalToDeri(userInfo.amount);
  const { deadline } = userInfo;
  const { nonce } = userInfo;
  const { v } = userInfo;
  const { r } = userInfo;
  const { s } = userInfo;
  if (userInfo.valid) {
    const miningVaultAddress = getMiningVaultContractAddress(chainId);
    if (miningVaultAddress) {
      const miningVault = miningVaultPoolFactory(chainId, miningVaultAddress);
      //miningVault.setAccount(accountAddress);
      try {
        const tx = await miningVault.mintDToken(
          accountAddress,
          amount,
          deadline,
          nonce,
          v,
          r,
          s
        );
        res = { success: true, transaction: tx };
      } catch (err) {
        res = { success: false, error: err };
      }
    } else {
      res = {
        success: false,
        error: `cannot find the mining vault address in chain ${chainId}`,
      };
    }
  } else {
    res = {
      success: false,
      error: 'userinfo is not valid',
    };
  }
  return res;
};

/**
 * freeze Deri in current wormhole pool to the specified chain
 * @async
 * @method
 * @param {string} chainId
 * @param {string} accountAddress
 * @param {string} toChainId
 * @param {string} amount
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const freeze = async (chainId, accountAddress, toChainId, amount) => {
  const { wormholeAddress } = getDeriContractAddress(chainId);
  const wormhole = wormholeFactory(chainId, wormholeAddress);
  //wormhole.setAccount(accountAddress);
  let res;
  try {
    const tx = await wormhole.freeze(accountAddress, amount, toChainId);
    res = { success: true, transaction: tx };
  } catch (error) {
    res = { success: false, error };
  }
  return res;
};

/**
 * Mint Deri in wormhole pool
 * @async
 * @method
 * @param {string} toChainId
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const mintDeri = async (toChainId, accountAddress) => {
  let res;
  const databaseWormhole = databaseWormholeFactory(true);
  // const userInfo = await getUserInfoAll(accountAddress);
  const userInfo = await databaseWormhole.signature(accountAddress);
  // console.log(userInfo)
  const { amount } = userInfo;
  const { fromChainId } = userInfo;
  const { fromWormhole } = userInfo;
  const fromNonce = userInfo.nonce;
  const { v } = userInfo;
  const { r } = userInfo;
  const { s } = userInfo;
  if (userInfo.valid) {
    const { wormholeAddress } = getDeriContractAddress(toChainId);
    if (wormholeAddress) {
      const wormhole = wormholeFactory(toChainId, wormholeAddress);
      //wormhole.setAccount(accountAddress);
      try {
        const tx = await wormhole.mintDeri(
          accountAddress,
          amount,
          fromChainId,
          fromWormhole,
          fromNonce,
          v,
          r,
          s
        );
        res = { success: true, transaction: tx };
      } catch (err) {
        res = { success: false, error: err };
      }
    } else {
      res = {
        success: false,
        error: `cannot find the wormhole address in chain ${fromChainId}`,
      };
    }
  } else {
    res = {
      success: false,
      error: 'userinfo is not valid',
    };
  }
  return res;
};

/**
 * Unlock the account in the deri pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {string} response.[error]
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const unlockDeri = async (chainId, accountAddress) => {
  const { wormholeAddress, deriAddress } = getDeriContractAddress(chainId);
  const deri = deriFactory(chainId, deriAddress, wormholeAddress);
  //deri.setAccount(accountAddress).setPool(wormholeAddress);
  let res;
  try {
    const tx = await deri.unlock(accountAddress);
    res = { success: true, transaction: tx };
  } catch (error) {
    res = { success: false, error };
  }
  return res;
};

/**
 * Mint Airdrop in the perpertual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {boolean} response.success
 * @returns {boolean} response.[error] - error message when request failed
 * @returns {Object} response.transaction - eth transaction receipt object
 */
export const mintAirdrop = async (chainId, accountAddress) => {
  let res;
  const userInfo = await getUserInfoAllForAirDrop(accountAddress);
  const amount = naturalToDeri(userInfo.amount).toString();
  const { deadline, nonce, v1, r1, s1, v2, r2, s2 } = userInfo;
  if (userInfo.valid) {
    const miningVaultAddress = getMiningVaultRouterContractAddress(chainId);
    // console.log("miningVaultAddress", miningVaultAddress)
    // console.log("userInfo", userInfo)
    if (miningVaultAddress) {
      const miningVaultRouter = miningVaultRouterFactory(
        chainId,
        miningVaultAddress
      );
      try {
        const tx = await miningVaultRouter.mint(
          accountAddress,
          amount,
          deadline,
          nonce,
          v1,
          r1,
          s1,
          v2,
          r2,
          s2
        );
        res = { success: true, transaction: tx };
      } catch (err) {
        res = { success: false, error: err };
      }
    } else {
      res = {
        success: false,
        error: `cannot find the mining vault router address in chain ${chainId}`,
      };
    }
  } else {
    res = {
      success: false,
      error: 'userinfo is not valid',
    };
  }
  return res;
};
