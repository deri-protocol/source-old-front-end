import { catchTxApiError, naturalToDeri } from "../../shared"
import { normalizeChainId } from "../../shared/utils/validate";
import { getPoolV2LiteManagerConfig } from "../config";
import { perpetualPoolLiteFactory, perpetualPoolLiteManagerFactory } from "../factory";

// parameters: [symbolId, symbol, oracleAddress, multiplier, feeRatio, fundingRateCoefficient]
export const createPool = async(...args) => {
  return catchTxApiError(async(chainId, accountAddress, parameters, bTokenAddress, pairedTokenAddress) => {
      chainId = normalizeChainId(chainId)
      const { address: poolManagerAddress } = getPoolV2LiteManagerConfig(chainId)
      const poolManager = perpetualPoolLiteManagerFactory(
        chainId,
        poolManagerAddress
      );
      // process parameters
      const newParameters = parameters.map((p) => naturalToDeri(p).toString())
      // send tx
     return await poolManager.createPool(accountAddress, newParameters, bTokenAddress, pairedTokenAddress)
  }, args)
}

// parameters: [symbolId, symbol, oracleAddress, multiplier, feeRatio, fundingRateCoefficient]
export const addSymbol = async(...args) => {
  return catchTxApiError(async(chainId, poolAddress, accountAddress, parameters) => {
      chainId = normalizeChainId(chainId)
      const perpetualPoolLite = perpetualPoolLiteFactory(chainId, poolAddress);
      // process parameters
      const newParameters = parameters.map((p, index) => index > 2 ? naturalToDeri(p).toString() : p)
      // send tx
     return await perpetualPoolLite.addSymbol(accountAddress, newParameters)
  }, args)
}
