import { bg, catchTxApiError, checkAddress, checkApiInput, checkChainId } from "../../shared"
import { perpetualPoolLiteDpmmFactory } from '../contract/factory.js'

// mining
export const addLiquidity = async(...args) => {
  return catchTxApiError(async(chainId, poolAddress, accountAddress, amount) => {
      chainId = checkChainId(chainId);
      poolAddress = checkAddress(poolAddress);
      accountAddress = checkAddress(accountAddress);
      const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
      await pool.init();
      return await pool.addLiquidity(accountAddress, amount)
  }, args )
}

export const removeLiquidity = async (...args) => {
  return catchTxApiError(
    async (chainId, poolAddress, accountAddress, amount) => {
      [chainId, poolAddress, accountAddress] = checkApiInput(
        chainId,
        poolAddress,
        accountAddress
      );
      const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
      await pool.init();
      return await pool.removeLiquidity(accountAddress, amount);
    },
    args
  );
};

//trading
export const unlock = async (...args) => {
  return catchTxApiError(async (chainId, poolAddress, accountAddress) => {
    [chainId, poolAddress, accountAddress] = checkApiInput(
      chainId,
      poolAddress,
      accountAddress
    );
    const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
    await pool.init();
    return await pool.bToken.unlock(accountAddress, poolAddress);
  }, args);
};

export const depositMargin = async (...args) => {
  return catchTxApiError(async (chainId, poolAddress, accountAddress, amount) => {
    [chainId, poolAddress, accountAddress] = checkApiInput(
      chainId,
      poolAddress,
      accountAddress
    );
    const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
    await pool.init();
    return await pool.addMargin(accountAddress, amount);
  }, args);
};

export const withdrawMargin = async (...args) => {
  return catchTxApiError(async (chainId, poolAddress, accountAddress, amount) => {
    [chainId, poolAddress, accountAddress] = checkApiInput(
      chainId,
      poolAddress,
      accountAddress
    );
    const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
    await pool.init();
    return await pool.removeMargin(accountAddress, amount);
  }, args);
};

export const tradeWithMargin = async(...args) => {
  return catchTxApiError(async(chainId, poolAddress, accountAddress, newVolume, symbolId) => {
    [chainId, poolAddress, accountAddress] = checkApiInput(
      chainId,
      poolAddress,
      accountAddress
    );
    const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
    await pool.init();
    return await pool.trade(accountAddress, symbolId, newVolume);
  }, args)
}

export const closePosition = async(...args) => {
  return catchTxApiError(async(chainId, poolAddress, accountAddress, symbolId) => {
    [chainId, poolAddress, accountAddress] = checkApiInput(
      chainId,
      poolAddress,
      accountAddress
    );
    const pool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
    await pool.init();
    const {volume} = await pool.pToken.getPosition(accountAddress, symbolId)
    if (!bg(volume).eq(0)) {
      const newVolume = bg(volume).negated().toString()
      return await pool.trade(accountAddress, symbolId, newVolume);
    } else {
      throw new Error('no position to close')
    }
  }, args)
}