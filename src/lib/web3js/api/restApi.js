// const
import { bg } from '../utils';
import { getRestServerConfig } from '../config';

const HTTP_BASE = getRestServerConfig();

const fetchJson = async (url) => {
  const resp = await fetch(url);
  return await resp.json();
};

/**
 * Get specification from REST API, please refer {@link getSpecification}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object}
 */
export const getSpecification2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/specification/${poolAddress}`);
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get funding rate from REST API, please refer {@link getFundingRate}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object}
 */
export const getFundingRate2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/funding_rate/${poolAddress}`);
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get liquidity used from REST API, please refer {@link getLiquidityUsed}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object}
 */
export const getLiquidityUsed2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/liquidity_used/${poolAddress}`);
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get funding rate cache from REST API, it used to 'fundingRateCache.update(chainId, poolAddress, result)'
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object}
 */
export const getFundingRateCache2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/funding_rate_cache/${poolAddress}`);
  if (res && res.success) {
    let result = res.data;
    result.price = bg(result.price);
    result.fundingRate = bg(result.fundingRate);
    result.liquidityUsed = bg(result.liquidityUsed);
    return result;
  }
  return res;
};

/**
 * Get position info from REST API, please refer {@link getPositionInfo}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getPositionInfo2 = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const res = await fetchJson(
    `${HTTP_BASE}/position_info/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get liquidity info from REST API, please refer {@link getLiquidityInfo}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getLiquidityInfo2 = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const res = await fetchJson(
    `${HTTP_BASE}/liquidity_info/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get balance from REST API, please refer {@link getWalletBalance}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getWalletBalance2 = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const res = await fetchJson(
    `${HTTP_BASE}/wallet_balance/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get liquidity of the slp pool from REST API, please refer {@link getSlpLiquidityInfo}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getSlpLiquidityInfo2 = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const res = await fetchJson(
    `${HTTP_BASE}/slp_liquidity_info/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get balance of the slp pool from REST API, please refer {@link getSlpWalletBalance}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getSlpWalletBalance2 = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const res = await fetchJson(
    `${HTTP_BASE}/slp_wallet_balance/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};

/**
 * Get balance of the deri pool from REST API, please refer {@link getDeriBalance}
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getDeriBalance2 = async (chainId, poolAddress, accountAddress) => {
  const res = await fetchJson(
    `${HTTP_BASE}/deri_balance/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};
