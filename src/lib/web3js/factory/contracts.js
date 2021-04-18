import { PerpetualPool } from '../contract/perpetual_pool'
import { BTokenContract } from '../contract/bToken'
import { PTokenContract } from '../contract/pToken'
import { LTokenContract } from '../contract/lToken'
import { DatabaseContract} from '../contract/database'
import { DatabaseWormholeContract} from '../contract/database_wormhole'
import { MiningVaultPool } from '../contract/mining_vault_pool'

import { DeriEnv } from "../config/env";
import {
  getDBAddressConfig,
  getDBWormholeAddressConfig,
} from "../config";
import { SlpPool } from '../contract/slp_pool'
import { DeriContract } from '../contract/deri'
import { WormholeContract } from '../contract/wormhole'
//import { getPoolBaseSymbolList } from '../utils'

export const databaseFactory = (() => {
  let databaseInstanceMap = {}
  return (useProductionDB=false) => {
    const address = getDBAddressConfig(DeriEnv.get(), useProductionDB);
    const key = address
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key]
    } else {
      const database = new DatabaseContract(address);
      databaseInstanceMap[key] = database;
      return database;
    }
  }
})()

export const databaseWormholeFactory = (() => {
  let databaseInstanceMap = {}
  return (useProductionDB=false) => {
    const address = getDBWormholeAddressConfig(DeriEnv.get(), useProductionDB);
    const key = address
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key]
    } else {
      const database = new DatabaseWormholeContract(address);
      databaseInstanceMap[key] = database;
      return database;
    }
  }
})()

export const perpetualPoolFactory = (() => {
  let perpetualPoolInstanceMap = {}
  return (chainId, contractAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}`
    }
    if (Object.keys(perpetualPoolInstanceMap).includes(key)) {
      return perpetualPoolInstanceMap[key];
    } else {
      const perpetualPool = new PerpetualPool(chainId, contractAddress, isProvider);
      //console.log("new PerpetualPoolContract");
      perpetualPoolInstanceMap[key] = perpetualPool;
      return perpetualPool;
    }
  }
})()

export const bTokenFactory = (function() {
  const bTokenInstanceMap = {}
  return (chainId, contractAddress, poolAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.${poolAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}.${poolAddress}`
    }
    if (Object.keys(bTokenInstanceMap).includes(key)) {
      return bTokenInstanceMap[key]
    } else {
      const bToken = new BTokenContract(chainId, contractAddress, poolAddress, isProvider)
      //console.log("new BTokenContract")
      bTokenInstanceMap[key] = bToken
      return bToken
    }
  }
})()

export const pTokenFactory = (function() {
  const pTokenInstanceMap = {}
  return (chainId, contractAddress, poolAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.${poolAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}.${poolAddress}`
    }
    if (Object.keys(pTokenInstanceMap).includes(key)) {
      return pTokenInstanceMap[key]
    } else {
      const pToken = new PTokenContract(chainId, contractAddress, poolAddress, isProvider)
      //console.log("new PTokenContract")
      pTokenInstanceMap[key] = pToken
      return pToken
    }
  }
})()

export const lTokenFactory = (function() {
  const lTokenInstanceMap = {}
  return (chainId, contractAddress, poolAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.${poolAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}.${poolAddress}`
    }
    if (Object.keys(lTokenInstanceMap).includes(key)) {
      return lTokenInstanceMap[key]
    } else {
      const lToken = new LTokenContract(chainId, contractAddress, poolAddress, isProvider)
      //console.log("new LTokenContract")
      lTokenInstanceMap[key] = lToken
      return lToken
    }
  }
})()

export const miningVaultPoolFactory = (function() {
  const mVaultInstanceMap = {}
  return (chainId, contractAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}`
    }
    if (Object.keys(mVaultInstanceMap).includes(key)) {
      return mVaultInstanceMap[key]
    } else {
      const mVault= new MiningVaultPool(chainId, contractAddress, isProvider)
      //console.log("new MiningValutPool")
      mVaultInstanceMap[key] = mVault
      return mVault
    }
  }
})()

export const slpPoolFactory = (function() {
  const slpPoolInstanceMap = {}
  return (chainId, contractAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}`
    }
    if (Object.keys(slpPoolInstanceMap).includes(key)) {
      return slpPoolInstanceMap[key]
    } else {
      const slpPool= new SlpPool(chainId, contractAddress, isProvider)
      slpPoolInstanceMap[key] = slpPool
      return slpPool
    }
  }
})()

export const deriFactory = (function() {
  const deriInstanceMap = {}
  return (chainId, contractAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}`
    }
    if (Object.keys(deriInstanceMap).includes(key)) {
      return deriInstanceMap[key]
    } else {
      const deri = new DeriContract(chainId, contractAddress, isProvider)
      deriInstanceMap[key] = deri
      return deri
    }
  }
})()

export const wormholeFactory = (function() {
  const wormholeInstanceMap = {}
  return (chainId, contractAddress, isProvider=false) => {
    let key
    if (isProvider) {
     key = `${chainId}.${contractAddress}.isProvider`
    } else {
     key = `${chainId}.${contractAddress}`
    }
    if (Object.keys(wormholeInstanceMap).includes(key)) {
      return wormholeInstanceMap[key]
    } else {
      const wormhole= new WormholeContract(chainId, contractAddress, isProvider)
      wormholeInstanceMap[key] = wormhole
      return wormhole
    }
  }
})()