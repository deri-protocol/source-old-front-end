import {
  getPoolBTokensBySymbolId,
  getWalletBalance,
  getSpecification,
  getPositionInfo,
  isUnlocked,
  getEstimatedFee,
  getEstimatedMargin,
} from '../api'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('Trade query api', () => {
  it('getSpecification()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0', '0', true]
    const output = {
      symbol: 'BTCUSD',
      bSymbol: 'BUSD',
      multiplier: '0.0001',
      feeRatio: '0.0001',
      minPoolMarginRatio: '1',
      minInitialMarginRatio: '0.1',
      minMaintenanceMarginRatio: '0.05',
      //minAddLiquidity: minAddLiquidity.toString(),
      //redemptionFeeRatio: redemptionFeeRatio.toString(),
      fundingRateCoefficient: '0.00001',
      minLiquidationReward: '10',
      maxLiquidationReward: '200',
      liquidationCutRatio: '0.5',
      protocolFeeCollectRatio: '0.2',
    }
    expect(await getSpecification(...input)).toEqual(output)
  }, TIMEOUT)
  it('getWalletBalance()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = '47320'
    expect(await getWalletBalance(...input)).toEqual(output)
  }, TIMEOUT)
  it('getPoolBTokenBySymbol()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = [
      {
        bTokenAddress: "0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF",
        bTokenId: '0',
        bTokenSymbol: 'BUSD',
        walletBalance: '47320',
        availableBalance: '0'
      },
      {
        bTokenAddress: "0x5f59b256e411CB222D1790a08De492f4b6dA6E62",
        bTokenId: '1',
        bTokenSymbol: 'BETH',
        walletBalance: '29',
        availableBalance: '0'
      },
    ]
    expect(await getPoolBTokensBySymbolId(...input)).toEqual(output)
  }, TIMEOUT)
  it('getPositionInfo()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', '0', true]
    const output = {
      volume: '7',
      averageEntryPrice: '40842.95',
      margin: '161.833538410037708476',
      marginHeld: '2.8704363625',
      unrealizedPnl: '0.114298625',
      liquidationPrice: '0',
    };
    expect(await getPositionInfo(...input)).toEqual(output)
  }, TIMEOUT)
  it('isUnlocked()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = true
    expect(await isUnlocked(...input)).toEqual(output)
  }, TIMEOUT)
  it('getEstimatedMargin()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '5', '3', '0', true]
    const output = '6.7'
    expect(await getEstimatedMargin(...input)).toEqual(output)
  }, TIMEOUT)
  // it('getEstimatedFee()', async() => {
  //   const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '5', '0', '0', true]
  //   const output = ''
  //   expect(await getEstimatedFee(...input)).toEqual(output)
  // }, TIMEOUT)
})