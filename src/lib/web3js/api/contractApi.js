import {
  bTokenFactory,
  lTokenFactory,
  pTokenFactory,
  perpetualPoolFactory,
  miningVaultPoolFactory,
  wormholeFactory,
  deriFactory,
  databaseWormholeFactory,
} from '../factory/contracts';
import { getPoolInfoApy, getUserInfoAll } from './databaseApi';
import {
  fundingRateCache,
  PerpetualPoolParametersCache,
  priceCache,
} from './apiResultCache';
import {
  hasInvalidArgsValue,
  naturalWithPercentage,
  deriToNatural,
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
  calculateFundingRate,
  calculateLiquidityUsed,
  calculateShareValue,
  calculateMaxRemovableShares,
  calculateEntryPrice,
  calculateMarginHeld,
  calculatePnl,
  calculateMaxWithdrawMargin,
  calculateLiquidationPrice,
  processFundingRate,
  isOrderValid,
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
  accountAddress
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
  const symbol = await pPool.symbol();
  const bSymbolRaw = await bToken.symbol();

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
  const price = await getBTCUSDPrice(chainId, poolAddress);
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
  const { volume, margin, cost } = await pToken.getPositionInfo(accountAddress);

  return {
    volume: volume.toString(),
    averageEntryPrice: calculateEntryPrice(volume, cost, multiplier).toString(),
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
 * Get sstimate margin in the perpetual pool
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
 * Get Estimate Fee in the perpetual pool
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
