import { getBroker } from "../api/broker_api";
import { POOL_ADDRESS, ACCOUNT_ADDRESS, TIMEOUT } from "./setup";

describe('broker api', () => {
  test('getBroker', async () => {
    const res = await getBroker('97', POOL_ADDRESS, ACCOUNT_ADDRESS, true)
    expect(res).toEqual('0x0000000000000000000000000000000000000000')
  }, TIMEOUT)
})