import { getContractAddressConfig as getContractAddressConfig2 } from "../config";
import { getPoolConfigList as getPoolConfigListV2} from "../v2/config"
//import { getPoolVersion } from '../v2';

export const getContractAddressConfig = (env = 'dev', version) => {
  if (!version || version === '1' || version === 'v1') {
    return getContractAddressConfig2(env)
  } else if (version === '2' || version === 'v2') {
    const configListV1 = getContractAddressConfig2(env)
    const configListV2 = getPoolConfigListV2(version)
    const configListV2Lite = getPoolConfigListV2('v2_lite')
    return configListV2.concat(configListV2Lite).concat(configListV1)
  } else {
    throw new Error(`getPoolContractAddress: invalid version: ${version}`)
  }
}