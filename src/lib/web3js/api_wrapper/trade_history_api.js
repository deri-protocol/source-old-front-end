import { getPoolVersion, LITE_VERSIONS } from '../shared';
import { getTradeHistoryOption } from '../option/api';
import { getTradeHistory2 } from '../v1/api';
import { getTradeHistoryV2 } from '../v2/api';
import { getTradeHistoryV2l } from '../v2_lite/api';

export const getTradeHistory = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId
) => {
  const version = getPoolVersion(poolAddress)
  if (LITE_VERSIONS.includes(version)) {
    return getTradeHistoryV2l(chainId, poolAddress, accountAddress, symbolId);
  } else if (version === 'option') {
    return getTradeHistoryOption(chainId, poolAddress, accountAddress, symbolId);
  }
  if (symbolId === undefined) {
    return getTradeHistory2(chainId, poolAddress, accountAddress);
  } else {
    return getTradeHistoryV2(chainId, poolAddress, accountAddress, symbolId);
  }
};
