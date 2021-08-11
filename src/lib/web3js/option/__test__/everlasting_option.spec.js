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
        bTokenAddress: '0x4405F3131E2659120E4F931146f032B4c05314E2',
        lTokenAddress: '0x739235a3F72f76F8aA8A880dE20A9a3849ea8Db8',
        liquidatorQualifierAddress:
          '0x0000000000000000000000000000000000000000',
        pTokenAddress: '0xB7517aCe9B2409C3Fd1f522493f0420B86D1e490',
        protocolFeeCollector: '0x4aF582Fd437f997F08df645aB6b0c070CC791DeE',
      })
    );
  }, TIMEOUT)
  it('getProtocolFeeAccrued', async() => {
    const res = await everlastingOption.getProtocolFeeAccrued()
    expect(bg(res).toNumber()).toBeGreaterThan(10)
  }, TIMEOUT)
  it('OptionPricer', async() => {
    const res = await everlastingOption.OptionPricer()
    expect(res).toEqual('0xE6522df9Eab9D0e454Ba79368ccBae63D005B198')
  }, TIMEOUT)
  it('PmmPricer', async() => {
    const res = await everlastingOption.PmmPricer()
    expect(res).toEqual('0x4CdE7a44a8d527254161Da62829669D673a3F402')
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
          oracleAddress: '0x78Db6d02EE87260a5D825B31616B5C29f927E430',
          quote_balance_offset: expect.any(String),
          strikePrice: '20000',
          symbol: 'BTCUSD-20000-C',
          symbolId: '0',
          timeValue:  expect.any(String),
          tradersNetCost: expect.any(String),
          tradersNetVolume: expect.any(String),
          volatilityAddress: '0xF6c2582635d26f793898a4BAC5e8843b82eB4121',
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
