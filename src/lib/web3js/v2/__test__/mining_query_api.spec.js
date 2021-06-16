import {
  getPoolLiquidity,
  getLiquidityInfo,
} from '../api/mining_query_api'
import fetch from 'node-fetch'
import { DeriEnv } from '../../config'
global.fetch = fetch

const TIMEOUT=20000

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5', '0', true]
    const output = '12187.754865076298332719'
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityInfo()', async() => {
    const input = ['97', '0x54a71Cad29C314eA081b2B0b1Ac25a7cE3b7f7A5', '0xFFe85D82409c5b9D734066C134b0c2CCDd68C4dF', '0', true]
    //DeriEnv.set('prod')
    //const input = ['56', '0x19c2655A0e1639B189FB0CF06e02DC0254419D92', '0xB09C45dE1934041d6B4d00917e087248D2aacc26', '0', true]
    const output = {
      poolLiquidity: '12187.754865076298332719',
      shares: '1169.993876306494702719',
      maxRemovableShares: '1169.993876306494702719',
    }
    expect(await getLiquidityInfo(...input)).toEqual(output)
    //DeriEnv.set('dev')
  }, TIMEOUT)
})