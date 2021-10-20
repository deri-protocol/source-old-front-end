import { DeriEnv } from "../../shared"
import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { getTradeHistory } from "../api/trade_history_api"

describe('Trade History Api', () => {
  it("getTradeHistory", async() => {
    //const res = await getTradeHistory(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '0')
    DeriEnv.set('prod')
    const res = await getTradeHistory(
      '56',
      '0xD5147D3d43BB741D8f78B2578Ba8bB141A834de4',
      //'0x25397afDe5B222fca348CAa46218F9710273faC4',
      '0x7a1Dd380e5d069857c2770A8D865bEA8A4A65ad3',
      '0'
    );
    expect(res.length).toBeGreaterThanOrEqual(0);
    expect(res).toEqual([])
    DeriEnv.set('dev')
  }, TIMEOUT)
})