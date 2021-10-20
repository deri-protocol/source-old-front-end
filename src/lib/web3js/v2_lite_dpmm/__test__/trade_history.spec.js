import { DeriEnv } from "../../shared";
import { getTradeHistory } from "../api/trade_history_api"

describe('tradeHistory', () => {
  it('getTradeHistory', async () => {
    const chainId = '97';
    const pool = '0x43701b4bf0430DeCFA41210327fE67Bf4651604C';
    const account = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF';

    DeriEnv.set('testnet')
    const res = await getTradeHistory(chainId, pool, account, '0');

    expect(res).toEqual([])
  }, 60000);

})