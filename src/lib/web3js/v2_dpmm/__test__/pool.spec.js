import { getPastEvents } from "../../shared"
import { perpetualPoolAbi } from "../contract/abi/perpetualPoolAbi"
import { perpetualPoolDpmmFactory} from "../contract/factory"

describe('test', () => {
  const account = '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF'
  it('pool init', async() => {
    const pool = perpetualPoolDpmmFactory('97', '0x1018d827B8392afFcD72A7c8A5eED390cB0599B1', '13435471')
    await pool.init()
    expect(pool.addresses).toEqual({
      lTokenAddress: '0x43f443A2Cb9b379972cCC0233625BC1500ba5136',
      pTokenAddress: '0xc8652144420632b7C5715d12cC8EA3143C035C5c',
      protocolFeeCollector: '0x3B6FCA4E50BF6233224eE8C5a1a99bae72748b68',
      routerAddress: '0x2492a9CB0f013684601D5B8317cAb66295584EF8',
    });
    expect(pool.parameters).toEqual({
      decimals0: '18',
      minBToken0Ratio: '0.2',
      initialMarginRatio: '0.1',
      liquidationCutRatio: '0.5',
      maintenanceMarginRatio: '0.05',
      maxLiquidationReward: '1000',
      minLiquidationReward: '0',
      minPoolMarginRatio: '1',
      protocolFeeCollectRatio: '0.2',
    });
    expect(pool.bTokenIds).toEqual(['0', '1'])
    expect(pool.bTokenSymbols).toEqual(['TBUSD', 'TWETH'])
    expect(pool.bTokens.map((s) => s.oracleAddress)).toEqual([
      '0x0000000000000000000000000000000000000000',
      '0xfcdc80bde588aFE80077c40ebbb780b5Db22D8F3',
    ]);
    expect(pool.activeSymbolIds).toEqual(['0', '1'])
    expect(pool.activeSymbolNames).toEqual(['BTCUSD', 'ETHUSD'])
    expect(pool.offChainOracleSymbolIds).toEqual([])
    expect(pool.offChainOracleSymbolNames).toEqual([])
    expect(pool.symbols.map((s) => s.oracleAddress)).toEqual([
      '0xCc88240D8CC260f19D2A0D3B1207e9B2757195fb',
      '0x6542EF23ab10372ac7490BEe522521383865ad49',
    ]);
    expect(await pool.getConfig()).toEqual({
      bTokenSymbols: ['TBUSD', 'TWETH'],
      bTokens: [
        {
          bToken: '0xaa2B8115c094445e96C2CD951c17a30F41867323',
          bTokenId: '0',
          bTokenSymbol: 'TBUSD',
        },
        {
          bToken: '0x8e60B350FA4fbaF209712bB721373364DE858A5d',
          bTokenId: '1',
          bTokenSymbol: 'TWETH',
        },
      ],
      chainId: '97',
      initialBlock: '13435471',
      lToken: '0x43f443A2Cb9b379972cCC0233625BC1500ba5136',
      pToken: '0xc8652144420632b7C5715d12cC8EA3143C035C5c',
      pool: '0x1018d827B8392afFcD72A7c8A5eED390cB0599B1',
      router: '0x2492a9CB0f013684601D5B8317cAb66295584EF8',
      symbols: [
        {
          symbol: 'BTCUSD',
          symbolId: '0',
          unit: 'BTC',
        },
        {
          symbol: 'ETHUSD',
          symbolId: '1',
          unit: 'ETH',
        },
      ],
      type: 'perpetual',
      version: 'v2',
      versionId: 'v2_dpmm',
    });
    expect((await pool.getBTokens()).length).toEqual(2)
    expect((await pool.getSymbols())[1].symbol).toEqual('ETHUSD')
    expect(pool.fundingPeriod).toEqual('259200')
    expect((await pool.getSymbols('0')).length).toEqual(1)
    expect((await pool.isSymbolsUpdated())).toEqual(true)
    expect((await pool.getPositions(account)).length).toEqual(2)
    expect((await pool.isPositionsUpdated())).toEqual(true)
    //expect((await pool.getTraderLiquidity(account))).toEqual("100")
    //expect((await pool.getDynamicEquity())).toEqual('')
    // //expect((await pool.getPoolRequiredMargin())).toEqual('')
    // expect((await pool.getTraderMarginStatus(account))).toEqual([])

  }, 30000)

  it(
    "format trade event",
    async () => {
      const pool = perpetualPoolDpmmFactory(
        "97",
        "0x1018d827B8392afFcD72A7c8A5eED390cB0599B1"
      );
      await pool.init();
      const events = await getPastEvents(
        "97",
        pool.contract,
        "Trade",
        {},
        13584390,
        13584390
      );
      let res
      if (events.length > 0) {
        res = await pool.formatTradeEvent(events[0]);
      } else {
        res = {};
      }
      expect(res).toEqual({ hello: "test" });
    },
   30000 
  );
})