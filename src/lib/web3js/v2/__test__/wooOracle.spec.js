import { wooOracleFactory } from '../factory'
import fetch from 'node-fetch'
global.fetch = fetch

describe("wooOracle", () => {
  test('getPrice()', async() => {
    const btcusdOracle = wooOracleFactory('97', '0x72Dba14f90bFF7D74B7556A37205c1291Db7f1E9', 'BTCUSD', true)
    const price = await btcusdOracle.getPrice()
    expect(price.length).toEqual(23)
  })
})