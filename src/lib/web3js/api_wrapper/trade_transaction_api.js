import { unlock as unlock2 } from '../api/contractTransactionApi';
import {
  tradeWithMargin2,
  closePosition2,
  depositMargin2,
  withdrawMargin2,
} from '../api/contractTransactionApiV2';

import {
  unlock as unlockV2,
  tradeWithMargin as tradeWithMarginV2,
  closePosition as closePositionV2,
  depositMargin as depositMarginV2,
  withdrawMargin as withdrawMarginV2,
} from '../v2';

export const unlock = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId
) => {
  if(bTokenId === undefined) {
    return unlock2(chainId, poolAddress, accountAddress)
  } else {
    return unlockV2(chainId, poolAddress, accountAddress, bTokenId)
  }
};

export const depositMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  amount
) => {
  if(amount === undefined) {
    return depositMargin2(chainId, poolAddress, accountAddress, amount)
  } else {
    return depositMarginV2(chainId, poolAddress, accountAddress, bTokenId, amount)
  }
};

export const withdrawMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  amount
) => {
  if(amount === undefined) {
    return withdrawMargin2(chainId, poolAddress, accountAddress, amount)
  } else {
    return withdrawMarginV2(chainId, poolAddress, accountAddress, bTokenId, amount)
  }
};

export const tradeWithMargin = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId,
  newVolume
) => {
  if(newVolume === undefined) {
    return tradeWithMargin2(chainId, poolAddress, accountAddress, newVolume)
  } else {
    return tradeWithMarginV2(chainId, poolAddress, accountAddress, symbolId, newVolume)
  }
};

export const closePosition = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId,
) => {
  if(symbolId === undefined) {
    return closePosition2(chainId, poolAddress, accountAddress)
  } else {
    return closePositionV2(chainId, poolAddress, accountAddress, symbolId)
  }
};
