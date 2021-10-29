import { DeriEnv } from "../../shared"
import { ACCOUNT_ADDRESS, CHAIN_ID, OPTION_POOL_ADDRESS, TIMEOUT } from "../../shared/__test__/setup"
import { getTradeHistory } from "../api/trade_history_api"

describe('Trade History Api', () => {
  // it("getTradeHistory prod", async() => {
  //   //const res = await getTradeHistory(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '0')
  //   //DeriEnv.set('prod')
  //   const res = await getTradeHistory(
  //     '97',
  //     '0x0D0c982af263a02DF481A642798ab815832904B7',
  //     //'0x25397afDe5B222fca348CAa46218F9710273faC4',
  //     '0xFefC938c543751babc46cc1D662B982bd1636721',
  //     '0'
  //   );
  //   expect(res.length).toBeGreaterThanOrEqual(0);
  //   expect(res).toEqual([])
  //   DeriEnv.set('dev')
  // }, TIMEOUT)
  it("getTradeHistory testnet", async() => {
    //const res = await getTradeHistory(CHAIN_ID, OPTION_POOL_ADDRESS, ACCOUNT_ADDRESS, '0')
    DeriEnv.set('testnet')
    const res = await getTradeHistory(
      '97',
      '0xd2D625bfe66FC99dE2351Ac3B4Cc53C6f61563A8',
      '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF',
      '0'
    );
    expect(res).toEqual([])
    DeriEnv.set('dev')
  }, TIMEOUT)
})