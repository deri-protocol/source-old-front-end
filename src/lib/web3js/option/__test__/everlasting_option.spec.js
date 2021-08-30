import { CHAIN_ID, OPTION_PTOKEN_ADDRESS, OPTION_POOL_ADDRESS, TIMEOUT } from '../../shared/__test__/setup';
import { bg } from '../../shared';
import {
  everlastingOptionFactory,
} from '../factory/pool';
import {
  pTokenOptionFactory,
  lTokenOptionFactory,
  everlastingOptionViewerFactory,
} from '../factory/tokens';

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
    expect(res).toHaveProperty('bTokenAddress', '0x2ebE70929bC7D930248040f54135dA12f458690C')
    expect(res).toHaveProperty('lTokenAddress', expect.any(String))
    expect(res).toHaveProperty('pTokenAddress', expect.any(String))
  }, TIMEOUT)
  // it('getProtocolFeeAccrued', async() => {
  //   const res = await everlastingOption.getProtocolFeeAccrued()
  //   expect(bg(res).toNumber()).toBeGreaterThan(2)
  // }, TIMEOUT)
  // it('OptionPricer', async() => {
  //   const res = await everlastingOption.OptionPricer()
  //   expect(res).toEqual('0xeEfaBc1B79Ec13ACA9FCAa96a5eC0811A576BaDc')
  // }, TIMEOUT)
  // it('PmmPricer', async() => {
  //   const res = await everlastingOption.PmmPricer()
  //   expect(res).toEqual('0xD8d8D8C994335bC521087281b53433dad5370602')
  // }, TIMEOUT)
  // it('_T', async() => {
  //   const res = await everlastingOption._T()
  //   expect(bg(res).toNumber()).toBeGreaterThan(0.002)
  // }, TIMEOUT)
  it(
    'getSymbol',
    async () => {
      const res = await everlastingOption.getSymbol('0');
      //expect(res).toHaveProperty('', '')
      expect(res).toEqual(
        expect.objectContaining({
          alpha: '0.01',
          cumulativePremiumFundingRate: expect.any(String),
          feeRatio: '0.005',
          isCall: true,
          multiplier: '0.01',
          oracleAddress: '0x18C036Ee25E205c224bD78f10aaf78715a2B6Ff1',
          strikePrice: '20000',
          symbol: 'BTCUSD-20000-C',
          symbolId: '0',
          tradersNetCost: expect.any(String),
          tradersNetVolume: expect.any(String),
          volatilityAddress: '0x7A4701A1A93BB7692351aEBcD4F5Fab1d4377BBc',
        })
      );
      expect(bg(res.tradersNetVolume).toNumber()).toBeGreaterThan(-200)
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
    const res = await viewer.getPoolStates(everlastingOption.contractAddress, [], [])
    expect(res.poolState.pToken).toEqual(OPTION_PTOKEN_ADDRESS)
  }, TIMEOUT)
});
