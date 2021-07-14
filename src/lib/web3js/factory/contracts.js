import { PerpetualPool } from '../contract/perpetual_pool';
import { BTokenContract } from '../contract/bToken';
import { PTokenContract } from '../contract/pToken';
import { LTokenContract } from '../contract/lToken';
import { DatabaseContract } from '../contract/database';
import { DatabaseWormholeContract } from '../contract/database_wormhole';
import { DatabaseAirdropContract } from '../contract/database_airdrop';
import { MiningVaultPool } from '../contract/mining_vault_pool';
import { MiningVaultRouter } from '../contract/mining_vault_router';

import { DeriEnv } from '../config/env';
import { getDBAddressConfig, getDBWormholeAddressConfig, getDBAirdropAddressConfig } from '../config';
import { SlpPool } from '../contract/slp_pool';
import { ClpPool } from '../contract/clp_pool';
import { Clp2Pool } from '../contract/clp2_pool';
import { DeriContract } from '../contract/deri';
import { WormholeContract } from '../contract/wormhole';
//import { getLpContractAddress } from '../utils';
// import { getPoolBaseSymbolList } from '../utils'

export const databaseFactory = (() => {
  const databaseInstanceMap = {};
  return (useProductionDB = false) => {
    const address = getDBAddressConfig(DeriEnv.get(), useProductionDB);
    const key = address;
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key];
    }
    const database = new DatabaseContract(address);
    databaseInstanceMap[key] = database;
    return database;
  };
})();

export const databaseWormholeFactory = (() => {
  const databaseInstanceMap = {};
  return (useProductionDB = false) => {
    const address = getDBWormholeAddressConfig(DeriEnv.get(), useProductionDB);
    const key = address;
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key];
    }
    const database = new DatabaseWormholeContract(address);
    databaseInstanceMap[key] = database;
    return database;
  };
})();

export const databaseAirdropFactory = (() => {
  const databaseInstanceMap = {};
  return (useProductionDB = false) => {
    const address = getDBAirdropAddressConfig(DeriEnv.get(), useProductionDB);
    const key = address;
    //console.log('---airdrop key', key)
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key];
    }
    const database = new DatabaseAirdropContract(address);
    databaseInstanceMap[key] = database;
    return database;
  };
})();

export const perpetualPoolFactory = (() => {
  const perpetualPoolInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(perpetualPoolInstanceMap).includes(key)) {
      return perpetualPoolInstanceMap[key];
    }
    const perpetualPool = new PerpetualPool(
      chainId,
      contractAddress,
      isProvider
    );
    // console.log("new PerpetualPoolContract");
    perpetualPoolInstanceMap[key] = perpetualPool;
    return perpetualPool;
  };
})();

export const bTokenFactory = (function () {
  const bTokenInstanceMap = {};
  return (chainId, contractAddress, poolAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.${poolAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}.${poolAddress}`;
    }
    if (Object.keys(bTokenInstanceMap).includes(key)) {
      return bTokenInstanceMap[key];
    }
    const bToken = new BTokenContract(
      chainId,
      contractAddress,
      poolAddress,
      isProvider
    );
    // console.log("new BTokenContract")
    bTokenInstanceMap[key] = bToken;
    return bToken;
  };
})();

export const pTokenFactory = (function () {
  const pTokenInstanceMap = {};
  return (chainId, contractAddress, poolAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.${poolAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}.${poolAddress}`;
    }
    if (Object.keys(pTokenInstanceMap).includes(key)) {
      return pTokenInstanceMap[key];
    }
    const pToken = new PTokenContract(
      chainId,
      contractAddress,
      poolAddress,
      isProvider
    );
    // console.log("new PTokenContract")
    pTokenInstanceMap[key] = pToken;
    return pToken;
  };
})();

export const lTokenFactory = (function () {
  const lTokenInstanceMap = {};
  return (chainId, contractAddress, poolAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.${poolAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}.${poolAddress}`;
    }
    if (Object.keys(lTokenInstanceMap).includes(key)) {
      return lTokenInstanceMap[key];
    }
    const lToken = new LTokenContract(
      chainId,
      contractAddress,
      poolAddress,
      isProvider
    );
    // console.log("new LTokenContract")
    lTokenInstanceMap[key] = lToken;
    return lToken;
  };
})();

export const miningVaultPoolFactory = (function () {
  const mVaultInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(mVaultInstanceMap).includes(key)) {
      return mVaultInstanceMap[key];
    }
    const mVault = new MiningVaultPool(chainId, contractAddress, isProvider);
    // console.log("new MiningValutPool")
    mVaultInstanceMap[key] = mVault;
    return mVault;
  };
})();

export const slpPoolFactory = (function () {
  const slpPoolInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(slpPoolInstanceMap).includes(key)) {
      return slpPoolInstanceMap[key];
    }
    const slpPool = new SlpPool(chainId, contractAddress, isProvider);
    slpPoolInstanceMap[key] = slpPool;
    return slpPool;
  };
})();

export const clpPoolFactory = (function () {
  const clpPoolInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(clpPoolInstanceMap).includes(key)) {
      return clpPoolInstanceMap[key];
    }
    const clpPool = new ClpPool(chainId, contractAddress, isProvider);
    clpPoolInstanceMap[key] = clpPool;
    return clpPool;
  };
})();

export const clp2PoolFactory = (function () {
  const clp2PoolInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(clp2PoolInstanceMap).includes(key)) {
      return clp2PoolInstanceMap[key];
    }
    const clp2Pool = new Clp2Pool(chainId, contractAddress, isProvider);
    clp2PoolInstanceMap[key] = clp2Pool;
    return clp2Pool;
  };
})();

// export const lpPoolFactory = (function () {
//   const lpPoolInstanceMap = {};
//   return (chainId, contractAddress, isProvider = false) => {
//     let key;
//     if (isProvider) {
//       key = `${chainId}.${contractAddress}.isProvider`;
//     } else {
//       key = `${chainId}.${contractAddress}`;
//     }
//     if (Object.keys(lpPoolInstanceMap).includes(key)) {
//       return lpPoolInstanceMap[key];
//     } else {
//       let lpPool;
//       const { type } = getLpContractAddress(chainId, contractAddress);
//       console.log(`lp type: ${type}`);
//       if (type === 'slp') {
//         lpPool = new SlpPool(chainId, contractAddress, isProvider);
//       } else if (type === 'clp') {
//         lpPool = new ClpPool(chainId, contractAddress, isProvider);
//       }
//       lpPoolInstanceMap[key] = lpPool;
//       return lpPool;
//     }
//   };
// })();

export const deriFactory = (function () {
  const deriInstanceMap = {};
  return (chainId, contractAddress, poolAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(deriInstanceMap).includes(key)) {
      return deriInstanceMap[key];
    }
    const deri = new DeriContract(
      chainId,
      contractAddress,
      poolAddress,
      isProvider
    );
    deriInstanceMap[key] = deri;
    return deri;
  };
})();

export const wormholeFactory = (function () {
  const wormholeInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(wormholeInstanceMap).includes(key)) {
      return wormholeInstanceMap[key];
    }
    const wormhole = new WormholeContract(chainId, contractAddress, isProvider);
    wormholeInstanceMap[key] = wormhole;
    return wormhole;
  };
})();

export const miningVaultRouterFactory = (function () {
  const mVaultInstanceMap = {};
  return (chainId, contractAddress, isProvider = false) => {
    let key;
    if (isProvider) {
      key = `${chainId}.${contractAddress}.isProvider`;
    } else {
      key = `${chainId}.${contractAddress}`;
    }
    if (Object.keys(mVaultInstanceMap).includes(key)) {
      return mVaultInstanceMap[key];
    }
    const mVault = new MiningVaultRouter(chainId, contractAddress, isProvider);
    mVaultInstanceMap[key] = mVault;
    return mVault;
  };
})();
