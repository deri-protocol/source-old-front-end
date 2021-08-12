import { CHAIN_ID, OPTION_PTOKEN_ADDRESS, OPTION_POOL_ADDRESS, TIMEOUT } from '../../shared/__test__/setup';
import { bg } from '../../shared';
import { everlastingOptionFactory, pTokenOptionFactory, lTokenOptionFactory, everlastingOptionViewerFactory } from '../factory';

describe('EverlastingOption', () => {
  let everlastingOption
  beforeAll(() => {
    everlastingOption = everlastingOptionFactory(CHAIN_ID, OPTION_POOL_ADDRESS)
  })
  it('getParameter', async() => {
    const res = await everlastingOption.getParameters()
    expect(res).toEqual(
      expect.objectContaining({
        initialMarginRatio: '0.1',
        liquidationCutRatio: '0.5',
        maintenanceMarginRatio: '0.05',
        maxLiquidationReward: '1000',
        minLiquidationReward: '10',
        protocolFeeCollectRatio: '0.2',
      })
    );
  }, TIMEOUT)
  it('getLiquidity', async() => {
    const res = await everlastingOption.getLiquidity()
    expect(bg(res).toNumber()).toBeGreaterThan(10000)
    expect(bg(res).toNumber()).toBeLessThan(10000000)
  }, TIMEOUT)
  it('getAddresses', async() => {
    const res = await everlastingOption.getAddresses()
    expect(res).toEqual(
      expect.objectContaining({
        bTokenAddress: '0x2ebE70929bC7D930248040f54135dA12f458690C',
        lTokenAddress: '0xCeBF39aF5e8D9736985ddCb6E45c016Fd146218C',
        liquidatorQualifierAddress:
          '0x0000000000000000000000000000000000000000',
        pTokenAddress: '0x7484e22022C971e314A00e0dfbfCDe8E223c80aC',
        protocolFeeCollector: '0x4aF582Fd437f997F08df645aB6b0c070CC791DeE',
      })
    );
  }, TIMEOUT)
  it('getProtocolFeeAccrued', async() => {
    const res = await everlastingOption.getProtocolFeeAccrued()
    expect(bg(res).toNumber()).toBeGreaterThan(2)
  }, TIMEOUT)
  it('OptionPricer', async() => {
    const res = await everlastingOption.OptionPricer()
    expect(res).toEqual('0x2D346A85299d812C0c0e97B23CD1ff0F37b606Ab')
  }, TIMEOUT)
  it('PmmPricer', async() => {
    const res = await everlastingOption.PmmPricer()
    expect(res).toEqual('0x1D7AFF20BB5E52dDD10d5B4B0e0b91b5327Ae826')
  }, TIMEOUT)
  it('_T', async() => {
    const res = await everlastingOption._T()
    expect(bg(res).toNumber()).toBeGreaterThan(0.002)
  }, TIMEOUT)
  it(
    'getSymbol',
    async () => {
      const res = await everlastingOption.getSymbol('0');
      expect(res).toEqual(
        expect.objectContaining({
          K: '0.9',
          cumulativeDeltaFundingRate: expect.any(String),
          cumulativePremiumFundingRate: expect.any(String),
          diseqFundingCoefficient: '0.000005',
          feeRatio: '0.005',
          intrinsicValue: expect.any(String),
          isCall: true,
          multiplier: '0.01',
          oracleAddress: '0x18C036Ee25E205c224bD78f10aaf78715a2B6Ff1',
          quote_balance_offset: expect.any(String),
          strikePrice: '20000',
          symbol: 'BTCUSD-20000-C',
          symbolId: '0',
          timeValue:  expect.any(String),
          tradersNetCost: expect.any(String),
          tradersNetVolume: expect.any(String),
          volatilityAddress: '0x7A4701A1A93BB7692351aEBcD4F5Fab1d4377BBc',
        })
      );
      expect(bg(res.tradersNetVolume).toNumber()).toBeGreaterThan(-100)
    },
    TIMEOUT
  );
  it('_getVolSymbolPrices', async() => {
    const res = await everlastingOption._getVolSymbolPrices()
    expect(res.length).toEqual(2)
    expect(bg(res[0][2]).toNumber()).toBeGreaterThan(1)
  }, TIMEOUT)
  it('optionPool pToken', async() => {
    const pToken = pTokenOptionFactory(CHAIN_ID, everlastingOption.pTokenAddress)
    const res = await pToken.symbol()
    expect(res).toEqual('DPT')
  }, TIMEOUT)
  it('optionPool lToken', async() => {
    const lToken = lTokenOptionFactory(CHAIN_ID, everlastingOption.lTokenAddress)
    const res = await lToken.symbol()
    expect(res).toEqual('DLT')
  }, TIMEOUT)
  it('optionPool viewer', async() => {
    const viewer = everlastingOptionViewerFactory(CHAIN_ID, everlastingOption.viewerAddress)
    const res = await viewer.getPoolStates(everlastingOption.contractAddress, [])
    expect(res.poolState.pToken).toEqual(OPTION_PTOKEN_ADDRESS)
  }, TIMEOUT)
});
