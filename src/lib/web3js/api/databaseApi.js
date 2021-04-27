import { databaseFactory } from '../factory/contracts';
import {
  toChecksumAddress,
  getNetworkName,
  deriToString,
  deriToBool,
  deriToNatural,
  getPoolContractAddress,
} from '../utils';
// import { getLiquidityUsed } from "./contractApi";

export const getUserInfo = async (userAddress) => {
  const db = databaseFactory(true);
  userAddress = toChecksumAddress(userAddress);
  const res = await db
    .getValues([
      `${userAddress}.claim.chainId`,
      `${userAddress}.claim.amount`,
      `${userAddress}.claim.deadline`,
      `${userAddress}.claim.nonce`,
      `${userAddress}.claim.v`,
      `${userAddress}.claim.r`,
      `${userAddress}.claim.s`,
      `${userAddress}.claim.valid`,
    ])
    .catch((err) => console.log('getUserInfo', err));
  if (res) {
    const [chainId, amount, deadline, nonce, v, r, s, valid] = res;
    return {
      chainId: deriToString(chainId),
      amount: deriToNatural(amount),
      deadline: deriToString(deadline),
      nonce: deriToString(nonce),
      v: deriToString(v),
      r,
      s,
      valid: deriToBool(valid),
    };
  }
};

export const getUserInfoHarvest = async (userAddress) => {
  const db = databaseFactory(true);
  userAddress = toChecksumAddress(userAddress);
  const res = await db
    .getValues([
      `${userAddress}.claim.harvest.lp`,
      `${userAddress}.claim.harvest.trade`,
    ])
    .catch((err) => console.log('getUserInfoHarvest', err));
  if (res) {
    const [harvestLp, harvestTrade] = res;
    return {
      lp: deriToNatural(harvestLp),
      trade: deriToNatural(harvestTrade),
    };
  }
};

export const getUserInfoTotal = async (userAddress) => {
  const db = databaseFactory(true);
  userAddress = toChecksumAddress(userAddress);
  const res = await db
    .getValues([`${userAddress}.claim.total`])
    .catch((err) => console.log('getUserInfoTotal', err));
  if (res) {
    const [total] = res;
    return {
      total: deriToString(total),
    };
  }
};

/**
 * Get user claim info from database
 * @async
 * @method
 * @param {string} userAddress - account address
 * @returns {Object} response
 * @returns {string} resposne.chainId
 * @returns {BigNumber} response.amount
 * @returns {string} response.deadline
 * @returns {string} response.nonce
 * @returns {string} response.v
 * @returns {string} response.r
 * @returns {string} response.s
 * @returns {bool} response.valid
 * @returns {BigNumber} response.lp
 * @returns {BigNumber} response.trade
 * @returns {string} response.total
 */
export const getUserInfoAll = async (userAddress) => {
  const userInfo = await getUserInfo(userAddress);
  const userInfoHarvest = await getUserInfoHarvest(userAddress);
  const userInfoTotal = await getUserInfoTotal(userAddress);
  return Object.assign(userInfo, userInfoHarvest, userInfoTotal);
};

/**
 * Get pool liquidity
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {string} response.liquidity
 * @returns {symbol} response.symbol
 */
export const getPoolLiquidity = async (chainId, poolAddress) => {
  // use the dev database
  const db = databaseFactory();
  try {
    const res = await db
      .getValues([`${chainId}.${poolAddress}.liquidity`])
      .catch((err) => console.log('getPoolLiquidity', err));
    const { symbol } = getPoolContractAddress(chainId, poolAddress)
    if (res) {
      const [liquidity] = res;
      return {
        liquidity: deriToNatural(liquidity).toString(),
        symbol,
      };
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get pool apy
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {string} response.apy
 * @returns {string} response.volume1h
 * @returns {string} response.volume24h
 */
export const getPoolInfoApy = async (chainId, poolAddress) => {
  const db = databaseFactory(true);
  //const [poolAddress] = getPoolContractAddress(chainId, bSymbol);
  //console.log('getPoolInfoApy', chainId, poolAddress);
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.apy`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ])
      .catch((err) => console.log('getPoolInfoApy', err));
    if (res) {
      const [apy, volume1h, volume24h] = res;
      return {
        apy: deriToString(apy),
        volume1h: deriToString(volume1h),
        volume24h: deriToString(volume24h),
      };
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get apy of the Slp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {string} response.apy
 * @returns {string} response.volume1h
 * @returns {string} response.volume24h
 */
export const getSlpPoolInfoApy = async (chainId, poolAddress) => {
  const db = databaseFactory(true);
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.apy`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ])
      .catch((err) => console.log('getPoolInfoApy', err));
    if (res) {
      const [apy, volume1h, volume24h] = res;
      return {
        apy: deriToString(apy),
        volume1h: deriToString(volume1h),
        volume24h: deriToString(volume24h),
      };
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get apy of the Clp pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {string} response.apy
 * @returns {string} response.volume1h
 * @returns {string} response.volume24h
 */
export const getClpPoolInfoApy = async (chainId, poolAddress) => {
  const db = databaseFactory(true);
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.apy`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ])
      .catch((err) => console.log('getPoolInfoApy', err));
    if (res) {
      const [apy, volume1h, volume24h] = res;
      return {
        apy: deriToString(apy),
        volume1h: deriToString(volume1h),
        volume24h: deriToString(volume24h),
      };
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get user info of the pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} userAddress
 * @returns {Object} response
 * @returns {string} response.volume1h
 * @returns {string} response.volume24h
 */
export const getUserInfoInPool = async (chainId, poolAddress, userAddress) => {
  const db = databaseFactory(true);
  //const {poolAddress} = getPoolContractAddress(chainId, poolAddress);
  userAddress = toChecksumAddress(userAddress);
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.${userAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.${userAddress}.volume.24h`,
      ])
      .catch((err) => console.log('getUserInfoInPool', err));
    if (res) {
      const [volume1h, volume24h] = res;
      return {
        volume1h: deriToString(volume1h),
        volume24h: deriToString(volume24h),
      };
    }
  } catch (err) {
    console.log(err);
  }
};
