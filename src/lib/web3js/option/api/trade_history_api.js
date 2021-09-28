import { deriToNatural, naturalToDeri, bg, getBlockInfo, getPastEvents, getHttpBase, fetchJson, max } from '../../shared/utils';
import {
  getPoolConfig,
} from '../../shared/config';
import { everlastingOptionFactory, optionPricerFactory } from '../factory/pool';

const processTradeEvent = async (
  chainId,
  info,
  blockNumber,
  txHash,
  multiplier,
  bTokenSymbol,
  symbolIdList,
  symbols,
  pricer,
) => {
  const tradeVolume = deriToNatural(info.tradeVolume);
  const timeStamp = await getBlockInfo(chainId, blockNumber);

  const direction = tradeVolume.gt(0) ? 'LONG' : 'SHORT';
  const tradeCost = deriToNatural(info.tradeCost);
  const time = `${+timeStamp.timestamp}000`;
  const volume = tradeVolume.abs();
  const symbolId = info.symbolId
  const volatility = info.volatility
  const index = symbolIdList.indexOf(symbolId)
  const price = bg(tradeCost).div(bg(tradeVolume).times(symbols[index].multiplier))
  const indexPrice = deriToNatural(info.spotPrice)

  const intrinsicValue = symbols[index].isCall
    ? max(indexPrice.minus(symbols[index].strikePrice), bg(0))
    : max(bg(symbols[index].strikePrice).minus(indexPrice), bg(0));
  let timeValue = '0';
  if (intrinsicValue.lte(0)) {
    const res  = await pricer.getEverlastingTimeValueAndDelta(
      naturalToDeri(indexPrice),
      naturalToDeri(symbols[index].strikePrice),
      volatility,
      naturalToDeri(bg(1).div(365).toString())
    );
    timeValue = res.timeValue
  }
  if (index > -1) {
    return {
      direction,
      baseToken: bTokenSymbol,
      symbolId,
      symbol: symbols[index].symbol,
      price: price.toString(),
      indexPrice: indexPrice.toString(),
      volume: volume.times(symbols[index].multiplier).toString(),
      transactionHash: txHash.toString(),
      notional: tradeVolume
        .abs()
        .times(indexPrice)
        .times(multiplier[index])
        .toString(),
      contractValue: tradeVolume
        .abs()
        .times(price)
        .times(multiplier[index])
        .toString(),
      transactionFee: intrinsicValue.gt(0)
        ? volume
            .times(symbols[index].multiplier)
            .times(indexPrice)
            .times(symbols[index].feeRatioITM)
            .toString()
        : volume
            .times(symbols[index].multiplier)
            .times(timeValue)
            .times(symbols[index].feeRatioOTM)
            .toString(),
      time,
    };
  } else {
    return null
  }
};
const getTradeHistoryOnline = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId,
  fromBlock
) => {

  // const symbolIdList = getPoolSymbolIdList(poolAddress)
  //console.log('symbolIdList', symbolIdList);
  const { bTokenSymbol, pricer:pricerAddress } = getPoolConfig(poolAddress, undefined, undefined, 'option')
  const optionPool = everlastingOptionFactory(chainId, poolAddress);
  const pricer = optionPricerFactory(chainId, pricerAddress)
  const [toBlock] = await Promise.all([
    getBlockInfo(chainId, 'latest'),
    optionPool._updateConfig(),
  ]);
  fromBlock = parseInt(fromBlock);

  let symbols = optionPool.activeSymbols
  const multiplier = symbols.map((i) => i.multiplier.toString());

  const filters =  { account: accountAddress }
  let events = await getPastEvents(chainId, optionPool.contract,
    'Trade',
    filters,
    fromBlock,
    toBlock.number
  );

  let result = [];
  //events  = events.filter((i) => i.returnValues.symbolId === symbolId)
  //console.log("events length:", events.length);
  for (let i = 0; i < events.length; i++) {
    const item = events[i];
    const res = await processTradeEvent(
      chainId,
      item.returnValues,
      item.blockNumber,
      item.transactionHash,
      multiplier,
      bTokenSymbol,
      optionPool.activeSymbolIds,
      symbols,
      pricer,
    );
    result.unshift(res);
  }
  result = result.filter((tr) => tr !== null)
  return result;
};

export const getTradeHistory = async (
  chainId,
  poolAddress,
  accountAddress,
  symbolId
) => {
  try {
    let tradeFromBlock, tradeHistory = [];
    const optionPool = everlastingOptionFactory(chainId, poolAddress)
    const [res] = await Promise.all([
      fetchJson(
        `${getHttpBase()}/trade_history/${chainId}/${poolAddress}/${accountAddress}/${symbolId}`
      ),
      optionPool._updateConfig()
    ]);
    if (res && res.success) {
      //console.log('his res', res.data)
      tradeFromBlock = parseInt(res.data.tradeHistoryBlock);
      if (res.data.tradeHistory && Array.isArray(res.data.tradeHistory)) {
        tradeHistory = res.data.tradeHistory;
      }
    }
    const symbols = optionPool.activeSymbols
    if (tradeHistory.length > 0) {
      tradeHistory = tradeHistory
        //.filter((i) => i)
        .map((i) => {
          const index = symbols.findIndex((s) => s.symbolId === i.symbolId)
          if (index > -1) {
            return {
              direction: i.direction.trim(),
              baseToken: i.baseToken.trim(),
              symbolId: i.symbolId,
              symbol: i.symbol,
              price: deriToNatural(i.price).div(symbols[index].multiplier).toString(),
              indexPrice: deriToNatural(i.indexPrice).toString(),
              notional: deriToNatural(i.notional).toString(),
              contractValue: deriToNatural(i.contractValue).toString(),
              volume: deriToNatural(i.volume).times(symbols[index].multiplier).toString(),
              transactionFee: deriToNatural(i.transactionFee).toString(),
              transactionHash: i.transactionHash,
              time: i.time.toString(),
            };
          } else {
            // i.symbolId is not in activeSymbols
            return null
          }
        });
    }
    tradeHistory = tradeHistory.filter((tr) => tr !== null)
    // fetch tradeHistory on the block with fromBlock from rest api
    if (tradeFromBlock !== 0) {
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
      const {initialBlock} = getPoolConfig(poolAddress, undefined, symbolId, 'option')
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
  } catch(err) {
    console.log(`getTradeHistory(${chainId}, ${poolAddress}, ${accountAddress}, ${symbolId}): ${err}`)
  }
  return []
};
