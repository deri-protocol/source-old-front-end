import {
  bTokenFactory,
  slpPoolFactory,
} from "../factory/contracts";
import {
  getSlpContractAddress,
} from "../utils";

// use infura url, will remove later
export const getSlpLiquidityInfo = async(chainId, poolAddress, accountAddress) => {
  const {bToken:bTokenAddress} = getSlpContractAddress(chainId, poolAddress)
  //console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress, true);
    slpPool.setAccount(accountAddress)
    const bToken = bTokenFactory(
      chainId,
      bTokenAddress,
      poolAddress,
      true
    );
    bToken.setAccount(accountAddress)
    const [liquidity, bTokenBalance, shares] = await Promise.all([
      bToken.balance(poolAddress),
      bToken.balance(accountAddress),
      slpPool.getLiquidity(),
    ]);

    return {
      liquidity: liquidity.toString(),
      bTokenBalance: bTokenBalance.toString(),
      shares: shares.toString(),
    };
  } else {
    console.log('no SlpPool address, please check')
    return {}
  }
}

export const addSlpLiquidity = async(chainId, poolAddress, accountAddress, amount) => {
  let res
  const {bToken:bTokenAddress} = getSlpContractAddress(chainId, poolAddress)
  //console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress);
    slpPool.setAccount(accountAddress)
    const bToken = bTokenFactory(
      chainId,
      bTokenAddress,
      poolAddress,
    );
    bToken.setAccount(accountAddress)
    try {
      const tx = await slpPool.addLiquidity(amount),
        res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
      res = { success: false, error: "unable to get bToken address of slp pool"};
  }
  return res
}

export const removeSlpLiquidity = async(chainId, poolAddress, accountAddress, amount) => {
  let res
  const {bToken:bTokenAddress} = getSlpContractAddress(chainId, poolAddress)
  //console.log('pool', poolAddress, bTokenAddress)
  if (bTokenAddress) {
    const slpPool = slpPoolFactory(chainId, poolAddress);
    slpPool.setAccount(accountAddress)
    const bToken = bTokenFactory(
      chainId,
      bTokenAddress,
      poolAddress,
    );
    bToken.setAccount(accountAddress)
    try {
      const tx = await slpPool.removeLiquidity(amount),
        res = { success: true, transaction: tx };
    } catch (err) {
      res = { success: false, error: err };
    }
  } else {
      res = { success: false, error: "unable to get bToken address of slp pool"};
  }
  return res
}

export const isSlpUnlocked = async (chainId, poolAddress, accountAddress) => {
  const {bToken:bTokenAddress} = getSlpContractAddress(chainId, poolAddress)
  const bToken = bTokenFactory(
    chainId,
    bTokenAddress,
    poolAddress,
  );
  bToken.setAccount(accountAddress)
  return await bToken.isUnlocked(accountAddress);
};

export const unlockSlp = async (chainId, poolAddress, accountAddress) => {
  const {bToken:bTokenAddress} = getSlpContractAddress(chainId, poolAddress)
  const bToken = bTokenFactory(
    chainId,
    bTokenAddress,
    poolAddress,
  );
  bToken.setAccount(accountAddress)

  let res;
  try {
    let tx = await bToken.unlock();
    res = { success: true, transaction: tx };
  } catch (err) {
    res = { success: false, error: err };
  }
  return res
};

export const getSlpWalletBalance = async (chainId, poolAddress, accountAddress) => {
  const {bToken:bTokenAddress} = getSlpContractAddress(chainId, poolAddress)
  const bToken = bTokenFactory(
    chainId,
    bTokenAddress,
    poolAddress,
  );
  bToken.setAccount(accountAddress)
  const balance = await bToken.balance(accountAddress);
  return balance.toString();
};
