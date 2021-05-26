import {
  getPoolLiquidity,
  getLiquidityInfo,
} from '../api/mining_query_api'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0', true]
    const output = '12187.754865076298332719'
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityInfo()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = {
      poolLiquidity: '12187.754865076298332719',
      shared: '1169.993876306494702719',
      maxRemovableShares: '1169.993876306494702719',
    }
    expect(await getLiquidityInfo(...input)).toEqual(output)
  }, TIMEOUT)
})