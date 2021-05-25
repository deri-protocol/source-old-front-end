const { getContractAddressConfig:getContractAddressConfig2} = require("../config");
const { getPoolConfigList:getPoolConfigListV2} = require("../v2/config")

export const getContractAddressConfig = (env = 'dev', version) => {
  if (!version || version === '1' || version === 'v1') {
    return getContractAddressConfig2(env)
  } else if (version === '2' || version === 'v2') {
    return getPoolConfigListV2(env).concat(getContractAddressConfig2(env))
  } else {
    throw new Error(`getPoolContractAddress: invalid version: ${version}`)
  }
}