import { getContractAddressConfig as getContractAddressConfig2 } from "../config";
import { getPoolConfigList as getPoolConfigListV2} from "../v2/config"
//import { getPoolVersion } from '../v2';

export const getContractAddressConfig = (env = 'dev', version) => {
  if (!version || version === '1' || version === 'v1') {
    return getContractAddressConfig2(env)
  } else if (version === 'v2' || version === 'v2_lite') {
    return getPoolConfigListV2(version)
  } else {
    throw new Error(`getPoolContractAddress: invalid version: ${version}`)
  }
}