import {
  bTokenFactory,
  lTokenFactory,
  pTokenFactory,
  perpetualPoolFactory,
  deriFactory,
  databaseWormholeFactory,
} from '../factory/contracts';
import { getPoolInfoApy } from './databaseApi';
import {
  fundingRateCache,
  PerpetualPoolParametersCache,
  priceCache,
} from './apiGlobals';
import {
  hasInvalidArgsValue,
  naturalWithPercentage,
  deriToNatural,
  getPoolContractAddress,
  getBTCUSDPrice,
  bg,
  BigNumber,
  getDeriContractAddress,
} from '../utils';
import {
  calculateFundingRate,
  calculateLiquidityUsed,
  calculateShareValue,
  calculateMaxRemovableShares,
  calculateEntryPrice,
  calculateMarginHeld,
  calculatePnl,
  calculateLiquidationPrice,
  processFundingRate,
} from '../calculation';

/**
 * Get the contract information
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {string} response.addresses
 * @returns {string} response.symbol
 * @returns {string} response.bSymbol
 * @returns {string} response.multiplier
 * @returns {string} response.feeRatio
 * @returns {string} response.minPoo
 * @returns {string} response.minPoolMarginRatio
 * @returns {string} response.minInitialMarginRatio
 * @returns {string} response.minMaintenanceMarginRatio
 * @returns {string} response.minAddLiquidity
 * @returns {string} response.redemptionFeeRatio
 * @returns {string} response.fundingRateCoefficient
 * @returns {string} response.minLiquidationReward
 * @returns {string} response.maxLiquidationReward
 * @returns {string} response.liquidationCutRatio
 * @returns {string} response.priceDelayAllowance
 */
export const getSpecification = async (
  chainId,
  poolAddress,
  //accountAddress,
) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);
  const {
    multiplier,
    feeRatio,
    minPoolMarginRatio,
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
    minAddLiquidity,
    redemptionFeeRatio,
    fundingRateCoefficient,
    minLiquidationReward,
    maxLiquidationReward,
    liquidationCutRatio,
    priceDelayAllowance,
  } = await pPool.getParameters();
  let symbol = await pPool.symbol();
  const bSymbolRaw = await bToken.symbol();

  // fix symbol BTCUSD issue, will remove later
  // if (poolAddress === '0xA2D7316Bc60AA9463DfB78379d25E77371990507') {
  //   symbol = 'iMEME'
  // }

  return {
    addresses: poolAddress,
    symbol,
    bSymbol: bSymbolRaw,
    multiplier: multiplier.toString(),
    feeRatio: feeRatio.toString(),
    minPoolMarginRatio: minPoolMarginRatio.toString(),
    minInitialMarginRatio: minInitialMarginRatio.toString(),
    minMaintenanceMarginRatio: minMaintenanceMarginRatio.toString(),
    minAddLiquidity: minAddLiquidity.toString(),
    redemptionFeeRatio: redemptionFeeRatio.toString(),
    fundingRateCoefficient: fundingRateCoefficient.toString(),
    minLiquidationReward: minLiquidationReward.toString(),
    maxLiquidationReward: maxLiquidationReward.toString(),
    liquidationCutRatio: liquidationCutRatio.toString(),
    priceDelayAllowance: priceDelayAllowance.toString(),
  };
};

/**
 * Get position Information of the user
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {string} response.volume
 * @returns {string} response.averageEntryPrice
 * @returns {string} response.margin
 * @returns {string} response.marginHeld
 * @returns {string} response.unrealizedPnl
 * @returns {string} response.liquidationPrice
 */
export const getPositionInfo = async (chainId, poolAddress, accountAddress) => {
  let price = ''
  try {
    price = await getBTCUSDPrice(chainId, poolAddress);
  } catch (err) {
    console.log(err)
  }
  const { pTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const pToken = pTokenFactory(chainId, pTokenAddress, poolAddress);
  //pToken.setAccount(accountAddress);
  const {
    multiplier,
    minInitialMarginRatio,
    minMaintenanceMarginRatio,
  } = await pPool.getParameters();
  //console.log('getPositionInfo', chainId, poolAddress, accountAddress, price);
  const { volume, margin, cost } = await pToken.getPositionInfo(accountAddress);
  if (price === '') {
    return {
      price,
      volume: volume.toString(),
      averageEntryPrice: calculateEntryPrice(
        volume,
        cost,
        multiplier
      ).toString(),
      margin: margin.toString(),
      marginHeld: '',
      unrealizedPnl: '',
      liquidationPrice: calculateLiquidationPrice(
        volume,
        margin,
        cost,
        multiplier,
        minMaintenanceMarginRatio
      ).toString(),
    };
  } else {
    return {
      price,
      volume: volume.toString(),
      averageEntryPrice: calculateEntryPrice(
        volume,
        cost,
        multiplier
      ).toString(),
      margin: margin.toString(),
      marginHeld: calculateMarginHeld(
        price,
        volume,
        multiplier,
        minInitialMarginRatio
      ).toString(),
      unrealizedPnl: calculatePnl(price, volume, multiplier, cost).toString(),
      liquidationPrice: calculateLiquidationPrice(
        volume,
        margin,
        cost,
        multiplier,
        minMaintenanceMarginRatio
      ).toString(),
    };
  }
};

/**
 * Get liquidity Info of the user
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {Object} response
 * @returns {string} response.totalSupply
 * @returns {string} response.poolLiquidity
 * @returns {string} response.shares
 * @returns {string} response.shareValue
 * @returns {string} response.maxRemovableShares
 */
export const getLiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { lTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const lToken = lTokenFactory(chainId, lTokenAddress, poolAddress);
  //lToken.setAccount(accountAddress);

  const [lTokenBalance, lTokenTotalSupply] = await Promise.all([
    lToken.balance(accountAddress),
    lToken.totalSupply(),
  ]);
  const price = await getBTCUSDPrice(chainId, poolAddress);
  const {
    liquidity,
    tradersNetCost,
    tradersNetVolume,
  } = await pPool.getStateValues();
  const { multiplier, minPoolMarginRatio } = await pPool.getParameters();
  const poolDynamicEquity = liquidity.plus(
    tradersNetCost.minus(tradersNetVolume.times(price).times(multiplier))
  );

  return {
    totalSupply: lTokenTotalSupply.toString(),
    poolLiquidity: liquidity.toString(),
    shares: lTokenBalance.toString(),
    shareValue: calculateShareValue(
      lTokenTotalSupply,
      poolDynamicEquity
    ).toString(),
    maxRemovableShares: calculateMaxRemovableShares(
      lTokenBalance,
      lTokenTotalSupply,
      liquidity,
      tradersNetVolume,
      tradersNetCost,
      multiplier,
      minPoolMarginRatio,
      price
    ).toString(),
  };
};

/**
 * Get user balance in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {string} user balance
 */
export const getWalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};

/**
 * Check account is unlocked in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @returns {bool}
 */
export const isUnlocked = async (chainId, poolAddress, accountAddress) => {
  const { bTokenAddress } = getPoolContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  //bToken.setAccount(accountAddress);
  return await bToken.isUnlocked(accountAddress);
};

/**
 * Get estimate margin in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} accountAddress
 * @param {string} volume
 * @param {string} leverage
 * @returns {string}
 */
export const getEstimatedMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  volume,
  leverage
) => {
  const price = await getBTCUSDPrice(chainId, poolAddress);
  const pPool = perpetualPoolFactory(chainId, poolAddress);
  //pPool.setAccount(accountAddress);
  const { multiplier } = await pPool.getParameters();
  return bg(volume)
    .abs()
    .times(price)
    .times(multiplier)
    .div(bg(leverage))
    .toString();
};

/**
 * Get estimate Fee in the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} volume
 * @returns {string}
 */
export const getEstimatedFee = async (chainId, poolAddress, volume) => {
  // const price = await getBTCUSDPrice(chainId, poolAddress);
  let price = priceCache.get();
  let parameters = PerpetualPoolParametersCache.get();
  if (price === '') {
    await priceCache.update(chainId, poolAddress);
    price = priceCache.get();
  }
  // const pPool = perpetualPoolFactory(chainId, poolAddress, accountAddress);
  // const { multiplier, feeRatio } = await pPool.getParameters();
  if (!parameters.multiplier) {
    parameters = await PerpetualPoolParametersCache.update(
      chainId,
      poolAddress
    );
  }
  //console.log('price', price);
  const { multiplier, feeRatio } = parameters;
  return bg(volume)
    .abs()
    .times(price)
    .times(multiplier)
    .times(feeRatio)
    .toString();
};

/**
 * Get funding rate of the perpetual pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {string} response.fundingRate0
 * @returns {string} response.fundingRatePerBlock
 * @returns {string} response.liquidity
 * @returns {string} response.volume
 * @returns {string} response.tradersNetVolume
 */
export const getFundingRate = async (chainId, poolAddress) => {
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress);

  const res = await perpetualPool
    .getFundingRate()
    .catch((err) => console.log('getFundingRate', err));
  fundingRateCache.set(chainId, poolAddress, res);
  const poolInfo = await getPoolInfoApy(chainId, poolAddress);

  if (res) {
    // console.log(hexToNatural(res[0]));
    const {
      fundingRate,
      fundingRatePerBlock,
      liquidity,
      tradersNetVolume,
    } = res;
    const volume = poolInfo.volume24h;
    // fundingRate = processFundingRate(chainId, fundingRate);

    return {
      fundingRate0: naturalWithPercentage(fundingRate),
      fundingRatePerBlock: BigNumber(fundingRatePerBlock).toExponential(10),
      liquidity: liquidity.toString(),
      volume: deriToNatural(volume).toString(),
      tradersNetVolume: tradersNetVolume.toString(),
    };
  }
};

/**
 * Get estimate funding rate
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} newNetVolume
 * @returns {Object} response
 * @returns {string} response.fundingRate1
 */
export const getEstimatedFundingRate = async (
  chainId,
  poolAddress,
  newNetVolume
) => {
  let fundingRate1;
  let res;
  res = fundingRateCache.get(chainId, poolAddress);
  if (!res) {
    const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
    res = await perpetualPool.getFundingRate();
  }
  if (res) {
    const parameters = [
      bg(res.tradersNetVolume).plus(bg(newNetVolume)).toString(),
      res.price,
      res.multiplier,
      res.liquidity,
      res.fundingRateCoefficient,
    ];
    if (hasInvalidArgsValue(...parameters)) {
      return {
        fundingRate1: '0',
      };
    }
    // console.log(parameters)
    fundingRate1 = calculateFundingRate(...parameters);
    fundingRate1 = processFundingRate(chainId, fundingRate1);
    return {
      fundingRate1: naturalWithPercentage(fundingRate1),
    };
  }
};

/**
 * Get liquidity used
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @returns {Object} response
 * @returns {string} response.liquidityUsed0
 */
export const getLiquidityUsed = async (chainId, poolAddress) => {
  let res;
  res = fundingRateCache.get(chainId, poolAddress);
  if (!res) {
    const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
    res = await perpetualPool.getFundingRate();
  }
  if (res) {
    const { liquidityUsed } = res;
    return {
      liquidityUsed0: naturalWithPercentage(liquidityUsed),
    };
  }
};

/**
 * Get estimate liquidity used
 * @async
 * @method
 * @param {string} chainId
 * @param {string} poolAddress
 * @param {string} newNetVolume
 * @returns {Object} response
 * @returns {string} response.fundingRate1
 */
export const getEstimatedLiquidityUsed = async (
  chainId,
  poolAddress,
  newNetVolume
) => {
  let res;
  res = fundingRateCache.get(chainId, poolAddress);
  if (!res) {
    const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
    res = await perpetualPool
      .getFundingRate()
      .catch((err) => console.log('getLiquidityUsed', err));
  }
  if (res) {
    const parameters = [
      bg(res.tradersNetVolume).plus(bg(newNetVolume)).toString(),
      res.price,
      res.multiplier,
      res.liquidity,
      res.poolMarginRatio,
    ];
    if (hasInvalidArgsValue(...parameters)) {
      return {
        liquidityUsed1: '0',
      };
    }
    const liquidityUsed1 = calculateLiquidityUsed(...parameters);
    return {
      liquidityUsed1: naturalWithPercentage(liquidityUsed1),
    };
  }
};

/**
 * Get user signature of the wormhole pool
 * @async
 * @method
 * @param {string} accountAddress
 * @returns {Object}
 */
export const getUserWormholeSignature = async (accountAddress) => {
  const databaseWormhole = databaseWormholeFactory(true);
  return await databaseWormhole.signature(accountAddress);
};

/**
 * Check account is unlocked in the deri pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} accountAddress
 * @returns {bool}
 */
export const isDeriUnlocked = async (chainId, accountAddress) => {
  const { wormholeAddress, deriAddress } = getDeriContractAddress(chainId);
  const deri = deriFactory(chainId, deriAddress, wormholeAddress);
  //deri.setAccount(accountAddress).setPool(wormholeAddress);
  let res;
  try {
    const tx = await deri.isUnlocked(accountAddress);
    res = { success: true, transaction: tx };
  } catch (error) {
    res = { success: false, error };
  }
  return res;
};

/**
 * Get deri balance in the deri pool
 * @async
 * @method
 * @param {string} chainId
 * @param {string} accountAddress
 * @returns {string}
 */
export const getDeriBalance = async (chainId, accountAddress) => {
  const { deriAddress, wormholeAddress } = getDeriContractAddress(chainId);
  const deri = deriFactory(chainId, deriAddress, wormholeAddress);
  return (await deri.balance(accountAddress)).toString();
};
