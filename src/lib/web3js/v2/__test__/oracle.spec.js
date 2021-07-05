import { oracleFactory } from '../factory'
import { TIMEOUT } from './setup'

describe("oracle", () => {
  test('woo getPrice()', async() => {
    const btcusdOracle = oracleFactory('97', '0x72Dba14f90bFF7D74B7556A37205c1291Db7f1E9', 'BTCUSD', '18', true)
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('chainlink ETCUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('80001', '0x0715A7794a1dc8e42615F059dD6e406A6594651A', 'ETHUSD', '8', true)
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('chainlink mumbai MATICUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('80001', '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada', 'MATICUSD', '8', true)
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(1)
  }, TIMEOUT)
  test('oracle matic BTCUSD getPrice()', async() => {
    const oracle = oracleFactory('137', '0xe079ed411716d71fc746C403fa56fb38243Ab34F', 'BTCUSD', '18', true)
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('oracle matic ETH getPrice()', async() => {
    const oracle = oracleFactory('137', '0xea830185A2a1719967386E17C479f2539B0F915E', 'ETHUSD', '18', true)
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  })
}, TIMEOUT)
