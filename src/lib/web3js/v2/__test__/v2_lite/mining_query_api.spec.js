import { getLiquidityInfo } from "../../api/v2_lite/mining_query_api"
import { ACCOUNT_ADDRESS, CHAIN_ID, POOL_ADDRESS_LITE, TIMEOUT } from "../setup"

describe('mining_query_api', () => {
  it('getLiquidityInfo', async() => {
    const output = {
      totalSupply: '65383.906200632777635848',
      poolLiquidity: '69482.233475609474967096',
      shares: '94.101741732381432575',
      shareValue: '1.06268097935906182',
      maxRemovableShares: '94.101741732381432575',
    }
    expect(await getLiquidityInfo(CHAIN_ID, POOL_ADDRESS_LITE, ACCOUNT_ADDRESS)).toEqual(output)
  }, TIMEOUT)
})