import { wooOracleFactory } from '../factory'
import { BTCUSD_ORACLE_ADDRESS } from './setup'

describe("wooOracle", () => {
  test('getPrice()', async() => {
    const btcusdOracle = wooOracleFactory('97', BTCUSD_ORACLE_ADDRESS, 'BTCUSD', true)
    const price = await btcusdOracle.getPrice()
    expect(price.length).toEqual(23)
  })
})