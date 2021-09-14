import { DeriEnv } from "../shared/config"

export const getPTokenAirdropConfig = (chainId, env) => {
  chainId = chainId.toString()
  env = env || DeriEnv.get();
  const config = {
    prod: [
      {
        chainId: '56',
        address: '0x055FD7f825cCD1b87092A1Ee40462c4c60dDD8ba',
      },
    ],
    dev: [
      {
        chainId: '97',
        address: '0x632D0f5d642B0d915cE1ad0772677FC589cc724d',
      },
    ],
  };

  if (Object.keys(config).includes(env)) {
    const res = config[env].find((c) => c.chainId === chainId);
    if (res) {
      return res
    }
  } 
  throw new Error(`-- getPTokenAirdropConfig(), invalid env(${env}) or chainId(${chainId})`)
};
