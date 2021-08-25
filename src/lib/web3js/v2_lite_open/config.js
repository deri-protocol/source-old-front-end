export const getPoolV2LiteManagerConfig = (env = 'dev') => {
  if (env === 'prod') {
    //return {address:"0x5e3318aeaa226dc11571f19b96240d88b64702dc",initialBlock: "10133599"}
    return "0x5e3318aeaa226dc11571f19b96240d88b64702dc"
  } else {
    //return {address:"0x7A55ed377361802fad1Ae3d944cDbAA3c7694757", initialBlock: "11034400"}
    return "0x7A55ed377361802fad1Ae3d944cDbAA3c7694757"
  }
}