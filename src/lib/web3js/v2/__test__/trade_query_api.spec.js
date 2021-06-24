import {
  getPoolBTokensBySymbolId,
  getWalletBalance,
  getSpecification,
  getPositionInfo,
  isUnlocked,
  getEstimatedMargin,
  getFundingRate,
  getLiquidityUsed,
  getEstimatedFundingRate,
  getEstimatedLiquidityUsed,
  getEstimatedFee,
} from '../api'
import { TIMEOUT, POOL_ADDRESS } from './setup';

describe('Trade query api', () => {
  it('getSpecification()', async() => {
    const input = ['97', POOL_ADDRESS, '0', '0', true]
    const output = {
      symbol: 'BTCUSD',
      bSymbol: 'BUSD',
      multiplier: '0.0001',
      feeRatio: '0.0005',
      minPoolMarginRatio: '1',
      minInitialMarginRatio: '0.1',
      minMaintenanceMarginRatio: '0.05',
      //minAddLiquidity: minAddLiquidity.toString(),
      //redemptionFeeRatio: redemptionFeeRatio.toString(),
      fundingRateCoefficient: '0.0000005',
      minLiquidationReward: '0',
      maxLiquidationReward: '1000',
      liquidationCutRatio: '0.5',
      protocolFeeCollectRatio: '0.2',
    }
    expect(await getSpecification(...input)).toEqual(output)
  }, TIMEOUT)
  it('getWalletBalance()', async() => {
    const input = ['97', POOL_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = '25549.931346801965144065'
    expect(await getWalletBalance(...input)).toEqual(output)
  }, TIMEOUT)
  it('getPoolBTokenBySymbol()', async() => {
    const input = ['97', POOL_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = [
      {
        bTokenAddress: '0x4038191eFb39Fe1d21a48E061F8F14cF4981A0aF',
        bTokenId: '0',
        bTokenSymbol: 'BUSD',
        walletBalance: '25549.931346801965144065',
        availableBalance: '9996.63687604',
      },
      {
        bTokenAddress: '0xd2F37BADdB702FF778aA038C63b7068054d93508',
        bTokenId: '1',
        bTokenSymbol: 'AUTO',
        walletBalance: '2000',
        availableBalance: '0',
      },
    ];
    expect(await getPoolBTokensBySymbolId(...input)).toEqual(output)
  }, TIMEOUT)
  it('getPositionInfo()', async() => {
    const input = ['97', POOL_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = {
      volume: '10',
      averageEntryPrice: '33463.92',
      margin: '9999.98326804',
      marginHeld: '2.8704363625',
      marginHeldBySymbol: '0',
      unrealizedPnl: '0.114298625',
      price: '40081.55',
      unrealizedPnlList: [
        ['BTCUSD', '0.386275'],
        ['ETHUSD', '0'],
      ],
      liquidationPrice: '0',
    };
    expect(await getPositionInfo(...input)).toEqual(output)
  }, TIMEOUT)
  it('isUnlocked()', async() => {
    const input = ['97', POOL_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = true
    expect(await isUnlocked(...input)).toEqual(output)
  }, TIMEOUT)
  it('getEstimatedMargin()', async() => {
    const input = ['97', POOL_ADDRESS, '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '5', '3', '0', true]
    const output = '5.857650833333333333'
    expect(await getEstimatedMargin(...input)).toEqual(output)
  }, TIMEOUT)
  // it('getEstimatedFee()', async() => {
  //   const input = ['97', POOL_ADDRESS, '5', '0', '0', true]
  //   const output = ''
  //   expect(await getEstimatedFee(...input)).toEqual(output)
  // }, TIMEOUT)
  it('getFundingRate()', async() => {
    const input = ['97', POOL_ADDRESS,'0', true]
    const output = {
      fundingRate0: '18.91612531353373828',
      fundingRatePerBlock: '0.000001801998428695',
      liquidity: '8208.024609014243170258',
      tradersNetVolume: '107',
      volume: '-',
    };
    expect(await getFundingRate(...input)).toEqual(output)
  }, TIMEOUT)
  it('getEstimatedFundingRate()', async() => {
    const input = ['97', POOL_ADDRESS, '8', '0', true]
    const output = {
      fundingRate1: '20.330415056603054808',
    };
    expect(await getEstimatedFundingRate(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityUsed()', async() => {
    const input = ['97', POOL_ADDRESS,'1', true]
    const output = {
      liquidityUsed0: '0.04846',
    };
    expect(await getLiquidityUsed(...input)).toEqual(output)
  }, TIMEOUT)
  it('getEstimatedLiquidityUsed()', async() => {
    const input = ['97', POOL_ADDRESS,'8', '1', true]
    const output = {
      liquidityUsed1: '0.0493'
    };
    expect(await getEstimatedLiquidityUsed(...input)).toEqual(output)
  }, TIMEOUT)
  it('getEstimatedFee()', async() => {
    const input = ['97', POOL_ADDRESS,'8', '0', true]
    const output = '0.002915'
    expect(await getEstimatedFee(...input)).toEqual(output)
  }, TIMEOUT)
})