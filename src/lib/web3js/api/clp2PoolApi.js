import { bTokenFactory, clp2PoolFactory } from '../factory/contracts';
import { getClp2ContractAddress } from '../utils';

export const getClp2LiquidityInfo = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bTokenAddress } = getClp2ContractAddress(chainId, poolAddress);
  if (bTokenAddress) {
    const clp2Pool = clp2PoolFactory(chainId, poolAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    const [liquidity, bTokenBalance, shares] = await Promise.all([
      bToken.balance(poolAddress),
      bToken.balance(accountAddress),
      clp2Pool.getLiquidity(accountAddress),
    ]);

    return {
      poolLiquidity: liquidity.toString(),
      bTokenBalance: bTokenBalance.toString(),
      shares: shares.toString(),
    };
  }
  console.log('no Clp2Pool address, please check');
  return {};
};

export const addClp2Liquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  let res;
  const { bTokenAddress } = getClp2ContractAddress(chainId, poolAddress);
  if (bTokenAddress) {
    const clp2Pool = clp2PoolFactory(chainId, poolAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    try {
      const tx = await clp2Pool.addLiquidity(accountAddress, amount);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'unable to get bToken address of clp2 pool' };
  }
  return res;
};

export const removeClp2Liquidity = async (
  chainId,
  poolAddress,
  accountAddress,
  amount
) => {
  let res;
  const { bTokenAddress } = getClp2ContractAddress(chainId, poolAddress);
  if (bTokenAddress) {
    const clp2Pool = clp2PoolFactory(chainId, poolAddress);
    const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
    try {
      const tx = await clp2Pool.removeLiquidity(accountAddress, amount);
      res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
    res = { success: false, error: 'unable to get bToken address of clp2 pool' };
  }
  return res;
};

export const isClp2Unlocked = async (chainId, poolAddress, accountAddress) => {
  const { bTokenAddress } = getClp2ContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  return await bToken.isUnlocked(accountAddress);
};

export const unlockClp2 = async (chainId, poolAddress, accountAddress) => {
  const { bTokenAddress } = getClp2ContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);

  let res;
  try {
    const tx = await bToken.unlock(accountAddress);
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res;
};

export const getClp2WalletBalance = async (
  chainId,
  poolAddress,
  accountAddress
) => {
  const { bTokenAddress } = getClp2ContractAddress(chainId, poolAddress);
  const bToken = bTokenFactory(chainId, bTokenAddress, poolAddress);
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};
