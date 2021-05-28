import {
  getPoolLiquidity,
  getLiquidityInfo,
} from '../api/mining_query_api'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', '0x19EC6281749C06Ed9647134c57257AcA1508bFA8', '0', true]
    const output = '12187.754865076298332719'
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityInfo()', async() => {
    const input = ['97', '0x19EC6281749C06Ed9647134c57257AcA1508bFA8', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    const output = {
      poolLiquidity: '12187.754865076298332719',
      shares: '1169.993876306494702719',
      maxRemovableShares: '1169.993876306494702719',
    }
    expect(await getLiquidityInfo(...input)).toEqual(output)
  }, TIMEOUT)
})