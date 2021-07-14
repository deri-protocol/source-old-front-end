// import { DeriEnv } from '../../config'
import { DeriEnv } from '../../config';
import {
  getPoolLiquidity,
  getLiquidityInfo,
} from '../api/mining_query_api'
import { TIMEOUT, POOL_ADDRESS } from './setup';

describe('Mining query api', () => {
  it('getPoolLiquidity()', async() => {
    const input = ['97', POOL_ADDRESS, '0', true]
    const output = {
      liquidity: '61000',
      symbol: '',
    };
    expect(await getPoolLiquidity(...input)).toEqual(output)
  }, TIMEOUT)
  it('getLiquidityInfo()', async() => {
    //const input = ['97', POOL_ADDRESS, ACCOUNT_ADDRESS, '0', true]
    //const input = ['56', '0x19c2655A0e1639B189FB0CF06e02DC0254419D92', '0xFefC938c543751babc46cc1D662B982bd1636721', '1' ]
    const input = ['137', '0x43b4dfb998b4D17705EEBfFCc0380c6b98699252', '0xFefC938c543751babc46cc1D662B982bd1636721', '1' ]
    const output = {
      maxRemovableShares: '1000',
      poolLiquidity: '61000',
      shares: '1000',
      pnl: '11.734170158538938'
    };
    DeriEnv.set('prod')
    expect(await getLiquidityInfo(...input)).toEqual(output)
    DeriEnv.set('dev')
  }, TIMEOUT)
})