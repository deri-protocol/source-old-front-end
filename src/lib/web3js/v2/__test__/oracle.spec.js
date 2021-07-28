import { deriToNatural } from '../../utils'
import { oracleFactory } from '../factory'
import { getPriceInfo } from '../utils'
import { BTCUSD_ORACLE_ADDRESS, TIMEOUT } from './setup'

describe("oracle", () => {
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
    const btcusdOracle = oracleFactory('80001', '0xc0797C024e79E6e4D9473aE00c7fFCD4cce84Cc8', 'ETHUSD', '18' )
    const price = await btcusdOracle.getPrice()
    expect(price.split('.')[0].length).toEqual(4)
  }, TIMEOUT)
  test('chainlink MUMBAI MATICUSD getPrice()', async() => {
    const btcusdOracle = oracleFactory('80001', '0x002685d9aD90bE8DECf61544EA48a37A0D7c4710', 'MATICUSD', '18' )
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
  test('offchain oracle bsctestnet AXSUSDT getPrice()', async() => {
    const oracle = oracleFactory('97', '0x63F73b157Ee52dE3c3f9248753a05Aa5649B6f87', 'AXSUSDT')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(2)
  }, TIMEOUT)
  test('offchain oracle bsctestnet MANAUSDTgetPrice()', async() => {
    const oracle = oracleFactory('97', '0x386BcDB9De6ce9df9232B7239073b0A931B7f39c', 'MANAUSDT')
    const price = await oracle.getPrice()
    expect(price.split('.')[0].length).toEqual(1)
  }, TIMEOUT)
  test('getPriceInfo AXSUSDT', async() => {
    const priceInfo = await getPriceInfo('AXSUSDT')
    const price =  deriToNatural(priceInfo.price).toNumber()
    expect(price).toBeGreaterThanOrEqual(15)
  }, TIMEOUT)
}, TIMEOUT)
