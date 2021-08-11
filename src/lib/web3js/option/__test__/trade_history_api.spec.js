import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { getTradeHistory } from "../api/trade_history_api"

describe('Trade History Api', () => {
  it("getTradeHistory", async() => {
    const res = await getTradeHistory(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '0')
    expect(res.length).toEqual(1)
  }, TIMEOUT)
})