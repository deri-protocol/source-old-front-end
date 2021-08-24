import { getPoolVersion } from '../shared';
import { getTradeHistory2 } from '../v1/api';
import { getTradeHistoryV2 } from '../v2/api';
import { getTradeHistoryV2l } from '../v2_lite/api';

export const getTradeHistory = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getTradeHistoryV2l(chainId, poolAddress, accountAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getTradeHistory2(chainId, poolAddress, accountAddress);
  } else {
    return getTradeHistoryV2(chainId, poolAddress, accountAddress, symbolId);
  }
};
