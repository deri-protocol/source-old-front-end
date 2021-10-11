import {
  getDBAddress,
  getDBWormholeAddress,
  getDBAirdropAddress,
  DeriEnv,
} from '../config';
import {
  DatabaseAirdropContract,
  DatabaseContract,
  DatabaseWormholeContract,
} from '../contract';

export const databaseFactory = (() => {
  const databaseInstanceMap = {};
  return (useProductionDB = false) => {
    const address = getDBAddress(DeriEnv.get(), useProductionDB);
    const key = address;
    if (Object.keys(databaseInstanceMap).includes(key)) {
      return databaseInstanceMap[key];
    }
    const database = new DatabaseContract(address);
    databaseInstanceMap[key] = database;
    return database;
  };
})();

export const databaseActivityFactory = (() => {
  const databaseInstanceMap = {};
  return () => {
    const address = DeriEnv.get() === 'prod' ? '0x75E04C816F206939a92AE7B23015ce3ef21aE571' : '0x7C1267188379f57d92e640E519151229E1eA5565'
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
    const address = getDBWormholeAddress(DeriEnv.get(), useProductionDB);
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
    const address = getDBAirdropAddress(DeriEnv.get(), useProductionDB);
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
