import {
  getPoolLiquidity
} from '../api/mining_query_api'
import fetch from 'node-fetch'
global.fetch = fetch

const TIMEOUT=20000

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', '0x7dB32101081B17E105283820b2Ed3659DFE21470', '0', '0', true]
    const output = '6039.408863224325731856' 
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
})