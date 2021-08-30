import { CHAIN_ID, TIMEOUT } from "../../shared/__test__/setup"
import { getPoolV2LiteOpenConfigList, getPoolV2LiteOpenOracleInfos } from "../api"

describe('v2_lite_open api',() => {
  it('getPoolV2LiteOpenConfigList', async() => {
    const res = await getPoolV2LiteOpenConfigList(CHAIN_ID)
    expect(res).toEqual([])
  }, TIMEOUT)
  it('getPoolV2LiteOpenOracleInfos', async() => {
    const res = await getPoolV2LiteOpenOracleInfos()
    expect(res).toEqual([])
  }, TIMEOUT)
})