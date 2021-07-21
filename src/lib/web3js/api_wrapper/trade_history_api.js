
import {getTradeHistory2} from '../api/restApi';
import { 
  getPoolVersion,
  getTradeHistoryV2,
  getTradeHistoryV2l,
 } from '../v2';

export const getTradeHistory = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId,
) => {
  if (getPoolVersion(poolAddress) === 'v2_lite') {
    return getTradeHistoryV2l(
      chainId,
      poolAddress,
      accountAddress,
      symbolId,
    );
  }
  if (symbolId === undefined) {
    return getTradeHistory2(chainId, poolAddress, accountAddress);
  } else {
    return getTradeHistoryV2(
      chainId,
      poolAddress,
      accountAddress,
      symbolId,
    );
  }
}