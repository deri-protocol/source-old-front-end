import {
  getPoolBTokensBySymbolId,
} from '../api'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('Trade query api', () => {
  it('getPoolBTokenBySymbol()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0']
    const output = [
      {
        bTokenId: '0',
        bTokenSymbol: 'BUSD',
        walletBalance: '0',
        availableBalance: '0'
      },
      {
        bTokenId: '1',
        bTokenSymbol: 'BETH',
        walletBalance: '0',
        availableBalance: '0'
      },
    ]
    expect(await getPoolBTokensBySymbolId(...input)).toEqual(output)
  }, TIMEOUT)
})