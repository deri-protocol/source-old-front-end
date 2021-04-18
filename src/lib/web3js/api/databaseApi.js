import { databaseFactory } from "../factory/contracts";
import {
  toChecksumAddress,
  getNetworkName,
  deriToString,
  deriToBool,
  deriToNatural,
  getPoolContractAddress,
} from "../utils";
//import { getLiquidityUsed } from "./contractApi";

export const getUserInfo = async (userAddress) => {
  const db = databaseFactory(true)
  userAddress = toChecksumAddress(userAddress)
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
    .catch((err) => console.log("getUserInfo", err));
  if (res) {
    let [chainId, amount, deadline, nonce, v, r, s, valid] = res;
    return {
      chainId: deriToString(chainId),
      amount: deriToNatural(amount),
      deadline: deriToString(deadline),
      nonce: deriToString(nonce),
      v: deriToString(v),
      r: r,
      s: s,
      valid: deriToBool(valid),
    };
  }
};

export const getUserInfoHarvest = async (userAddress) => {
  const db = databaseFactory(true)
  userAddress = toChecksumAddress(userAddress)
  const res = await db
    .getValues([
      `${userAddress}.claim.harvest.lp`,
      `${userAddress}.claim.harvest.trade`,
    ])
    .catch((err) => console.log("getUserInfoHarvest", err));
  if (res) {
    let [harvestLp, harvestTrade] = res;
    return {
      lp: deriToNatural(harvestLp),
      trade: deriToNatural(harvestTrade),
    };
  }
};

export const getUserInfoTotal = async (userAddress) => {
  const db = databaseFactory(true)
  userAddress = toChecksumAddress(userAddress)
  const res = await db
    .getValues([`${userAddress}.claim.total`])
    .catch((err) => console.log("getUserInfoTotal", err));
  if (res) {
    let [total] = res;
    return {
      total: deriToString(total),
    };
  }
};

export const getUserInfoAll = async(userAddress) => {
  try {
    let userInfo = await getUserInfo(userAddress)
    let userInfoHarvest = await getUserInfoHarvest(userAddress)
    let userInfoTotal= await getUserInfoTotal(userAddress)
    return Object.assign(userInfo, userInfoHarvest, userInfoTotal)
  } catch (err) {
    //console.log(err)
    throw err
  }
}
export const getPoolLiquidity = async (chainId, poolAddress) => {
  // use the dev database
  const db = databaseFactory()
  try {
    const res = await db
      .getValues([
        `${chainId}.${poolAddress}.liquidity`,
      ])
      .catch((err) => console.log("getPoolLiquidity", err));
    if (res) {
      let [liquidity] = res;
      return {
        liquidity: deriToNatural(liquidity).toString(),
      };
    }
  } catch (err) {
    console.log(err);
  }
};


export const getPoolInfoApy = async (chainId, bSymbol) => {
  const db = databaseFactory(true)
  const [poolAddress] = getPoolContractAddress(chainId, bSymbol);
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.apy`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ])
      .catch((err) => console.log("getPoolInfoApy", err));
    if (res) {
      let [apy, volume1h, volume24h] = res;
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

export const getSlpPoolInfoApy = async (chainId, poolAddress) => {
  const db = databaseFactory(true)
  //const { pool: poolAddr} = getSlpContractAddress(chainId, poolAddress);

  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.apy`,
        `${poolNetwork}.${poolAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.volume.24h`,
      ])
      .catch((err) => console.log("getPoolInfoApy", err));
    if (res) {
      let [apy, volume1h, volume24h] = res;
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

export const getUserInfoInPool = async (chainId, bSymbol, userAddress) => {
  const db = databaseFactory(true)
  const [poolAddress] = getPoolContractAddress(chainId, bSymbol);
  userAddress = toChecksumAddress(userAddress)
  try {
    const poolNetwork = getNetworkName(chainId);
    const res = await db
      .getValues([
        `${poolNetwork}.${poolAddress}.${userAddress}.volume.1h`,
        `${poolNetwork}.${poolAddress}.${userAddress}.volume.24h`,
      ])
      .catch((err) => console.log("getUserInfoInPool", err));
    if (res) {
      let [volume1h, volume24h] = res;
      return {
        volume1h: deriToString(volume1h),
        volume24h: deriToString(volume24h),
      };
    }
  } catch (err) {
    console.log(err);
  }
};