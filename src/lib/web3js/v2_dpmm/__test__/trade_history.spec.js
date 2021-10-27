import { getTradeHistory } from '../api/trade_history_api'

describe('trade history v2 dpmm', () => {
  it('getTradeHistory', async() => {
    const res = await getTradeHistory(
      '97',
      '0x1018d827B8392afFcD72A7c8A5eED390cB0599B1',
      '0xFefC938c543751babc46cc1D662B982bd1636721',
      '0'
    );
    expect(res).toEqual([])
  }, 30000)
})