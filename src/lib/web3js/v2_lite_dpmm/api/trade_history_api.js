import {
  deriToNatural,
  getBlockInfo,
  getPastEvents,
  getHttpBase,
  fetchJson,
  bg,
} from '../../shared/utils';
import {
  getPoolConfig,
  getPoolSymbolIdList,
} from '../../shared/config';
import { perpetualPoolLiteDpmmFactory } from '../contract/factory';

const processTradeEvent = async (
  chainId,
  info,
  blockNumber,
  txHash,
  bTokenSymbol,
  symbols
) => {
  const tradeVolume = deriToNatural(info.tradeVolume);
  const timeStamp = await getBlockInfo(chainId, blockNumber);

  const direction = tradeVolume.gt(0) ? 'LONG' : 'SHORT';
  const time = `${+timeStamp.timestamp}000`;
  const symbolId = info.symbolId;
  const symbol = symbols.find((s) => s.symbolId == info.symbolId);
  const price = bg(info.tradeCost).div(info.tradeVolume).div(symbol.multiplier);
  const notional = tradeVolume
    .abs()
    .times(price).times(symbol.multiplier)
  const transactionFee = bg(notional).times(symbol.feeRatio)
  const volume = tradeVolume.abs();

  const res = {
    direction,
    baseToken: bTokenSymbol,
    symbolId,
    symbol: symbol && symbol.symbol,
    price: price.toString(),
    notional: notional.toString(),
    volume: bg(volume).times(symbol.multiplier).toString(),
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
  const symbolIdList = getPoolSymbolIdList(poolAddress);
  //console.log('symbolIdList', symbolIdList);
  const { bTokenSymbol } = getPoolConfig(
    poolAddress,
    undefined,
    undefined,
    'v2_lite'
  );

  //console.log('bTokenSymbol', bTokenSymbol)
  const perpetualPool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
  await perpetualPool.init()
  const toBlock = await getBlockInfo(chainId, 'latest');
  fromBlock = parseInt(fromBlock);

  let promises = [];
  for (let i = 0; i < symbolIdList.length; i++) {
    promises.push(perpetualPool.getSymbol(symbolIdList[i]));
  }
  let symbols = await Promise.all(promises);

  const filters = { account: accountAddress };
  let events = await getPastEvents(
    chainId,
    perpetualPool.contract,
    'Trade',
    filters,
    fromBlock,
    toBlock.number
  );

  const result = [];
  //events = events.filter((i) => i.returnValues.symbolId === symbolId);
  //console.log("events length:", events.length);
  for (let i = 0; i < events.length; i++) {
    const item = events[i];
    const res = await processTradeEvent(
      chainId,
      item.returnValues,
      item.blockNumber,
      item.transactionHash,
      bTokenSymbol,
      symbols
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
  try {
    let tradeFromBlock,
      tradeHistory = [];
    const res = await fetchJson(
      `${getHttpBase()}/trade_history/${chainId}/${poolAddress}/${accountAddress}/${symbolId}`
    );
    if (res && res.success) {
      tradeFromBlock = parseInt(res.data.tradeHistoryBlock);
      if (res.data.tradeHistory && Array.isArray(res.data.tradeHistory)) {
        tradeHistory = res.data.tradeHistory;
      }
    }
    const perpetualPool = perpetualPoolLiteDpmmFactory(chainId, poolAddress);
    await perpetualPool.init()
    if (tradeHistory.length > 0) {
      tradeHistory = tradeHistory
        .map((i) => {
          const symbolIndex = perpetualPool.activeSymbolIds.indexOf(i.symbolId)
          if (symbolIndex > -1) {
            return {
              direction: i.direction.trim(),
              baseToken: i.baseToken.trim(),
              symbolId: i.symbolId,
              symbol: i.symbol,
              price: deriToNatural(i.price).toString(),
              notional: deriToNatural(i.notional).toString(),
              volume: deriToNatural(i.volume).times(perpetualPool.symbols[symbolIndex].multiplier).toString(),
              transactionFee: deriToNatural(i.transactionFee).toString(),
              transactionHash: i.transactionHash,
              time: i.time.toString(),
            };
          } else {
            return null
          }
        }).filter((i) => i != null)
    }
    //console.log('tradeHistory1',tradeHistory)
    if (tradeFromBlock !== 0) {
      console.log(tradeFromBlock)
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
      const { initialBlock } = getPoolConfig(poolAddress);
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
  } catch (err) {
    console.log(
      `getTradeHistory(${chainId}, ${poolAddress}, ${accountAddress}, ${symbolId}): ${err}`
    );
  }
  return [];
};
