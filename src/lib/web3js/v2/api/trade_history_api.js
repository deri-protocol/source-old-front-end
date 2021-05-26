import { deriToNatural } from '../utils';
import { perpetualPoolFactory } from '../factory';
import { getFilteredPoolConfigList, getPoolConfig} from '../config'

import { getRestServerConfig, DeriEnv } from '../../config';

const getHttpBase = () => {
  return getRestServerConfig(DeriEnv.get());
};

const fetchJson = async (url) => {
  const resp = await fetch(url);
  return await resp.json();
};

const processTradeEvent = async (
  perpetualPool,
  info,
  blockNumber,
  txHash,
  multiplier,
  feeRatio
) => {
  const tradeVolume = deriToNatural(info.tradeVolume);
  const timeStamp = await perpetualPool._getTimeStamp(blockNumber);

  const direction = tradeVolume.gt(0) ? 'LONG' : 'SHORT';
  const price = deriToNatural(info.price);
  const time = `${+timeStamp.timestamp}000`;
  const symbolId = info.symbolId
  const transactionFee = perpetualPool._calculateFee(
    tradeVolume,
    price,
    multiplier[parseInt(symbolId)],
    feeRatio[parseInt(symbolId)]
  );
  const notional = tradeVolume.abs().times(price).times(multiplier[parseInt(symbolId)]);
  const volume = tradeVolume.abs();

  const res = {
    direction,
    //baseToken: bTokenSymbol,
    symbolId,
    price: price.toString(),
    notional: notional.toString(),
    volume: volume.toString(),
    transactionFee: transactionFee.toString(),
    transactionHash: txHash.toString(),
    time,
  };
  return res;
};
const getTradeHistoryOnline = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId,
  fromBlock
) => {

  const symbolConfigList = getFilteredPoolConfigList(poolAddress, '0')
  const symbolIdList = symbolConfigList.map((i) => i.symbolId)
  //console.log('symbolIdList', symbolIdList);
  const perpetualPool = perpetualPoolFactory(chainId, poolAddress);
  const toBlock = await perpetualPool._getBlockInfo('latest');
  fromBlock = parseInt(fromBlock);

  let promises= []
  for (let i=0; i<symbolIdList.length; i++) {
    promises.push(perpetualPool.getSymbol(symbolIdList[i]))
  }
  let symbols = await Promise.all(promises)

  const multiplier = symbols.map((i) => i.multiplier.toString());
  const feeRatio = symbols.map((i) => i.feeRatio.toString());

  const filters = { owner: accountAddress };
  let events = await perpetualPool._getPastEvents(
    'Trade',
    filters,
    fromBlock,
    toBlock.number
  );

  const result = [];
  events  = events.filter((i) => i.returnValues.symbolId === symbolId)
  //console.log("events length:", events.length);
  for (let i = 0; i < events.length; i++) {
    const item = events[i];
    const res = await processTradeEvent(
      perpetualPool,
      item.returnValues,
      item.blockNumber,
      item.transactionHash,
      multiplier,
      feeRatio,
    );
    result.unshift(res);
  }
  return result;
};

export const getTradeHistory = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId
) => {
  let tradeFromBlock, tradeHistory = [];
  const res = await fetchJson(
    `${getHttpBase()}/trade_history/${chainId}/${poolAddress}/${accountAddress}/${symbolId}`
  );
  if (res && res.success) {
    tradeFromBlock = parseInt(res.data.tradeHistoryBlock);
    if (res.data.tradeHistory && Array.isArray(res.data.tradeHistory)) {
      tradeHistory = res.data.tradeHistory;
    }
  }
  tradeHistory = tradeHistory
    .filter((i) => i)
    .map((i) => {
      return {
        direction: i.direction.trim(),
        //baseToken: i.baseToken.trim(),
        symbolId: i.symbolId,
        price: deriToNatural(i.price).toString(),
        notional: deriToNatural(i.notional).toString(),
        volume: deriToNatural(i.volume).toString(),
        transactionFee: deriToNatural(i.transactionFee).toString(),
        transactionHash: i.transactionHash,
        time: i.time.toString(),
      };
    });
    //console.log('tradeHistory1',tradeHistory)
  if (tradeFromBlock !== 0) {
    // console.log(tradeFromBlock, liquidateFromBlock)
    const [tradeHistoryOnline] = await Promise.all([
      getTradeHistoryOnline(
        chainId,
        poolAddress,
        accountAddress,
        symbolId,
        tradeFromBlock + 1
      ),
    ]);
    const result = tradeHistoryOnline.concat(tradeHistory);
    return result.sort((a, b) => parseInt(b.time) - parseInt(a.time));
  } else {

    const {initialBlock} = getPoolConfig(poolAddress, null, symbolId)
    tradeFromBlock = parseInt(initialBlock);
    const [tradeHistoryOnline] = await Promise.all([
      getTradeHistoryOnline(
        chainId,
        poolAddress,
        accountAddress,
        symbolId,
        tradeFromBlock + 1
      ),
    ]);
    const result = tradeHistoryOnline;
    return result.sort((a, b) => parseInt(b.time) - parseInt(a.time));
  }
};
