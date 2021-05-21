
import {getTradeHistory2} from '../api/restApi';
import { 
  getTradeHistory as getTradeHistoryV2
 } from '../v2';

export const getTradeHistory = async (
  chainId,
  poolAddress,
  accountAddress,
  bTokenId,
  symbolId,
) => {
  if (bTokenId === undefined) {
    return getTradeHistory2(chainId, poolAddress, accountAddress);
  } else {
    return getTradeHistoryV2(
      chainId,
      poolAddress,
      accountAddress,
      bTokenId,
      symbolId,
    );
  }
}