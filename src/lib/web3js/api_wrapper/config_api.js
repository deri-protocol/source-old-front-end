import {
  DeriEnv,
  getPoolConfigList as getPoolV2ConfigList,
  getPoolV1ConfigList,
  VERSIONS,
} from '../shared/config';
import { ALL_EXCEPT_OPEN_VERSIONS } from '../shared/config/version';

export const getContractAddressConfig = (env, version) => {
  env = env || DeriEnv.get()
  if (version === 'v1') {
    return getPoolV1ConfigList(env);
  } else if (VERSIONS.includes(version)) {
    return getPoolV2ConfigList(version, env);
  } else if (version === undefined) {
    return ALL_EXCEPT_OPEN_VERSIONS.reduce((acc, v) => [...acc, ...getPoolV2ConfigList(v, env)], [])
  } else {
    throw new Error(`getContractAddressConfig: invalid version: ${version}`);
  }
};
