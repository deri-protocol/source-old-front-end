import {
  getPoolConfigList as getPoolV2ConfigList,
  getPoolV1ConfigList,
} from '../shared/config';

export const getContractAddressConfig = (env = 'dev', version) => {
  if (!version || version === '1' || version === 'v1') {
    return getPoolV1ConfigList(env);
  } else if (['v2','v2_lite', 'v2_lite_open'].includes(version)) {
    return getPoolV2ConfigList(version, env);
  } else {
    throw new Error(`getContractAddressConfig: invalid version: ${version}`);
  }
};
