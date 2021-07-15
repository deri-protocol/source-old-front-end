import { oracleFactory } from '../factory'
import { TIMEOUT } from './setup'

describe("oracle", () => {
  test('woo BSCTESTNET getPrice()', async() => {
    const btcusdOracle = oracleFactory('97', '0x72Dba14f90bFF7D74B7556A37205c1291Db7f1E9', 'BTCUSD', '18')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('oracle BSC BTCUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('56', '0xe5709F0a23aEA3A61B0db91E92458fb6a0a55857', 'BTCUSD', '18')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('oracle BSC ETHUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('56', '0xA0F51e28Ec15fcC9816FaB40684f1D1C675Bd39b', 'ETHUSD', '18')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('oracle BSC BNBUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('56', '0xa356c0559e0DdFF9281bF8f061035E7097a84Fa4', 'BNBUSD', '18')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(3)
  }, TIMEOUT)
  test('chainlink MUMBAI ETCUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('80001', '0x0715A7794a1dc8e42615F059dD6e406A6594651A', 'ETHUSD', '8' )
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('chainlink MUMBAI MATICUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('80001', '0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada', 'MATICUSD', '8' )
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(1)
  }, TIMEOUT)
  test('oracle MATIC BTCUSD getPrice()', async() => {
    const oracle = oracleFactory('137', '0xe079ed411716d71fc746C403fa56fb38243Ab34F', 'BTCUSD', '18')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('oracle MATIC ETH getPrice()', async() => {
    const oracle = oracleFactory('137', '0xea830185A2a1719967386E17C479f2539B0F915E', 'ETHUSD', '18')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  })
}, TIMEOUT)
