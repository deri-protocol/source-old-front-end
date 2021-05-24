import {
  getPoolLiquidity,
  getLiquidityInfo,
} from '../api/mining_query_api'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0', '0', true]
    const output = '6040.987446450976269604'
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityInfo()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', '0', true]
    const output = {
      poolLiquidity: '6040.987446450976269604',
      liquidity: '1040.987446450976269604',
      maxRemovableliquidity: '1040.987446450976269604',
    }
    expect(await getLiquidityInfo(...input)).toEqual(output)
  }, TIMEOUT)
})