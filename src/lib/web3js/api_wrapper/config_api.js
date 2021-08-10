import {
  getPoolConfigList as getPoolV2ConfigList,
  getPoolV1ConfigList,
  VERSIONS,
} from '../shared/config';

export const getContractAddressConfig = (env = 'dev', version) => {
  if (!version || version === '1' || version === 'v1') {
    return getPoolV1ConfigList(env);
  } else if (VERSIONS.includes(version)) {
    return getPoolV2ConfigList(version);
  } else {
    throw new Error(`getContractAddressConfig: invalid version: ${version}`);
  }
};
