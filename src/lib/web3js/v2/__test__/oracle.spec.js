import { oracleFactory } from '../factory'
import { BTCUSD_ORACLE_ADDRESS, TIMEOUT } from './setup'

describe("oracle", () => {
  test('bsc BTCUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('56', '0xFB395C51eb2b89e873e97E5CD4ca81B0756147BB', 'BTCUSD')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('bsc ETHUSD getPrice()', async() => {
    const oracle = oracleFactory('56', '0xC8e3a84927593c047239c2437A3893e6BC5050F0', 'ETHUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('bsctestnet BTCUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('97', BTCUSD_ORACLE_ADDRESS , 'BTCUSD')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('bsctestnet ETHUSD getPrice()', async() => {
    const oracle = oracleFactory('97', '0x2322608418C22E9d0751334E4Bc9b3865bad9937', 'ETHUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('chainlink ETCUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('80001', '0xc0797C024e79E6e4D9473aE00c7fFCD4cce84Cc8', 'ETHUSD')
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('chainlink mumbai MATICUSD getPrice()', async() => {
    const oracle = oracleFactory('80001', '0x002685d9aD90bE8DECf61544EA48a37A0D7c4710', 'MATICUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(1)
  }, TIMEOUT)
  test('oracle matic BTCUSD getPrice()', async() => {
    const oracle = oracleFactory('137', '0xe079ed411716d71fc746C403fa56fb38243Ab34F', 'BTCUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('oracle matic ETH getPrice()', async() => {
    const oracle = oracleFactory('137', '0xea830185A2a1719967386E17C479f2539B0F915E', 'ETHUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('wrapped oracle bsctestnet BTCUSD getPrice()', async() => {
    const oracle = oracleFactory('97', '0x78Db6d02EE87260a5D825B31616B5C29f927E430', 'BTCUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(5)
  }, TIMEOUT)
  test('wrapped oracle bsctestnet ETHUSD getPrice()', async() => {
    const oracle = oracleFactory('97', '0xdF0050D6A07C19C6F6505d3e66B68c29F41edA09', 'BTCUSD')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
}, TIMEOUT)
