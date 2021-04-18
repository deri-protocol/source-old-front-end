import { getPoolContractAddress2, bg, deriToNatural, hexToString, toChecksumAddress, hexToNumber, hexToNumberString, hexToDeri,naturalToDeri } from "../utils";
import { databaseFactory, perpetualPoolFactory } from "../factory/contracts";

const processTradeEvent = async (
  perpetualPool,
  bTokenSymbol,
  info,
  blockNumber,
  multiplier,
  feeRatio,
) => {
  const tradeVolume = deriToNatural(info.tradeVolume);
  const timeStamp = await perpetualPool._getTimeStamp(blockNumber);

  const direction = tradeVolume.gt(0) ? "LONG" : "SHORT";
  const price = deriToNatural(info.price);
  const time = +timeStamp.timestamp + "000";
  const transactionFee = perpetualPool._calculateFee(
    tradeVolume,
    price,
    multiplier,
    feeRatio
  );
  const notional = tradeVolume
    .abs()
    .times(price)
    .times(multiplier)
  const volume = tradeVolume.abs();

  const res = {
    direction,
    baseToken: bTokenSymbol,
    price: price.toString(),
    notional: notional.toString(),
    volume: volume.toString(),
    transactionFee: transactionFee.toString(),
    time,
  };
  //console.log(JSON.stringify(res))
  return res;
};

const processLiquidateEvent = async(info, bTokenSymbol, multiplier) => {
  //console.log(info)
  const volume = deriToNatural(info.volume).abs()
  //const cost = deriToNatural(info.cost).abs()
  //const margin = info.margin
  const timestamp = info.timestamp + '000'
  const price = deriToNatural(info.price)
  //const liquidator = info.liquidator
  //const reward = info.reward
  const national = volume.times(price).times(multiplier)
  //const transactionFee = volume.times(price).times(multiplier).times(feeRatio)

  const res = {
    direction: "Liquidation",
    baseToken: bTokenSymbol,
    price: naturalToDeri(price).toString(),
    notional: naturalToDeri(national).toString(),
    volume: naturalToDeri(volume).toString(),
    transactionFee: "0",
    time: timestamp,
    //cost: naturalToDeri(cost).toString(),
    //margin: margin.toString(),
    //liquidator,
    //reward: reward.toString(),
  }
  return res
}

export const getTradeHistory = async(chainId, poolAddress, accountAddress) => {
  const keyMeta = `${chainId}.${poolAddress}`
  const db = databaseFactory()
  let [tradeFromBlock, liquidateFromBlock] = await Promise.all([
    db.getValues([`${keyMeta}.tradeHistoryBlock`]),
    db.getValues([`${keyMeta}.liquidateHistoryBlock`]),
  ])
  tradeFromBlock = hexToNumber(tradeFromBlock[0])
  liquidateFromBlock = hexToNumber(liquidateFromBlock[0])
  if (tradeFromBlock !== 0 && liquidateFromBlock !== 0) {
    //console.log(tradeFromBlock, liquidateFromBlock)
    let [tradeHistoryOffline, tradeHistoryOnline, liquidateHistoryOffline, liquidateHistoryOnline] = await Promise.all([
      getTradeHistoryOffline(chainId, poolAddress, accountAddress),
      getTradeHistoryOnline(chainId, poolAddress, accountAddress, tradeFromBlock + 1),
      getLiquidateHistoryOffline(chainId, poolAddress, accountAddress),
      getLiquidateHistoryOnline(chainId, poolAddress, accountAddress, liquidateFromBlock + 1),
    ])
    let result =  tradeHistoryOnline.concat(liquidateHistoryOnline).concat(tradeHistoryOffline).concat(liquidateHistoryOffline)
    return result.sort((a, b) => parseInt(b.time) - parseInt(a.time))
  } else {
    console.log('getTradeHistory(): fromBlock cannot start with 0')
    return []
  }
}

// get trade history combined from cache and from online pull
const getTradeHistoryOffline = async (chainId, poolAddress, accountAddress) => {
  //console.log(chainId, poolAddress, accountAddress)
  let result = []
  // use dev database
  const db = databaseFactory()
  const keyBlock = `${chainId}.${poolAddress}.tradeHistoryBlock`
  const keyMeta = `${chainId}.${poolAddress}.${toChecksumAddress(accountAddress)}.trade`
  const [res, fromBlock] = await db.getValues([`${keyMeta}.count`, keyBlock])
  const count = hexToNumber(res)
  try {
    if (count && count >= 0) {
      let keyArray = []
      for (let i = count; i > 0; i--) {
        const key = `${keyMeta}.${i.toString()}`
        keyArray = keyArray.concat([
          `${key}.direction`,
          `${key}.baseToken`,
          `${key}.price`,
          `${key}.notional`,
          `${key}.volume`,
          `${key}.transactionFee`,
          `${key}.time`,
        ])
      }
      //console.log(keyArray)
      const tradeHistoryLength = keyArray.length / 7
      //console.log(`trade history length: ${tradeHistoryLength}`)
      const resp = await db.getValues(keyArray);
      for (let i = 0; i < tradeHistoryLength; i++) {
        const indexBase = i * 7
        const item = {
          direction: hexToString(resp[indexBase]).trim(),
          baseToken: hexToString(resp[indexBase+1]).trim(),
          price: deriToNatural(resp[indexBase+2]).toString(),
          notional: deriToNatural(resp[indexBase+3]).toString(),
          volume: deriToNatural(resp[indexBase+4]).toString(),
          transactionFee: deriToNatural(resp[indexBase+5]).toString(),
          time: hexToNumberString(resp[indexBase+6]).toString()
        }
        result.push(item)
      }
    } else {
      result = []
    }
  } catch(err) {
    console.log(err)
    result = []
  }
  return result;
};

// get trade history online from the Block number
const getTradeHistoryOnline = async (chainId, poolAddress, accountAddress, fromBlock) => {
  const { bTokenSymbol } = getPoolContractAddress2(chainId, poolAddress);
  //console.log(poolAddr, bTokenAddress);
  const perpetualPool = perpetualPoolFactory(
    chainId,
    poolAddress,
  );
  perpetualPool.setAccount(accountAddress)
  const toBlock = await perpetualPool._getBlockInfo("latest");
  ///let { initialBlock:fromBlock} = getPoolContractAddress2(chainId, poolAddress)
  fromBlock = parseInt(fromBlock)
  let filters = {owner: accountAddress};
  let events = await perpetualPool._getPastEvents(
    "Trade",
    filters,
    fromBlock,
    toBlock.number
  );
  const {
    multiplier,
    feeRatio,
    minInitialMarginRatio,
  } = await perpetualPool.getParameters();

  let result = [];
  //console.log("events length:", events.length);
  for (let i = 0; i < events.length; i++) {
    const item = events[i];
    //const info = item.returnValues;
    const res = await processTradeEvent(
      perpetualPool,
      bTokenSymbol,
      item.returnValues,
      item.blockNumber,
      multiplier,
      feeRatio,
      minInitialMarginRatio
    );
    result.unshift(res);
  }
  return result;
};

// get liquidate history online from the Block number
const getLiquidateHistoryOnline= async (chainId, poolAddress, accountAddress, fromBlock) => {
  const { bTokenSymbol } = getPoolContractAddress2(chainId, poolAddress);
  //console.log(poolAddr, bTokenAddress);
  const perpetualPool = perpetualPoolFactory(
    chainId,
    poolAddress,
  );
  perpetualPool.setAccount(accountAddress)
  const toBlock = await perpetualPool._getBlockInfo("latest");
  fromBlock = parseInt(fromBlock)
  let filters = {owner: accountAddress};
  let events = await perpetualPool._getPastEvents(
    "Liquidate",
    filters,
    fromBlock,
    toBlock.number
  );
  const {
    multiplier,
  } = await perpetualPool.getParameters();

  let result = [];
  //console.log("events length:", events.length);
  for (let i = 0; i < events.length; i++) {
    const item = events[i];
    //const info = item.returnValues;
    const res = await processLiquidateEvent(
      item.returnValues,
      bTokenSymbol,
      multiplier,
    );
    result.unshift(res);
  }
  return result;
};

// get trade history combined from cache and from online pull
const getLiquidateHistoryOffline = async (chainId, poolAddress, accountAddress) => {
  let result = []
  // use dev database
  const db = databaseFactory()
  const keyBlock = `${chainId}.${poolAddress}.liquidateHistoryBlock`
  const keyMeta = `${chainId}.${poolAddress}.${toChecksumAddress(accountAddress)}.liquidate`
  const [res, fromBlock] = await db.getValues([`${keyMeta}.count`, keyBlock])
  const count = hexToNumber(res)
  try {
    if (count && count >= 0) {
      let keyArray = []
      for (let i = count; i > 0; i--) {
        const key = `${keyMeta}.${i.toString()}`
        keyArray = keyArray.concat([
          `${key}.direction`,
          `${key}.baseToken`,
          `${key}.price`,
          `${key}.notional`,
          `${key}.volume`,
          `${key}.transactionFee`,
          `${key}.time`,
        ])
      }
      //console.log(keyArray)
      const liquidateHistoryLength = keyArray.length / 7
      const resp = await db.getValues(keyArray);
      for (let i = 0; i < liquidateHistoryLength; i++) {
        const indexBase = i * 7
        const item = {
          direction: hexToString(resp[indexBase]).trim(),
          baseToken: hexToString(resp[indexBase+1]).trim(),
          price: deriToNatural(resp[indexBase+2]).toString(),
          notional: deriToNatural(resp[indexBase+3]).toString(),
          volume: deriToNatural(resp[indexBase+4]).toString(),
          transactionFee: deriToNatural(resp[indexBase+5]).toString(),
          time: hexToNumberString(resp[indexBase+6]).toString()
        }
        result.push(item)
      }
    } else {
      result = []
    }
  } catch(err) {
    console.log(err)
    result = []
  }
  return result;
};