import {
  addLiquidity,
  removeLiquidity,
  depositMargin,
  withdrawMargin,
  tradeWithMargin,
  closePosition,
} from '../api/contractTransactionApi';
import {
  addSlpLiquidity,
  removeSlpLiquidity,
} from '../api/slpPoolApi'
import {
  addClpLiquidity,
  removeClpLiquidity,
} from '../api/clpPoolApi'
import { wsInstance } from '../api/apiGlobals'
import { getRestServerConfig, DeriEnv, getRedisWorkerQueneConfig } from '../config'

const wsOnPromise = (ws, event) => {
  return new Promise((resolve, reject) => {
    ws.on(event, function(data){
      resolve(JSON.parse(data))
    })
  })
}
const sendTradeTxToWorkerQuene = async(methodCall) => {
  const ws = wsInstance.getOrSet(getRestServerConfig(DeriEnv.get()))
  await ws.send(methodCall)
  const res = await wsOnPromise(ws, 'trade_tx_receipt')
  //console.log('res', res)
  return res
}

export const tradeWithMargin2 = async (
  chainId,
  poolAddress,
  accountAddress,
  newVolume,
  amount = '0'
) => {
  const res = await tradeWithMargin(chainId, poolAddress, accountAddress, newVolume, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`trade_with_margin(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const closePosition2 = async (
  chainId,
  poolAddress,
  accountAddress,
  newVolume,
  amount = '0'
) => {
  const res = await closePosition(chainId, poolAddress, accountAddress, newVolume, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`close_position(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const depositMargin2 = async (
  chainId,
  poolAddress,
  accountAddress,
  amount = '0'
) => {
  const res = await depositMargin(chainId, poolAddress, accountAddress, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`deposit_margin(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const withdrawMargin2 = async (
  chainId,
  poolAddress,
  accountAddress,
  amount = '0'
) => {
  const res = await withdrawMargin(chainId, poolAddress, accountAddress, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`withdraw_margin(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const addLiquidity2 = async (
  chainId,
  poolAddress,
  accountAddress,
  amount = '0'
) => {
  const res = await addLiquidity(chainId, poolAddress, accountAddress, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`add_liquidity(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const removeLiquidity2 = async (
  chainId,
  poolAddress,
  accountAddress,
  shares = '0'
) => {
  const res = await removeLiquidity(chainId, poolAddress, accountAddress, shares)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`remove_liquidity(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const addSlpLiquidity2 = async (
  chainId,
  poolAddress,
  accountAddress,
  amount = '0'
) => {
  const res = await addSlpLiquidity(chainId, poolAddress, accountAddress, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`add_slp_liquidity(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const removeSlpLiquidity2 = async (
  chainId,
  poolAddress,
  accountAddress,
  shares = '0'
) => {
  const res = await removeSlpLiquidity(chainId, poolAddress, accountAddress, shares)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`remove_slp_liquidity(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};
export const addClpLiquidity2 = async (
  chainId,
  poolAddress,
  accountAddress,
  amount = '0'
) => {
  const res = await addClpLiquidity(chainId, poolAddress, accountAddress, amount)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`add_clp_liquidity(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};

export const removeClpLiquidity2 = async (
  chainId,
  poolAddress,
  accountAddress,
  shares = '0'
) => {
  const res = await removeClpLiquidity(chainId, poolAddress, accountAddress, shares)
  if (res.success) {
    return await sendTradeTxToWorkerQuene(`remove_clp_liquidity(${chainId},${poolAddress},${accountAddress})`)
  } else {
    return res
  }
};