import {
  //databaseFactory,
  perpetualPoolFactory,
  bTokenFactory,
  pTokenFactory,
  lTokenFactory,
  miningVaultPoolFactory,
  //slpPoolFactory,
} from './contracts';
import { getContractAddressConfig } from '../config';
import { DeriEnv } from '../config/env';

export const initPools = (chainId) => {
  const pools = getContractAddressConfig(DeriEnv.get()).filter(
    (c) => c.chainId === chainId
  );
  for (let i = 0; i < pools.length; i++) {
    const poolAddress = pools[i].pool;
    const bTokenAddress = pools[i].bToken;
    const pTokenAddress = pools[i].pToken;
    const lTokenAddress = pools[i].lToken;
    const MiningVaultAddress = pools[i].MiningVault;
    perpetualPoolFactory(chainId, poolAddress);
    bTokenFactory(chainId, bTokenAddress, poolAddress);
    pTokenFactory(chainId, pTokenAddress, poolAddress);
    lTokenFactory(chainId, lTokenAddress, poolAddress);

    if (MiningVaultAddress) {
      miningVaultPoolFactory(chainId, MiningVaultAddress);
    }
  }
  // const slpPools = getSlpContractAddressConfig(DeriEnv.get())
  // for (let i = 0; i < slpPools.length; i++) {
  //   const poolAddress = slpPools[i]["pool"];
  //   const bTokenAddress = slpPools[i]["bToken"];
  //   // const pTokenAddress = pools[i]["pToken"];
  //   // const lTokenAddress = pools[i]["lToken"];
  //   // const MiningVaultAddress = pools[i]["MiningVault"];

  //   slpPoolFactory(chainId, poolAddress);
  //   bTokenFactory(chainId, bTokenAddress, poolAddress);
  // }
};

export const initDatabase = () => {
  //   databaseFactory();
};
