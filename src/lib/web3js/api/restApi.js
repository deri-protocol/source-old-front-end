// const
import { bg } from '../utils';
import { getRestServerConfig } from '../config';

const HTTP_BASE = getRestServerConfig();

const fetchJson = async (url) => {
  const resp = await fetch(url);
  return await resp.json();
};

export const getSpecification2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/specification/${poolAddress}`);
  if (res && res.success) {
    return res.data;
  }
  return res;
};

export const getFundingRate2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/funding_rate/${poolAddress}`);
  if (res && res.success) {
    return res.data;
  }
  return res;
};

export const getLiquidityUsed2 = async (chainId, poolAddress) => {
  const res = await fetchJson(`${HTTP_BASE}/liquidity_used/${poolAddress}`);
  if (res && res.success) {
    return res.data;
  }
  return res;
};

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

export const getDeriBalance2 = async (chainId, poolAddress, accountAddress) => {
  const res = await fetchJson(
    `${HTTP_BASE}/deri_balance/${chainId}/${poolAddress}/${accountAddress}`
  );
  if (res && res.success) {
    return res.data;
  }
  return res;
};
