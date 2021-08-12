import { deriToNatural, getBlockInfo, getPastEvents } from '../../shared/utils';
import {
  getPoolConfig,
  getRestServerConfig,
  DeriEnv,
} from '../../shared/config';
import { everlastingOptionFactory, pTokenOptionFactory } from '../factory';
import { calculateTxFee } from '../../v2/calculation/position';

const getHttpBase = () => {
  return getRestServerConfig(DeriEnv.get());
};

const fetchJson = async (url) => {
  const resp = await fetch(url);
  return await resp.json();
};

const processTradeEvent = async (
  chainId,
  info,
  blockNumber,
  txHash,
  multiplier,
  feeRatio,
  bTokenSymbol,
  symbolIdList,
) => {
  const tradeVolume = deriToNatural(info.tradeVolume);
  const timeStamp = await getBlockInfo(chainId, blockNumber);

  const direction = tradeVolume.gt(0) ? 'LONG' : 'SHORT';
  const price = deriToNatural(info.intrinsicValue).plus(deriToNatural(info.timeValue));
  const time = `${+timeStamp.timestamp}000`;
  const volume = tradeVolume.abs();
  const symbolId = info.symbolId
  const index = symbolIdList.indexOf(symbolId)

  let res = {
    direction,
    baseToken: bTokenSymbol,
    symbolId,
    price: price.toString(),
    volume: volume.toString(),
    transactionHash: txHash.toString(),
    time,
  }
  if (index === -1) {
    res.notional = ''
    res.transactionFee = ''
  } else {
    const transactionFee = calculateTxFee(
      tradeVolume,
      price,
      multiplier[index],
      feeRatio[index]
    );
    const notional = tradeVolume
      .abs()
      .times(price)
      .times(multiplier[index]);

    res.notional = notional.toString();
    res.transactionFee = transactionFee.toString();
  }
  return res;
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
  const { bTokenSymbol, pToken: pTokenAddress } = getPoolConfig(poolAddress, undefined, undefined, 'option')
  const optionPool = everlastingOptionFactory(chainId, poolAddress);
  const pToken = pTokenOptionFactory(chainId, pTokenAddress)
  const symbolIdList = await pToken.getActiveSymbolIds()
  const toBlock = await getBlockInfo(chainId, 'latest');
  fromBlock = parseInt(fromBlock);

  let promises= []
  for (let i=0; i<symbolIdList.length; i++) {
    promises.push(optionPool.getSymbol(symbolIdList[i]))
  }
  let symbols = await Promise.all(promises)

  const multiplier = symbols.map((i) => i.multiplier.toString());
  const feeRatio = symbols.map((i) => i.feeRatio.toString());

  const filters =  { account: accountAddress }
  let events = await getPastEvents(chainId, optionPool.contract,
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
      chainId,
      item.returnValues,
      item.blockNumber,
      item.transactionHash,
      multiplier,
      feeRatio,
      bTokenSymbol,
      symbolIdList,
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
    let tradeFromBlock, tradeHistory = [];
    const res = await fetchJson(
      `${getHttpBase()}/trade_history/${chainId}/${poolAddress}/${accountAddress}/${symbolId}`
    );
    if (res && res.success) {
      //console.log('his res', res.data)
      tradeFromBlock = parseInt(res.data.tradeHistoryBlock);
      if (res.data.tradeHistory && Array.isArray(res.data.tradeHistory)) {
        tradeHistory = res.data.tradeHistory;
      }
    }
    if (tradeHistory.length > 0) {
      tradeHistory = tradeHistory
        .filter((i) => i)
        .map((i) => {
          return {
            direction: i.direction.trim(),
            baseToken: i.baseToken.trim(),
            symbolId: i.symbolId,
            price: deriToNatural(i.price).toString(),
            notional: deriToNatural(i.notional).toString(),
            volume: deriToNatural(i.volume).toString(),
            transactionFee: deriToNatural(i.transactionFee).toString(),
            transactionHash: i.transactionHash,
            time: i.time.toString(),
          };
        });
    }
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
