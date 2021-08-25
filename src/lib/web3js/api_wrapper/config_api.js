import {
  DeriEnv,
  getPoolConfigList as getPoolV2ConfigList,
  getPoolV1ConfigList,
  VERSIONS,
} from '../shared/config';

export const getContractAddressConfig = (env, version) => {
  env = env || DeriEnv.get()
  if (version === 'v1') {
    return getPoolV1ConfigList(env);
  } else if (VERSIONS.includes(version)) {
    return getPoolV2ConfigList(version, env);
  } else {
    throw new Error(`getContractAddressConfig: invalid version: ${version}`);
  }
};
